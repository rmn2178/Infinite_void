"""Ollama AI integration — local LLM calls via REST API.

Uses:
- gemma3:4b for long-form narratives (Tamil advisory, gov briefings)
- llama3.2:3b for fast structured JSON tasks (yield reasoning, risk classification)
"""
import os
import json
import time
import logging
import httpx

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_NARRATIVE_MODEL = os.getenv("OLLAMA_NARRATIVE_MODEL", "gemma3:4b")
OLLAMA_FAST_MODEL = os.getenv("OLLAMA_FAST_MODEL", "llama3.2:3b")


class OllamaUnavailableError(Exception):
    pass


async def _call_ollama(
    model: str,
    prompt: str,
    temperature: float = 0.3,
    num_predict: int = 512
) -> str:
    """Private base function for all Ollama calls."""
    timeout = 60.0 if "gemma" in model else 30.0
    url = f"{OLLAMA_BASE_URL}/api/generate"
    body = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": num_predict,
        }
    }

    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, json=body)
            response.raise_for_status()
            result = response.json()
            output = result.get("response", "")
            elapsed = time.time() - start
            logger.info(
                f"Ollama [{model}] prompt_len={len(prompt)} "
                f"response_len={len(output)} time={elapsed:.1f}s"
            )
            return output
    except httpx.TimeoutException:
        raise OllamaUnavailableError(
            f"Ollama timed out after {timeout}s. Run: ollama serve"
        )
    except httpx.ConnectError:
        raise OllamaUnavailableError(
            "Ollama not responding. Run: ollama serve"
        )


LANGUAGE_MAP = {"ta": "Tamil", "hi": "Hindi", "en": "English"}


async def generate_why_narrative(
    farmer_profile: dict,
    soil: dict,
    yield_pred: dict,
    price_forecast: dict,
    schemes: list,
    language: str = "ta"
) -> str:
    """Generate a friendly farming advisory using gemma3:4b."""
    language_name = LANGUAGE_MAP.get(language, "English")
    eligible_schemes = ", ".join(
        [s["scheme_name"] for s in schemes if s.get("eligible")]
    ) or "None found"

    prompt = f"""You are a helpful agricultural advisor for Tamil Nadu farmers.
Write a friendly advisory in {language_name} language for this farmer.

Farmer: {farmer_profile.get('name', 'Farmer')}, {farmer_profile.get('district', 'Tamil Nadu')} district, {farmer_profile.get('land_area_ha', 1.0)} hectares
Soil test results: Nitrogen={soil.get('nitrogen_ppm', 0)} kg/ha, Phosphorus={soil.get('phosphorus_ppm', 0)} kg/ha, Potassium={soil.get('potassium_ppm', 0)} kg/ha, pH={soil.get('ph_value', 7.0)}, Organic Carbon={soil.get('organic_carbon_pct', 0.5)}%
Best crop recommendation: {yield_pred.get('crop', 'Rice')} with predicted yield {yield_pred.get('predicted_kg_per_ha', 2500)} kg/ha
Price forecast: {price_forecast.get('direction', 'stable')} trend, {price_forecast.get('confidence_pct', 70)}% confidence. Reason: {price_forecast.get('weather_driver', 'seasonal pattern')}
Eligible government schemes: {eligible_schemes}

Write exactly 3 short paragraphs in {language_name}:
Paragraph 1: Why this crop suits the soil (mention N, P, K values directly)
Paragraph 2: When to sow and why the price timing is good (mention % forecast and weather reason)
Paragraph 3: Which schemes they qualify for and the benefit amounts in rupees
End with one bold line: the exact sow window dates.
Maximum 200 words total. Write naturally like you are talking to a village farmer."""

    return await _call_ollama(
        model=OLLAMA_NARRATIVE_MODEL,
        prompt=prompt,
        temperature=0.4,
        num_predict=600
    )


async def predict_yield_with_reasoning(
    soil: dict,
    weather: dict,
    crop: str,
    district: str
) -> dict:
    """Get yield prediction with reasoning from llama3.2:3b as JSON."""
    prompt = f"""You are an agricultural AI. Return ONLY a JSON object, no other text.

Crop: {crop}, District: {district}, Tamil Nadu, India
Soil: N={soil.get('nitrogen_ppm', 0)}kg/ha, P={soil.get('phosphorus_ppm', 0)}kg/ha, K={soil.get('potassium_ppm', 0)}kg/ha, pH={soil.get('ph_value', 7.0)}, OC={soil.get('organic_carbon_pct', 0.5)}%
Weather: rainfall deviation {weather.get('rainfall_deviation_pct', 0)}% from 30yr average, avg max temp {weather.get('avg_temp_max', 32)}°C

Return this exact JSON:
{{"estimated_yield_kg_per_ha": <number>, "confidence": "<high/medium/low>", "limiting_factor": "<string>", "recommendation": "<string>", "risk_score": <0-100>}}"""

    safe_defaults = {
        "estimated_yield_kg_per_ha": 2500.0,
        "confidence": "low",
        "limiting_factor": "Model parse error",
        "recommendation": "Consult local agricultural officer",
        "risk_score": 50
    }

    for attempt in range(2):
        try:
            raw = await _call_ollama(
                model=OLLAMA_FAST_MODEL,
                prompt=prompt if attempt == 0 else (
                    prompt + "\n\nCRITICAL: Return ONLY the JSON object. "
                    "Nothing before or after the braces. Start with { and end with }."
                ),
                temperature=0.1,
                num_predict=256
            )
            # Extract JSON from response
            start_idx = raw.find("{")
            end_idx = raw.rfind("}") + 1
            if start_idx >= 0 and end_idx > start_idx:
                return json.loads(raw[start_idx:end_idx])
        except (json.JSONDecodeError, OllamaUnavailableError) as e:
            logger.warning(f"Yield reasoning attempt {attempt+1} failed: {e}")
            if attempt == 1:
                return safe_defaults

    return safe_defaults


async def generate_district_gov_summary(
    district: str,
    yield_data: dict,
    budget_data: dict,
    storage_data: dict
) -> str:
    """Generate a gov procurement briefing using gemma3:4b."""
    prompt = f"""You are a senior analyst for Tamil Nadu Agriculture Department. Write a factual procurement briefing.

District: {district}, Tamil Nadu
Season: {yield_data.get('season', 'Kharif 2025')}
Forecast yield: {yield_data.get('total_tonnage_mt', 0):,.0f} MT of {yield_data.get('crop', 'Rice')}
MSP procurement budget required: ₹{budget_data.get('procurement_cost_inr', 0)/10000000:.1f} crore at MSP ₹{budget_data.get('msp_used', 2300)}/quintal
PMFBY expected payout: ₹{budget_data.get('pmfby_payout_est_inr', 0)/10000000:.1f} crore
Total scheme spend: ₹{budget_data.get('total_scheme_spend', 0)/10000000:.1f} crore
Warehouse utilisation: {storage_data.get('utilisation_pct', 70):.1f}%
Storage gap: {storage_data.get('storage_gap_mt', 0):,.0f} MT

Write a 2-paragraph briefing for the District Collector:
Paragraph 1: Procurement timeline and action needed (what, when, at what MSP price)
Paragraph 2: Storage situation and logistics recommendation
Be factual. Official tone. Under 120 words. Use ₹ crore for money."""

    return await _call_ollama(
        model=OLLAMA_NARRATIVE_MODEL,
        prompt=prompt,
        temperature=0.2,
        num_predict=400
    )


async def classify_crop_risk(
    crop: str,
    weather_volatility: float,
    price_direction: str,
    storage_gap_mt: float
) -> dict:
    """Fast risk classification using llama3.2:3b."""
    prompt = f"""Return ONLY JSON. Classify risk for this crop situation:
Crop: {crop}, Weather volatility score: {weather_volatility}/1.0, Price trend: {price_direction}, Storage gap: {storage_gap_mt} MT

{{"overall_risk": "<low/medium/high/critical>", "risk_score": <0-100>, "primary_risk_factor": "<string>", "action": "<string>"}}"""

    safe_defaults = {
        "overall_risk": "medium",
        "risk_score": 50,
        "primary_risk_factor": "Unable to classify",
        "action": "Monitor situation"
    }

    try:
        raw = await _call_ollama(
            model=OLLAMA_FAST_MODEL,
            prompt=prompt,
            temperature=0.0,
            num_predict=128
        )
        start_idx = raw.find("{")
        end_idx = raw.rfind("}") + 1
        if start_idx >= 0 and end_idx > start_idx:
            return json.loads(raw[start_idx:end_idx])
    except (json.JSONDecodeError, OllamaUnavailableError) as e:
        logger.warning(f"Risk classification failed: {e}")

    return safe_defaults


async def health_check() -> dict:
    """Check if Ollama is running and both models are available."""
    result = {
        "ollama_running": False,
        "gemma3_4b_available": False,
        "llama3_2_3b_available": False,
        "base_url": OLLAMA_BASE_URL,
    }
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            resp.raise_for_status()
            data = resp.json()
            models = [m.get("name", "") for m in data.get("models", [])]
            result["ollama_running"] = True
            result["gemma3_4b_available"] = any("gemma3" in m for m in models)
            result["llama3_2_3b_available"] = any("llama3.2" in m for m in models)
    except Exception as e:
        logger.warning(f"Ollama health check failed: {e}")

    return result
