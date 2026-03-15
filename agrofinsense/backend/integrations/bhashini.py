"""Bhashini TTS integration (optional — requires API key)."""
import os
import logging
import httpx

logger = logging.getLogger(__name__)
BHASHINI_KEY = os.getenv("BHASHINI_KEY", "")
BHASHINI_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"


async def text_to_speech(text: str, language: str = "ta") -> bytes | None:
    """Convert text to speech using Bhashini API. Returns audio bytes or None."""
    if not BHASHINI_KEY:
        logger.info("Bhashini key not configured — text-only mode")
        return None

    try:
        body = {
            "pipelineTasks": [
                {
                    "taskType": "tts",
                    "config": {
                        "language": {
                            "sourceLanguage": language
                        }
                    }
                }
            ],
            "inputData": {
                "input": [{"source": text}]
            }
        }

        headers = {
            "Authorization": BHASHINI_KEY,
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(BHASHINI_URL, json=body, headers=headers)
            resp.raise_for_status()
            data = resp.json()

            audio_content = (
                data.get("pipelineResponse", [{}])[0]
                .get("audio", [{}])[0]
                .get("audioContent", None)
            )

            if audio_content:
                import base64
                return base64.b64decode(audio_content)

    except Exception as e:
        logger.warning(f"Bhashini TTS error: {e}")

    return None
