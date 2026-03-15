"""Flood / Drought Alert System using Open-Meteo."""
import httpx
import logging
from .nasa_weather import DISTRICT_COORDS

logger = logging.getLogger(__name__)

async def get_district_alerts(district: str) -> dict:
    coords = DISTRICT_COORDS.get(district)
    if not coords:
        return {"error": f"Unknown district: {district}"}
        
    lat, lng = coords

    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "precipitation_sum,weathercode,wind_speed_10m_max,temperature_2m_max",
        "hourly": "precipitation,soil_moisture_0_to_1cm",
        "forecast_days": 7,
        "timezone": "Asia/Kolkata"
    }
    
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get("https://api.open-meteo.com/v1/forecast", params=params)
            resp.raise_for_status()
            data = resp.json()
            
        daily = data.get("daily", {})
        hourly = data.get("hourly", {})
        
        dates = daily.get("time", [])
        rain_sum = daily.get("precipitation_sum", [])
        wmo_codes = daily.get("weathercode", [])
        wind_max = daily.get("wind_speed_10m_max", [])
        temp_max = daily.get("temperature_2m_max", [])
        
        soil_hourly = [v for v in hourly.get("soil_moisture_0_to_1cm", []) if v is not None]
        soil_moisture_avg = sum(soil_hourly) / len(soil_hourly) if soil_hourly else 0.5
        
        alerts = []
        forecast = []
        max_risk = "safe"
        
        def update_risk(current, new_risk):
            levels = {"safe": 0, "low": 1, "moderate": 2, "high": 3}
            if levels.get(new_risk, 0) > levels.get(current, 0):
                return new_risk
            return current
            
        def get_wmo_condition(code):
            if code == 0: return "Clear"
            if 1 <= code <= 3: return "Partly cloudy"
            if 45 <= code <= 48: return "Fog"
            if 51 <= code <= 55: return "Drizzle"
            if 61 <= code <= 65: return "Rain"
            if 71 <= code <= 77: return "Snow"
            if 80 <= code <= 82: return "Showers"
            if code == 95: return "Thunderstorm"
            if code == 99: return "Heavy thunderstorm"
            return "Unknown"

        total_forecast_rain = sum([r for r in rain_sum if r is not None])
        
        if total_forecast_rain == 0 and soil_moisture_avg < 0.1:
            alerts.append({"type": "DROUGHT", "level": "HIGH", "message": "Zero rainfall forecast and very low soil moisture.", "date": "Next 7 Days"})
            max_risk = update_risk(max_risk, "high")
        elif total_forecast_rain == 0 and soil_moisture_avg < 0.2:
            alerts.append({"type": "DROUGHT", "level": "MODERATE", "message": "No rain forecast, monitoring soil moisture.", "date": "Next 7 Days"})
            max_risk = update_risk(max_risk, "moderate")
            
        for i, date_str in enumerate(dates):
            r = rain_sum[i] if i < len(rain_sum) and rain_sum[i] is not None else 0
            code = wmo_codes[i] if i < len(wmo_codes) and wmo_codes[i] is not None else 0
            w = wind_max[i] if i < len(wind_max) and wind_max[i] is not None else 0
            t = temp_max[i] if i < len(temp_max) and temp_max[i] is not None else 0
            
            cond = get_wmo_condition(code)
            forecast.append({
                "date": date_str,
                "rain_mm": r,
                "condition": cond,
                "wind_kmh": w
            })
            
            if r > 50:
                alerts.append({"type": "FLOOD", "level": "HIGH", "message": f"Heavy rainfall ({r}mm) expected.", "date": date_str})
                max_risk = update_risk(max_risk, "high")
            elif r > 25:
                alerts.append({"type": "FLOOD", "level": "MODERATE", "message": f"Moderate rainfall ({r}mm) expected.", "date": date_str})
                max_risk = update_risk(max_risk, "moderate")
                
            if t > 40:
                alerts.append({"type": "HEATWAVE", "level": "HIGH", "message": f"Extreme temperatures ({t}°C) expected.", "date": date_str})
                max_risk = update_risk(max_risk, "high")
                
        return {
            "district": district,
            "alerts": alerts,
            "7day_forecast": forecast,
            "overall_risk": max_risk
        }
        
    except Exception as e:
        logger.error(f"Alerts error for {district}: {e}")
        return {
            "district": district,
            "alerts": [],
            "7day_forecast": [],
            "overall_risk": "safe",
            "error": str(e)
        }
