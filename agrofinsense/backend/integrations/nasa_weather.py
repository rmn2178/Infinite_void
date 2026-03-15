"""NASA POWER API integration for weather data (no API key required)."""
import os
import logging
from datetime import datetime, timedelta
import httpx
from db.models import SessionLocal, WeatherSnapshot

logger = logging.getLogger(__name__)

NASA_POWER_BASE = os.getenv(
    "NASA_POWER_BASE",
    "https://power.larc.nasa.gov/api/temporal/daily/point"
)

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
    """Fetch weather data from NASA POWER API."""
    coords = DISTRICT_COORDS.get(district)
    if not coords:
        return {"error": f"Unknown district: {district}"}

    lat, lng = coords
    end_date = datetime.now()
    start_date = end_date - timedelta(days=forecast_days)
    start_str = start_date.strftime("%Y%m%d")
    end_str = end_date.strftime("%Y%m%d")

    params = {
        "parameters": "PRECTOTCORR,T2M_MAX,T2M_MIN,ALLSKY_SFC_SW_DWN",
        "community": "AG",
        "longitude": lng,
        "latitude": lat,
        "start": start_str,
        "end": end_str,
        "format": "JSON",
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(NASA_POWER_BASE, params=params)
            resp.raise_for_status()
            data = resp.json()

        parameters = data.get("properties", {}).get("parameter", {})
        rainfall = parameters.get("PRECTOTCORR", {})
        temp_max = parameters.get("T2M_MAX", {})
        solar = parameters.get("ALLSKY_SFC_SW_DWN", {})

        # Filter out fill values (-999)
        rainfall_vals = [v for v in rainfall.values() if v > -900]
        temp_max_vals = [v for v in temp_max.values() if v > -900]
        solar_vals = [v for v in solar.values() if v > -900]

        total_rainfall = sum(rainfall_vals)
        avg_temp = sum(temp_max_vals) / len(temp_max_vals) if temp_max_vals else 32.0
        avg_solar_val = sum(solar_vals) / len(solar_vals) if solar_vals else 5.0

        # Compute deviation from 30-year average (prorated for period)
        annual_avg = DISTRICT_30YR_RAINFALL_MM.get(district, 800)
        prorated_avg = annual_avg * (forecast_days / 365.0)
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
        logger.error(f"NASA POWER API error for {district}: {e}")
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
    """Fetch NASA POWER historical data for past N years, returning monthly aggregates."""
    coords = DISTRICT_COORDS.get(district)
    if not coords:
        return {"error": f"Unknown district: {district}"}

    lat, lng = coords
    end_date = datetime.now()
    start_date = end_date - timedelta(days=years_back * 365)
    start_str = start_date.strftime("%Y%m%d")
    end_str = end_date.strftime("%Y%m%d")

    params = {
        "parameters": "PRECTOTCORR,T2M_MAX,T2M_MIN",
        "community": "AG",
        "longitude": lng,
        "latitude": lat,
        "start": start_str,
        "end": end_str,
        "format": "JSON",
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.get(NASA_POWER_BASE, params=params)
            resp.raise_for_status()
            data = resp.json()

        parameters = data.get("properties", {}).get("parameter", {})
        rainfall = parameters.get("PRECTOTCORR", {})
        temp_max = parameters.get("T2M_MAX", {})

        # Aggregate by month (YYYYMM)
        monthly: dict[str, dict] = {}
        for date_str, rain_val in rainfall.items():
            if rain_val < -900:
                continue
            month_key = date_str[:6]
            if month_key not in monthly:
                monthly[month_key] = {"rainfall": [], "temp_max": []}
            monthly[month_key]["rainfall"].append(rain_val)

        for date_str, temp_val in temp_max.items():
            if temp_val < -900:
                continue
            month_key = date_str[:6]
            if month_key in monthly:
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
