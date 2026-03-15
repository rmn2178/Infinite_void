"""Air Quality Index for Crop Protection using OpenAQ."""
import os
import json
import logging
from datetime import datetime
import httpx
import redis.asyncio as aioredis

logger = logging.getLogger(__name__)

DISTRICT_CITY_MAP = {
  "Erode": "Erode", "Salem": "Salem", "Madurai": "Madurai",
  "Thanjavur": "Thanjavur", "Coimbatore": "Coimbatore", "Trichy": "Tiruchirappalli",
  "Vellore": "Vellore", "Tirunelveli": "Tirunelveli", "Chennai": "Chennai", "Tiruppur": "Tiruppur"
}

OPENAQ_BASE = "https://api.openaq.org/v3"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

async def get_redis():
    return aioredis.from_url(REDIS_URL, decode_responses=True)

async def get_aqi(district: str) -> dict:
    cache_key = f"aqi:{district}"
    try:
        r = await get_redis()
        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.warning(f"Redis error: {e}")
        r = None

    city = DISTRICT_CITY_MAP.get(district, district)
    
    fallback = {
        "district": district,
        "pm25": None,
        "pm10": None,
        "aqi_label": "Unavailable",
        "crop_advice": "Data unavailable for this district",
        "source": "unavailable",
        "last_updated": datetime.now().isoformat()
    }
    
    headers = {"Accept": "application/json"}
    
    try:
        async with httpx.AsyncClient(timeout=10, headers=headers) as client:
            loc_params = {"city": city, "country_id": 133, "limit": 5} # 133 for IN based on v3 docs usually, but user specified IN? Oh user said country_id=IN, I'll pass IN.
            loc_params["country_id"] = "IN"
            loc_resp = await client.get(f"{OPENAQ_BASE}/locations", params=loc_params)
            loc_resp.raise_for_status()
            loc_data = loc_resp.json()
            
            results = loc_data.get("results", [])
            if not results:
                return fallback
                
            location_id = results[0].get("id")
            
            pm25_resp = await client.get(f"{OPENAQ_BASE}/measurements", params={"location_id": location_id, "parameters_id": 2, "limit": 1})
            pm10_resp = await client.get(f"{OPENAQ_BASE}/measurements", params={"location_id": location_id, "parameters_id": 1, "limit": 1})
            
            pm25_data = pm25_resp.json().get("results", [])
            pm10_data = pm10_resp.json().get("results", [])
            
            pm25_val = pm25_data[0].get("value") if pm25_data else None
            pm10_val = pm10_data[0].get("value") if pm10_data else None
            
            if pm25_val is None:
                return fallback
                
            pm25 = float(pm25_val)
            
            if pm25 <= 12:
                aqi_label = "Good"
                crop_advice = "Air quality suitable for field operations"
            elif pm25 <= 35:
                aqi_label = "Moderate"
                crop_advice = "Air quality suitable for field operations"
            elif pm25 <= 55:
                aqi_label = "Unhealthy for sensitive"
                crop_advice = "Limit outdoor spraying. High PM may clog spray nozzles."
            elif pm25 <= 150:
                aqi_label = "Unhealthy"
                crop_advice = "Limit outdoor spraying. High PM may clog spray nozzles."
            else:
                aqi_label = "Hazardous"
                crop_advice = "Avoid field operations. Protect stored grain from dust contamination."
                
            result = {
                "district": district,
                "pm25": pm25,
                "pm10": float(pm10_val) if pm10_val else None,
                "aqi_label": aqi_label,
                "crop_advice": crop_advice,
                "source": "openaq",
                "last_updated": datetime.now().isoformat()
            }
            
            if r:
                try:
                    await r.setex(cache_key, 1800, json.dumps(result))
                except Exception:
                    pass
                    
            return result
            
    except Exception as e:
        logger.error(f"AQI error for {district}: {e}")
        return fallback
