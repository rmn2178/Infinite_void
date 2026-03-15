"""Agmarknet live market prices from data.gov.in API."""
import os
import json
import logging
import httpx
import redis.asyncio as aioredis
from db.models import SessionLocal, MarketPrice

logger = logging.getLogger(__name__)

AGMARKNET_KEY = os.getenv("AGMARKNET_KEY", "")
AGMARKNET_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

CROPS = ["Rice", "Maize", "Groundnut", "Cotton", "Sugarcane", "Onion", "Tomato", "Banana", "Turmeric", "Ragi"]
DISTRICTS = ["Erode", "Salem", "Madurai", "Thanjavur", "Coimbatore", "Trichy", "Vellore", "Tirunelveli", "Chennai", "Tiruppur"]


async def _get_redis():
    return aioredis.from_url(REDIS_URL, decode_responses=True)


async def fetch_live_prices(crop: str, district: str) -> list[dict]:
    """Fetch real-time prices from Agmarknet API."""
    prices = []
    is_live = True

    try:
        params = {
            "api-key": AGMARKNET_KEY,
            "format": "json",
            "limit": 50,
            "filters[State]": "Tamil Nadu",
            "filters[Commodity]": crop,
            "filters[District]": district,
        }
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(AGMARKNET_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
            records = data.get("records", [])

            for rec in records:
                try:
                    prices.append({
                        "mandi": rec.get("Market", rec.get("market", "Unknown")),
                        "price": float(rec.get("Modal_Price", rec.get("modal_price", 0))),
                        "date": rec.get("Arrival_Date", rec.get("arrival_date", "")),
                        "crop": rec.get("Commodity", rec.get("commodity", crop)),
                    })
                except (ValueError, TypeError):
                    continue

    except Exception as e:
        logger.warning(f"Agmarknet API error for {crop}/{district}: {e}")
        is_live = False
        # Fallback to Redis cache
        try:
            r = await _get_redis()
            cached = await r.get(f"price:{crop}:{district}")
            if cached:
                prices = json.loads(cached)
                logger.info(f"Using cached prices for {crop}/{district}")
        except Exception as re:
            logger.warning(f"Redis cache miss for {crop}/{district}: {re}")

    # Save to DB
    if prices:
        try:
            db = SessionLocal()
            for p in prices:
                db.add(MarketPrice(
                    crop=p["crop"], district=district,
                    mandi=p["mandi"], price=p["price"],
                    arrival_date=p["date"], is_live=is_live
                ))
            db.commit()
            db.close()
        except Exception as e:
            logger.warning(f"DB save error: {e}")

        # Publish to Redis
        try:
            r = await _get_redis()
            await r.set(f"price:{crop}:{district}", json.dumps(prices), ex=300)
            await r.publish(f"price:{crop}:{district}", json.dumps(prices))
        except Exception as e:
            logger.warning(f"Redis publish error: {e}")

    return prices


async def poll_all_districts():
    """Fetch all crop × district combos and store to DB + Redis."""
    total = 0
    failures = 0
    for crop in CROPS:
        for district in DISTRICTS:
            try:
                result = await fetch_live_prices(crop, district)
                total += len(result)
            except Exception as e:
                failures += 1
                logger.error(f"Poll failed {crop}/{district}: {e}")

    logger.info(f"Agmarknet poll complete: {total} prices fetched, {failures} failures")
    return {"total_prices": total, "failures": failures}
