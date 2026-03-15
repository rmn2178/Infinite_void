"""Commodity News Feed with NewsData.io and RSS fallback."""
import os
import json
import logging
import httpx
import xml.etree.ElementTree as ET
import redis.asyncio as aioredis
from datetime import datetime

logger = logging.getLogger(__name__)

NEWSDATA_KEY = os.getenv("NEWSDATA_KEY", "")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

async def get_redis():
    return aioredis.from_url(REDIS_URL, decode_responses=True)

async def _fetch_newsdata(crop: str) -> list[dict]:
    if not NEWSDATA_KEY:
        return []
        
    url = f"https://newsdata.io/api/1/news"
    params = {
        "apikey": NEWSDATA_KEY,
        "q": f"{crop} agriculture India",
        "language": "en",
        "country": "in",
        "category": "business"
    }
    
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            
        results = data.get("results", [])
        news = []
        for r in results:
            news.append({
                "title": r.get("title", ""),
                "summary": r.get("description", "") or "",
                "published": r.get("pubDate", ""),
                "url": r.get("link", ""),
                "source": r.get("source_id", "NewsData")
            })
        return news
    except Exception as e:
        logger.error(f"NewsData API error: {e}")
        return []

async def _fetch_rss_fallback(crop: str) -> list[dict]:
    url = "https://www.thehindu.com/business/agri-business/feeder/default.rss"
    news = []
    
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            
        root = ET.fromstring(resp.text)
        for item in root.findall(".//item"):
            title = item.findtext("title") or ""
            desc = item.findtext("description") or ""
            link = item.findtext("link") or ""
            pubDate = item.findtext("pubDate") or ""
            
            search_str = (title + " " + desc).lower()
            if crop.lower() in search_str or "agri" in search_str or "farm" in search_str:
                news.append({
                    "title": title,
                    "summary": desc[:200] + "..." if len(desc) > 200 else desc,
                    "published": pubDate,
                    "url": link,
                    "source": "The Hindu (RSS)"
                })
                if len(news) >= 5:
                    break
        return news
    except Exception as e:
        logger.error(f"RSS fallback error: {e}")
        return []

async def get_agri_news(crop: str, limit: int = 5) -> list[dict]:
    cache_key = f"news:{crop}"
    try:
        r = await get_redis()
        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.warning(f"Redis error: {e}")
        r = None

    news = []
    if NEWSDATA_KEY:
        news = await _fetch_newsdata(crop)
        
    if not news:
        news = await _fetch_rss_fallback(crop)
        
    news = news[:limit]

    if r:
        try:
            await r.setex(cache_key, 3600, json.dumps(news))
        except Exception:
            pass

    return news
