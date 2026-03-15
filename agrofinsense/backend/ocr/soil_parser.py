"""EasyOCR + PyMuPDF soil report PDF parser."""
import re
import logging
import io
import fitz  # PyMuPDF
import easyocr
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

_reader = None


def _get_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(["en"], gpu=False)
    return _reader


def parse_soil_pdf(pdf_bytes: bytes) -> dict:
    """Extract N/P/K/pH/OC from a soil test report PDF."""
    raw_text = ""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        reader = _get_reader()

        for page in doc:
            # Render at 200 DPI
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_bytes))
            img_np = np.array(img)

            results = reader.readtext(img_np, detail=0)
            raw_text += " ".join(results) + "\n"

        doc.close()
    except Exception as e:
        logger.error(f"PDF parsing error: {e}")
        raw_text = ""

    # Extract values using regex patterns
    nitrogen = _extract_value(raw_text, [
        r"nitrogen[:\s]*(\d+\.?\d*)",
        r"N[:\s]*(\d+\.?\d*)\s*(?:kg|ppm|mg)",
        r"available\s*N[:\s]*(\d+\.?\d*)",
    ])

    phosphorus = _extract_value(raw_text, [
        r"phosphorus[:\s]*(\d+\.?\d*)",
        r"P[:\s]*(\d+\.?\d*)\s*(?:kg|ppm|mg)",
        r"available\s*P[:\s]*(\d+\.?\d*)",
    ])

    potassium = _extract_value(raw_text, [
        r"potassium[:\s]*(\d+\.?\d*)",
        r"K[:\s]*(\d+\.?\d*)\s*(?:kg|ppm|mg)",
        r"available\s*K[:\s]*(\d+\.?\d*)",
    ])

    ph_value = _extract_value(raw_text, [
        r"pH[:\s]*(\d+\.?\d*)",
        r"soil\s*pH[:\s]*(\d+\.?\d*)",
        r"reaction.*?(\d+\.?\d*)",
    ])

    organic_carbon = _extract_value(raw_text, [
        r"organic\s*carbon[:\s]*(\d+\.?\d*)",
        r"OC[:\s]*(\d+\.?\d*)\s*%",
        r"carbon[:\s]*(\d+\.?\d*)",
    ])

    # Calculate confidence based on how many values were found
    found_count = sum(1 for v in [nitrogen, phosphorus, potassium, ph_value, organic_carbon] if v is not None)
    confidence = found_count / 5.0

    return {
        "nitrogen_ppm": nitrogen or 180.0,
        "phosphorus_ppm": phosphorus or 22.0,
        "potassium_ppm": potassium or 160.0,
        "ph_value": ph_value or 6.5,
        "organic_carbon_pct": organic_carbon or 0.6,
        "confidence_score": round(confidence, 2),
        "raw_text": raw_text[:2000],
    }


def _extract_value(text: str, patterns: list[str]) -> float | None:
    """Try multiple regex patterns to extract a numeric value."""
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                val = float(match.group(1))
                if 0 < val < 100000:  # sanity check
                    return val
            except (ValueError, IndexError):
                continue
    return None
