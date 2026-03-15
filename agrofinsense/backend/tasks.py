"""Celery tasks for background processing."""
import os
import json
import asyncio
import logging
from celery import Celery

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

app = Celery("agrofinsense", broker=REDIS_URL, backend=REDIS_URL)
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
)


def _run_async(coro):
    """Run async coroutine in sync context."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, coro).result()
        return loop.run_until_complete(coro)
    except RuntimeError:
        return asyncio.run(coro)


@app.task(name="run_full_farmer_pipeline")
def run_full_farmer_pipeline(farmer_id: int, soil_profile_id: int):
    """Full farmer recommendation pipeline."""
    from db.models import SessionLocal, SoilProfile, Farmer, Recommendation, YieldForecast
    from integrations.nasa_weather import fetch_weather_forecast
    from integrations.ollama_ai import predict_yield_with_reasoning, generate_why_narrative
    from integrations.vistaar import check_scheme_eligibility
    from ml.yield_model import predict_yield
    from ml.crop_matcher import match_crops
    from ml.price_model import generate_12month_series
    import redis

    db = SessionLocal()
    r = redis.from_url(REDIS_URL)

    try:
        # 1. Load soil profile
        soil = db.query(SoilProfile).filter(SoilProfile.id == soil_profile_id).first()
        farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not soil or not farmer:
            logger.error(f"Farmer {farmer_id} or soil profile {soil_profile_id} not found")
            return

        soil_dict = {
            "nitrogen_ppm": soil.nitrogen_ppm or 180,
            "phosphorus_ppm": soil.phosphorus_ppm or 22,
            "potassium_ppm": soil.potassium_ppm or 160,
            "ph_value": soil.ph_value or 6.5,
            "organic_carbon_pct": soil.organic_carbon_pct or 0.6,
        }

        farmer_profile = {
            "name": farmer.name,
            "district": farmer.district,
            "land_area_ha": farmer.land_area_ha,
        }

        # 2. Fetch weather
        weather = _run_async(fetch_weather_forecast(farmer.district))

        # 3. Crop matching
        top_crops = match_crops(soil_dict, weather, "Kharif")
        top_crop = top_crops[0]["crop"] if top_crops else "Rice"

        # 4. XGBoost yield prediction
        features = {**soil_dict, **weather, "crop": top_crop, "district": farmer.district}
        yield_pred = predict_yield(features, farmer.land_area_ha)

        # Save yield forecast
        db.add(YieldForecast(
            farmer_id=farmer_id, crop=top_crop, district=farmer.district,
            predicted_kg_per_ha=yield_pred["predicted_kg_per_ha"],
            confidence_low=yield_pred["confidence_low"],
            confidence_high=yield_pred["confidence_high"],
            district_tonnage_mt=yield_pred["district_tonnage_mt"],
        ))
        db.commit()

        # 5. AI yield reasoning (llama3.2:3b)
        ai_reasoning = _run_async(predict_yield_with_reasoning(
            soil_dict, weather, top_crop, farmer.district
        ))

        # 6. Price forecast
        price_forecast = _run_async(generate_12month_series(top_crop, farmer.district))

        # 7. Scheme eligibility
        schemes = _run_async(check_scheme_eligibility(
            farmer_id, farmer.land_area_ha, top_crop,
            farmer.district, farmer_profile
        ))

        # 8. Why narrative (gemma3:4b)
        narrative = _run_async(generate_why_narrative(
            farmer_profile, soil_dict, yield_pred,
            price_forecast, schemes, farmer.language or "ta"
        ))

        # 9. Save recommendation
        rec = Recommendation(
            farmer_id=farmer_id,
            top_crop=top_crop,
            top_crops_json=json.dumps(top_crops),
            yield_prediction_json=json.dumps({**yield_pred, **ai_reasoning}),
            price_forecast_json=json.dumps(price_forecast),
            scheme_eligibility_json=json.dumps(schemes),
            why_narrative=narrative,
            ai_model_used="gemma3:4b + llama3.2:3b",
            status="complete",
        )
        db.add(rec)
        db.commit()

        # 10. Redis publish
        r.publish(f"recommendation_ready:{farmer_id}", json.dumps({
            "farmer_id": farmer_id,
            "recommendation_id": rec.id,
            "status": "complete",
        }))

        logger.info(f"Pipeline complete for farmer {farmer_id}")

    except Exception as e:
        logger.error(f"Pipeline error for farmer {farmer_id}: {e}")
        # Mark recommendation as failed
        rec = db.query(Recommendation).filter(
            Recommendation.farmer_id == farmer_id,
            Recommendation.status == "processing"
        ).first()
        if rec:
            rec.status = "failed"
            db.commit()
    finally:
        db.close()


@app.task(name="refresh_market_prices")
def refresh_market_prices():
    """Refresh all market prices from Agmarknet."""
    from integrations.agmarknet import poll_all_districts
    result = _run_async(poll_all_districts())
    logger.info(f"Market refresh: {result}")
    return result


@app.task(name="compute_district_govtech")
def compute_district_govtech(district: str, season: str = "Kharif 2025"):
    """Compute full gov tech analysis for a district."""
    from ml.budget_engine import BudgetEngine
    from ml.storage_planner import StoragePlanner
    from ml.postharvest_loss import predict_loss
    from integrations.ollama_ai import generate_district_gov_summary
    from db.models import SessionLocal, DistrictSummary

    budget_engine = BudgetEngine()
    storage_planner = StoragePlanner()

    budget = _run_async(budget_engine.compute(district, "Rice", season))
    storage = _run_async(storage_planner.allocate(
        district, "Rice", budget.get("total_tonnage_mt", 10000)
    ))

    yield_data = {
        "total_tonnage_mt": budget.get("total_tonnage_mt", 10000),
        "crop": "Rice",
        "season": season,
    }

    loss = predict_loss({
        "crop": "Rice", "storage_type": "warehouse",
        "transport_type": "covered_truck", "distance_km": 50,
        "humidity_pct": 65, "tonnage": budget.get("total_tonnage_mt", 100),
        "price_per_quintal": budget.get("msp_used", 2300),
    })

    summary = _run_async(generate_district_gov_summary(
        district, yield_data, budget, storage
    ))

    # Save to DB
    db = SessionLocal()
    try:
        db.add(DistrictSummary(
            district=district, season=season,
            summary_text=summary,
            yield_data_json=json.dumps(yield_data),
            budget_data_json=json.dumps(budget),
            storage_data_json=json.dumps(storage, default=str),
        ))
        db.commit()
    finally:
        db.close()

    logger.info(f"GovTech computed for {district}")
    return {"district": district, "status": "complete"}


@app.task(name="compute_all_districts")
def compute_all_districts():
    """Compute govtech for all districts."""
    districts = ["Erode", "Salem", "Madurai", "Thanjavur", "Coimbatore",
                 "Trichy", "Vellore", "Tirunelveli", "Chennai", "Tiruppur"]
    for d in districts:
        compute_district_govtech.delay(d)


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(60.0, refresh_market_prices.s(), name="refresh-prices-60s")
    sender.add_periodic_task(3600.0, compute_all_districts.s(), name="compute-districts-1h")
