"""NDVI / Crop Health Monitor using Open-Meteo soil and ET0 data as proxy."""
import httpx
import logging
from .nasa_weather import DISTRICT_COORDS

logger = logging.getLogger(__name__)

async def get_crop_health(district: str) -> dict:
    coords = DISTRICT_COORDS.get(district)
    if not coords:
        return {"error": f"Unknown district: {district}"}
        
    lat, lng = coords

    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "et0_fao_evapotranspiration,soil_moisture_0_to_1cm",
        "past_days": 30,
        "timezone": "Asia/Kolkata"
    }
    
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get("https://api.open-meteo.com/v1/forecast", params=params)
            resp.raise_for_status()
            data = resp.json()
            
        daily = data.get("daily", {})
        et0 = [v for v in daily.get("et0_fao_evapotranspiration", []) if v is not None]
        soil = [v for v in daily.get("soil_moisture_0_to_1cm", []) if v is not None]
        
        et0_avg = sum(et0) / len(et0) if et0 else 0
        soil_moisture_avg = sum(soil) / len(soil) if soil else 0
        
        health_index = (soil_moisture_avg * 10 + (1 - et0_avg/8)) / 2
        health_index = max(0.0, min(1.0, health_index)) # clip 0-1
        
        if health_index > 0.7:
            health_label = "Excellent"
        elif health_index >= 0.5:
            health_label = "Good"
        elif health_index >= 0.3:
            health_label = "Moderate"
        else:
            health_label = "Stressed"
            
        return {
            "district": district,
            "et0_avg": round(et0_avg, 2),
            "soil_moisture_avg": round(soil_moisture_avg, 3),
            "health_index": round(health_index, 2),
            "health_label": health_label,
            "et0_daily": et0[-14:] if et0 else [],
            "soil_moisture_daily": soil[-14:] if soil else [],
        }
            
    except Exception as e:
        logger.error(f"Crop health error for {district}: {e}")
        return {
            "district": district,
            "error": str(e),
            "et0_avg": 0,
            "soil_moisture_avg": 0,
            "health_index": 0,
            "health_label": "Unknown",
            "et0_daily": [],
            "soil_moisture_daily": []
        }
