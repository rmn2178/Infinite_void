"""Open-Meteo API integration for weather data (no API key required)."""
import os
import logging
from datetime import datetime, timedelta
import httpx
from db.models import SessionLocal, WeatherSnapshot

logger = logging.getLogger(__name__)

DISTRICT_COORDS: dict[str, tuple[float, float]] = {
    "Erode": (11.341, 77.726),
    "Salem": (11.664, 78.145),
    "Madurai": (9.925, 78.119),
    "Thanjavur": (10.787, 79.138),
    "Coimbatore": (11.017, 76.971),
    "Trichy": (10.805, 78.686),
    "Vellore": (12.916, 79.132),
    "Tirunelveli": (8.727, 77.695),
    "Chennai": (13.083, 80.270),
    "Tiruppur": (11.108, 77.341),
}

DISTRICT_30YR_RAINFALL_MM: dict[str, float] = {
    "Erode": 680, "Salem": 925, "Madurai": 858, "Thanjavur": 1020,
    "Coimbatore": 685, "Trichy": 838, "Vellore": 1000,
    "Tirunelveli": 660, "Chennai": 1400, "Tiruppur": 690,
}


async def fetch_weather_forecast(district: str, forecast_days: int = 180) -> dict:
    """Fetch weather data from Open-Meteo API."""
    coords = DISTRICT_COORDS.get(district)
    if not coords:
        return {"error": f"Unknown district: {district}"}

    lat, lng = coords
    past_days = min(forecast_days, 92)

    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min,shortwave_radiation_sum",
        "past_days": past_days,
        "forecast_days": 7,
        "timezone": "Asia/Kolkata"
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get("https://api.open-meteo.com/v1/forecast", params=params)
            resp.raise_for_status()
            data = resp.json()

        daily = data.get("daily", {})
        rainfall_vals = daily.get("precipitation_sum", [])
        temp_max_vals = daily.get("temperature_2m_max", [])
        solar_vals = daily.get("shortwave_radiation_sum", [])

        # Filter out None values
        rainfall_vals = [v for v in rainfall_vals if v is not None]
        temp_max_vals = [v for v in temp_max_vals if v is not None]
        solar_vals = [v for v in solar_vals if v is not None]

        total_rainfall = sum(rainfall_vals)
        avg_temp = sum(temp_max_vals) / len(temp_max_vals) if temp_max_vals else 32.0
        avg_solar_val = sum(solar_vals) / len(solar_vals) if solar_vals else 5.0

        # Compute deviation from 30-year average (prorated for period)
        annual_avg = DISTRICT_30YR_RAINFALL_MM.get(district, 800)
        actual_days = len(rainfall_vals) or forecast_days
        prorated_avg = annual_avg * (actual_days / 365.0)
        deviation = ((total_rainfall - prorated_avg) / prorated_avg * 100) if prorated_avg > 0 else 0

        result = {
            "district": district,
            "rainfall_mm_daily": rainfall_vals[-30:] if rainfall_vals else [],
            "temp_max_daily": temp_max_vals[-30:] if temp_max_vals else [],
            "total_rainfall_mm": round(total_rainfall, 1),
            "rainfall_deviation_pct": round(deviation, 1),
            "avg_temp_max": round(avg_temp, 1),
            "avg_solar": round(avg_solar_val, 2),
            "forecast_days": forecast_days,
        }

        # Save to DB
        try:
            db = SessionLocal()
            db.add(WeatherSnapshot(
                district=district,
                total_rainfall_mm=total_rainfall,
                rainfall_deviation_pct=deviation,
                avg_temp_max=avg_temp,
                avg_solar=avg_solar_val,
                forecast_days=forecast_days,
            ))
            db.commit()
            db.close()
        except Exception as e:
            logger.warning(f"Weather DB save error: {e}")

        return result

    except Exception as e:
        logger.error(f"Open-Meteo API error for {district}: {e}")
        return {
            "district": district,
            "rainfall_mm_daily": [],
            "temp_max_daily": [],
            "total_rainfall_mm": 0,
            "rainfall_deviation_pct": 0,
            "avg_temp_max": 32.0,
            "avg_solar": 5.0,
            "forecast_days": forecast_days,
            "error": str(e),
        }


async def get_historical_weather(district: str, years_back: int = 3) -> dict:
    """Fetch Open-Meteo historical data for past N years, returning monthly aggregates."""
    coords = DISTRICT_COORDS.get(district)
    if not coords:
        return {"error": f"Unknown district: {district}"}

    lat, lng = coords
    end_date = datetime.now()
    start_date = end_date - timedelta(days=years_back * 365)
    start_str = start_date.strftime("%Y-%m-%d")
    end_str = end_date.strftime("%Y-%m-%d")

    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "precipitation_sum,temperature_2m_max",
        "start_date": start_str,
        "end_date": end_str,
        "timezone": "Asia/Kolkata"
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.get("https://archive-api.open-meteo.com/v1/archive", params=params)
            resp.raise_for_status()
            data = resp.json()

        daily = data.get("daily", {})
        dates = daily.get("time", [])
        rainfall = daily.get("precipitation_sum", [])
        temp_max = daily.get("temperature_2m_max", [])

        # Aggregate by month (YYYYMM)
        monthly: dict[str, dict] = {}
        for i, date_str in enumerate(dates):
            if not date_str:
                continue
            month_key = date_str.replace("-", "")[:6]
            if month_key not in monthly:
                monthly[month_key] = {"rainfall": [], "temp_max": []}
            
            rain_val = rainfall[i] if i < len(rainfall) else None
            temp_val = temp_max[i] if i < len(temp_max) else None
            
            if rain_val is not None:
                monthly[month_key]["rainfall"].append(rain_val)
            if temp_val is not None:
                monthly[month_key]["temp_max"].append(temp_val)

        monthly_agg = []
        for month_key in sorted(monthly.keys()):
            vals = monthly[month_key]
            monthly_agg.append({
                "month": month_key,
                "total_rainfall_mm": round(sum(vals["rainfall"]), 1),
                "avg_temp_max": round(
                    sum(vals["temp_max"]) / len(vals["temp_max"]), 1
                ) if vals["temp_max"] else 32.0,
            })

        return {
            "district": district,
            "years_back": years_back,
            "monthly_aggregates": monthly_agg,
        }

    except Exception as e:
        logger.error(f"Historical weather error for {district}: {e}")
        return {"district": district, "years_back": years_back, "monthly_aggregates": [], "error": str(e)}
