"""WebSocket router for real-time price updates."""
import json
import asyncio
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import redis.asyncio as aioredis
import os

logger = logging.getLogger(__name__)
router = APIRouter(tags=["websocket"])
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")


@router.websocket("/ws/prices/{crop}/{district}")
async def ws_prices(websocket: WebSocket, crop: str, district: str):
    """WebSocket for live price updates via Redis pub/sub."""
    await websocket.accept()

    # Send current cached price on connect
    try:
        r = aioredis.from_url(REDIS_URL, decode_responses=True)
        cached = await r.get(f"price:{crop}:{district}")
        if cached:
            await websocket.send_text(json.dumps({
                "type": "initial",
                "prices": json.loads(cached),
            }))
    except Exception as e:
        logger.warning(f"WS initial price error: {e}")

    # Subscribe to Redis channel
    try:
        r = aioredis.from_url(REDIS_URL, decode_responses=True)
        pubsub = r.pubsub()
        await pubsub.subscribe(f"price:{crop}:{district}")

        # Keepalive + message forwarding
        while True:
            try:
                message = await asyncio.wait_for(
                    pubsub.get_message(ignore_subscribe_messages=True),
                    timeout=30.0
                )
                if message and message["type"] == "message":
                    await websocket.send_text(json.dumps({
                        "type": "update",
                        "prices": json.loads(message["data"]),
                    }))
                else:
                    # Keepalive ping
                    await websocket.send_text(json.dumps({"type": "ping"}))
            except asyncio.TimeoutError:
                # Send ping on timeout
                try:
                    await websocket.send_text(json.dumps({"type": "ping"}))
                except Exception:
                    break
            except WebSocketDisconnect:
                break

    except WebSocketDisconnect:
        logger.info(f"WS disconnected: {crop}/{district}")
    except Exception as e:
        logger.error(f"WS error: {e}")
    finally:
        try:
            await pubsub.unsubscribe(f"price:{crop}:{district}")
        except Exception:
            pass
