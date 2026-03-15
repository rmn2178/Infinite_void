"""Solar & Wind Energy Potential for Farms using Open-Meteo."""
import httpx
import logging
from .nasa_weather import DISTRICT_COORDS

logger = logging.getLogger(__name__)

async def get_energy_potential(district: str) -> dict:
    coords = DISTRICT_COORDS.get(district)
    if not coords:
        return {"error": f"Unknown district: {district}"}
        
    lat, lng = coords

    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "shortwave_radiation_sum,wind_speed_10m_max",
        "hourly": "windspeed_10m",
        "past_days": 30,
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
        
        dates = daily.get("time", [])[-7:] # Only take forecast part for dates if needed
        solar_mj = [v for v in daily.get("shortwave_radiation_sum", []) if v is not None]
        wind_max = [v for v in daily.get("wind_speed_10m_max", []) if v is not None]
        wind_hourly = [v for v in hourly.get("windspeed_10m", []) if v is not None]

        # MJ/m² to kWh/m² factor is 0.2778
        avg_solar_kwh_m2 = (sum(solar_mj) / len(solar_mj) * 0.2778) if solar_mj else 0
        avg_wind_kmh = (sum(wind_max) / len(wind_max)) if wind_max else 0

        if avg_solar_kwh_m2 > 5.5:
            solar_potential = "Excellent"
        elif avg_solar_kwh_m2 >= 4.0:
            solar_potential = "Good"
        elif avg_solar_kwh_m2 >= 3.0:
            solar_potential = "Moderate"
        else:
            solar_potential = "Poor"

        if avg_wind_kmh > 15:
            wind_potential = "Good"
        elif avg_wind_kmh >= 10:
            wind_potential = "Moderate"
        else:
            wind_potential = "Low"

        recommended_system = "Solar"
        if avg_solar_kwh_m2 > 4.5 and avg_wind_kmh > 14:
            recommended_system = "Hybrid"
        elif avg_wind_kmh > 14 and avg_solar_kwh_m2 < 4.0:
            recommended_system = "Wind"

        est_solar_units_per_day_per_kw = avg_solar_kwh_m2 * 5
        co2_saved_kg_per_day_per_kw = est_solar_units_per_day_per_kw * 0.82

        seven_day_solar_forecast = []
        # Find exactly where the next 7 days are in the daily response
        # Total days returned = past_days + forecast_days = 37 days (index 30 to 36)
        if len(daily.get("time", [])) >= 7:
            for i in range(len(daily.get("time", [])) - 7, len(daily.get("time", []))):
                d_str = daily["time"][i]
                d_sol = daily["shortwave_radiation_sum"][i]
                seven_day_solar_forecast.append({
                    "date": d_str,
                    "kwh_m2": round(d_sol * 0.2778, 2) if d_sol is not None else 0
                })

        return {
            "district": district,
            "avg_solar_kwh_m2": round(avg_solar_kwh_m2, 2),
            "avg_wind_kmh": round(avg_wind_kmh, 1),
            "solar_potential": solar_potential,
            "wind_potential": wind_potential,
            "recommended_system": recommended_system,
            "est_solar_units_per_day_per_kw": round(est_solar_units_per_day_per_kw, 2),
            "co2_saved_kg_per_day_per_kw": round(co2_saved_kg_per_day_per_kw, 2),
            "subsidy_scheme": "PM-KUSUM scheme: up to 60% subsidy on solar pumps for farmers",
            "7day_solar_forecast": seven_day_solar_forecast
        }

    except Exception as e:
        logger.error(f"Energy potential error for {district}: {e}")
        return {
            "district": district,
            "error": str(e),
            "avg_solar_kwh_m2": 0,
            "avg_wind_kmh": 0,
            "solar_potential": "Unknown",
            "wind_potential": "Unknown",
            "recommended_system": "Unknown",
            "est_solar_units_per_day_per_kw": 0,
            "co2_saved_kg_per_day_per_kw": 0,
            "subsidy_scheme": "",
            "7day_solar_forecast": []
        }
