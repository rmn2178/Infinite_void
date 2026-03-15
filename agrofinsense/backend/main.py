"""AgroFinSense FastAPI Backend."""
import os
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from routers import farmer, market, govtech, scheme, ws
from integrations.ollama_ai import health_check as ollama_health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("AgroFinSense backend starting...")

    # Check Ollama health
    ollama_status = await ollama_health()
    logger.info(f"Ollama status: {ollama_status}")

    # Initial market price poll (non-blocking)
    try:
        from integrations.agmarknet import poll_all_districts
        import asyncio
        asyncio.create_task(poll_all_districts())
        logger.info("Initial market price poll started")
    except Exception as e:
        logger.warning(f"Initial price poll skipped: {e}")

    yield
    logger.info("AgroFinSense backend shutting down...")


app = FastAPI(
    title="AgroFinSense API",
    description="Agriculture + Fintech + GovTech Intelligence Platform for Tamil Nadu",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(farmer.router)
app.include_router(market.router)
app.include_router(govtech.router)
app.include_router(scheme.router)
app.include_router(ws.router)


@app.get("/health")
async def health():
    """Health check — DB, Redis, Ollama status."""
    ollama_status = await ollama_health()

    db_ok = False
    try:
        from db.models import SessionLocal
        db = SessionLocal()
        db.execute("SELECT 1")
        db_ok = True
        db.close()
    except Exception:
        pass

    redis_ok = False
    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
        await r.ping()
        redis_ok = True
    except Exception:
        pass

    return {
        "status": "healthy" if (db_ok and redis_ok and ollama_status["ollama_running"]) else "degraded",
        "db": db_ok,
        "redis": redis_ok,
        "ollama": ollama_status,
        "timestamp": datetime.utcnow().isoformat(),
    }
