"""Market router — live prices, forecasts, all-crops view."""
import json
import logging
from fastapi import APIRouter
import redis.asyncio as aioredis
import os

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/market", tags=["market"])
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")


@router.get("/live/{crop}/{district}")
async def live_price(crop: str, district: str):
    """Get live price — Redis cache first, then Agmarknet API."""
    try:
        r = aioredis.from_url(REDIS_URL, decode_responses=True)
        cached = await r.get(f"price:{crop}:{district}")
        if cached:
            return {"prices": json.loads(cached), "source": "cache"}
    except Exception:
        pass

    from integrations.agmarknet import fetch_live_prices
    prices = await fetch_live_prices(crop, district)
    return {"prices": prices, "source": "agmarknet"}


@router.get("/forecast/{crop}/{district}")
async def price_forecast(crop: str, district: str):
    """Get 12-month price forecast with weather risk annotation."""
    from ml.price_model import generate_12month_series, weather_price_recognizer
    series = await generate_12month_series(crop, district)
    risk = await weather_price_recognizer(district, crop)
    return {**series, "weather_risk": risk}


@router.get("/all-crops/{district}")
async def all_crops_prices(district: str):
    """Get latest price for all 10 crops in a district."""
    from integrations.agmarknet import fetch_live_prices, CROPS
    results = []
    for crop in CROPS:
        prices = await fetch_live_prices(crop, district)
        latest = prices[0] if prices else {"mandi": "N/A", "price": 0, "date": "", "crop": crop}
        results.append(latest)
    return results


@router.get("/news/{crop}")
async def agri_news(crop: str):
    from integrations.agri_news import get_agri_news
    return await get_agri_news(crop)

