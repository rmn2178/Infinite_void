"""LocationIQ geocoding integration."""
import os
import json
import logging
import httpx
import redis.asyncio as aioredis

logger = logging.getLogger(__name__)

LOCATIONIQ_KEY = os.getenv("LOCATIONIQ_KEY", "")
LOCATIONIQ_BASE = "https://us1.locationiq.com/v1"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

async def get_redis():
    return aioredis.from_url(REDIS_URL, decode_responses=True)

async def geocode(address: str) -> dict:
    if not LOCATIONIQ_KEY:
        raise ValueError("LOCATIONIQ_KEY not configured")
        
    cache_key = f"geo:fwd:{address}"
    try:
        r = await get_redis()
        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.warning(f"Redis error: {e}")
        r = None

    params = {
        "key": LOCATIONIQ_KEY,
        "q": address,
        "format": "json",
        "limit": 1,
        "countrycodes": "in"
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{LOCATIONIQ_BASE}/search", params=params)
            resp.raise_for_status()
            data = resp.json()

        if not data:
            return {}

        result = {
            "lat": float(data[0].get("lat")),
            "lng": float(data[0].get("lon")),
            "display_name": data[0].get("display_name")
        }

        if r:
            try:
                await r.setex(cache_key, 86400, json.dumps(result))
            except Exception:
                pass

        return result
    except Exception as e:
        logger.error(f"Geocoding error for {address}: {e}")
        return {}

async def reverse_geocode(lat: float, lng: float) -> dict:
    if not LOCATIONIQ_KEY:
        raise ValueError("LOCATIONIQ_KEY not configured")

    cache_key = f"geo:rev:{lat:.4f},{lng:.4f}"
    try:
        r = await get_redis()
        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.warning(f"Redis error: {e}")
        r = None

    params = {
        "key": LOCATIONIQ_KEY,
        "lat": lat,
        "lon": lng,
        "format": "json"
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{LOCATIONIQ_BASE}/reverse", params=params)
            resp.raise_for_status()
            data = resp.json()

        address = data.get("address", {})
        result = {
            "display_name": data.get("display_name"),
            "district": address.get("county", "").replace(" District", ""),
            "state": address.get("state")
        }

        if r:
            try:
                await r.setex(cache_key, 86400, json.dumps(result))
            except Exception:
                pass

        return result
    except Exception as e:
        logger.error(f"Reverse geocode error for {lat},{lng}: {e}")
        return {}
