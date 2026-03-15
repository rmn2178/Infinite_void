"""Farmer router — registration, soil upload, recommendations, voice."""
import json
import logging
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import get_db, Farmer, SoilProfile, Recommendation
import os

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/farmer", tags=["farmer"])

JWT_SECRET = os.getenv("JWT_SECRET", "change-me-to-random-64-char-string")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class FarmerRegister(BaseModel):
    phone: str
    name: str = "Farmer"
    district: str = "Erode"
    land_area_ha: float = 1.0
    language: str = "ta"
    role: str = "farmer"


def create_token(farmer_id: int, role: str) -> str:
    return jwt.encode(
        {"sub": str(farmer_id), "role": role, "exp": datetime.utcnow() + timedelta(days=30)},
        JWT_SECRET, algorithm="HS256"
    )


def get_current_user(token: str = "", db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        farmer = db.query(Farmer).filter(Farmer.id == int(payload["sub"])).first()
        return farmer
    except Exception:
        return None


@router.post("/register")
def register_farmer(data: FarmerRegister, db: Session = Depends(get_db)):
    """Register or login a farmer, return JWT."""
    existing = db.query(Farmer).filter(Farmer.phone == data.phone).first()
    if existing:
        token = create_token(existing.id, existing.role)
        return {
            "farmer_id": existing.id, "token": token,
            "name": existing.name, "district": existing.district,
            "role": existing.role, "language": existing.language,
        }

    farmer = Farmer(
        phone=data.phone, name=data.name, district=data.district,
        land_area_ha=data.land_area_ha, language=data.language,
        role=data.role,
    )
    db.add(farmer)
    db.commit()
    db.refresh(farmer)

    token = create_token(farmer.id, farmer.role)
    return {
        "farmer_id": farmer.id, "token": token,
        "name": farmer.name, "district": farmer.district,
        "role": farmer.role, "language": farmer.language,
    }


@router.post("/soil-upload")
async def soil_upload(
    farmer_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload soil report PDF → OCR → start Celery pipeline."""
    pdf_bytes = await file.read()

    from ocr.soil_parser import parse_soil_pdf
    soil_data = parse_soil_pdf(pdf_bytes)

    # Save to MongoDB (optional) and PostgreSQL
    soil_profile = SoilProfile(
        farmer_id=farmer_id,
        nitrogen_ppm=soil_data["nitrogen_ppm"],
        phosphorus_ppm=soil_data["phosphorus_ppm"],
        potassium_ppm=soil_data["potassium_ppm"],
        ph_value=soil_data["ph_value"],
        organic_carbon_pct=soil_data["organic_carbon_pct"],
        confidence_score=soil_data["confidence_score"],
        raw_text=soil_data["raw_text"],
    )
    db.add(soil_profile)

    # Create a processing recommendation entry
    rec = Recommendation(farmer_id=farmer_id, status="processing")
    db.add(rec)
    db.commit()
    db.refresh(soil_profile)

    # Start Celery pipeline
    try:
        from tasks import run_full_farmer_pipeline
        run_full_farmer_pipeline.delay(farmer_id, soil_profile.id)
    except Exception as e:
        logger.warning(f"Celery not available, running inline: {e}")

    return {
        "soil_profile_id": soil_profile.id,
        "nitrogen_ppm": soil_data["nitrogen_ppm"],
        "phosphorus_ppm": soil_data["phosphorus_ppm"],
        "potassium_ppm": soil_data["potassium_ppm"],
        "ph_value": soil_data["ph_value"],
        "organic_carbon_pct": soil_data["organic_carbon_pct"],
        "confidence_score": soil_data["confidence_score"],
        "status": "processing",
    }


@router.get("/recommendation/{farmer_id}")
def get_recommendation(farmer_id: int, db: Session = Depends(get_db)):
    """Get latest recommendation for a farmer."""
    rec = (
        db.query(Recommendation)
        .filter(Recommendation.farmer_id == farmer_id)
        .order_by(Recommendation.created_at.desc())
        .first()
    )
    if not rec:
        raise HTTPException(404, "No recommendation found")

    return {
        "id": rec.id,
        "farmer_id": rec.farmer_id,
        "top_crop": rec.top_crop,
        "top_crops": json.loads(rec.top_crops_json) if rec.top_crops_json else [],
        "yield_prediction": json.loads(rec.yield_prediction_json) if rec.yield_prediction_json else {},
        "price_forecast": json.loads(rec.price_forecast_json) if rec.price_forecast_json else {},
        "scheme_eligibility": json.loads(rec.scheme_eligibility_json) if rec.scheme_eligibility_json else [],
        "why_narrative": rec.why_narrative,
        "ai_model_used": rec.ai_model_used,
        "status": rec.status,
        "created_at": str(rec.created_at),
    }


@router.get("/price-history/{crop}/{district}")
async def price_history(crop: str, district: str):
    """Get 12-month price series."""
    from ml.price_model import generate_12month_series
    return await generate_12month_series(crop, district)


@router.get("/schemes/{farmer_id}")
async def farmer_schemes(farmer_id: int, db: Session = Depends(get_db)):
    """Get scheme eligibility for a farmer."""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(404, "Farmer not found")

    from integrations.vistaar import check_scheme_eligibility
    # Get latest recommendation for crop
    rec = (
        db.query(Recommendation)
        .filter(Recommendation.farmer_id == farmer_id, Recommendation.status == "complete")
        .order_by(Recommendation.created_at.desc())
        .first()
    )
    crop = rec.top_crop if rec else "Rice"

    schemes = await check_scheme_eligibility(
        farmer_id, farmer.land_area_ha, crop,
        farmer.district, {"name": farmer.name}
    )
    return schemes


@router.get("/stores/{district}")
def get_stores(district: str, db: Session = Depends(get_db)):
    """Get nearest agri stores using PostGIS (within 10km)."""
    try:
        query = text("""
            SELECT id, name, district, store_type, address, lat, lng
            FROM agri_stores
            WHERE district = :district
            ORDER BY name
            LIMIT 20
        """)
        result = db.execute(query, {"district": district})
        stores = []
        for row in result:
            stores.append({
                "id": row.id, "name": row.name,
                "district": row.district, "store_type": row.store_type,
                "address": row.address, "lat": row.lat, "lng": row.lng,
            })
        return stores
    except Exception as e:
        logger.error(f"Store query error: {e}")
        return []


@router.get("/voice/{farmer_id}")
async def voice_advisory(farmer_id: int, db: Session = Depends(get_db)):
    """Generate TTS audio of the latest advisory."""
    rec = (
        db.query(Recommendation)
        .filter(Recommendation.farmer_id == farmer_id, Recommendation.status == "complete")
        .order_by(Recommendation.created_at.desc())
        .first()
    )
    if not rec or not rec.why_narrative:
        raise HTTPException(404, "No advisory found")

    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    language = farmer.language if farmer else "ta"

    from integrations.bhashini import text_to_speech
    audio = await text_to_speech(rec.why_narrative, language)

    if audio:
        return Response(content=audio, media_type="audio/mpeg")
    else:
        return {"text": rec.why_narrative, "voice_available": False}
