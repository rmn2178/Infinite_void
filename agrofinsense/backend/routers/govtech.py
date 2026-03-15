"""GovTech router — district summaries, heatmap, warehouses, scheme stats."""
import json
import logging
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.models import get_db, DistrictSummary, Warehouse, SchemeEligibility, Farmer
from ml.budget_engine import BudgetEngine, DISTRICT_SOWN_AREA_HA
from ml.storage_planner import StoragePlanner
from ml.postharvest_loss import predict_loss
from integrations.ollama_ai import generate_district_gov_summary, classify_crop_risk
from integrations.nasa_weather import fetch_weather_forecast

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/govtech", tags=["govtech"])

DISTRICTS = ["Erode", "Salem", "Madurai", "Thanjavur", "Coimbatore",
             "Trichy", "Vellore", "Tirunelveli", "Chennai", "Tiruppur"]


@router.get("/district-summary/{district}/{season}")
async def district_summary(district: str, season: str, db: Session = Depends(get_db)):
    """Full district analysis: yield + budget + storage + AI briefing."""
    # Check cache
    cached = (
        db.query(DistrictSummary)
        .filter(DistrictSummary.district == district, DistrictSummary.season == season)
        .order_by(DistrictSummary.created_at.desc())
        .first()
    )
    if cached:
        return {
            "district": district,
            "season": season,
            "summary_text": cached.summary_text,
            "yield_data": json.loads(cached.yield_data_json) if cached.yield_data_json else {},
            "budget_data": json.loads(cached.budget_data_json) if cached.budget_data_json else {},
            "storage_data": json.loads(cached.storage_data_json) if cached.storage_data_json else {},
            "ai_model_used": cached.ai_model_used,
        }

    # Compute fresh
    budget_engine = BudgetEngine()
    storage_planner = StoragePlanner()

    budget = await budget_engine.compute(district, "Rice", season)
    storage = await storage_planner.allocate(district, "Rice", budget.get("total_tonnage_mt", 10000))

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

    # AI briefing
    summary_text = await generate_district_gov_summary(district, yield_data, budget, storage)

    # Save cache
    ds = DistrictSummary(
        district=district, season=season,
        summary_text=summary_text,
        yield_data_json=json.dumps(yield_data),
        budget_data_json=json.dumps(budget),
        storage_data_json=json.dumps(storage, default=str),
    )
    db.add(ds)
    db.commit()

    return {
        "district": district,
        "season": season,
        "summary_text": summary_text,
        "yield_data": yield_data,
        "budget_data": budget,
        "storage_data": storage,
        "postharvest_loss": loss,
        "ai_model_used": "gemma3:4b",
    }


@router.get("/heatmap/{state}/{season}")
async def heatmap(state: str, season: str, db: Session = Depends(get_db)):
    """All districts aggregated for choropleth map."""
    results = []
    budget_engine = BudgetEngine()

    for district in DISTRICTS:
        try:
            budget = await budget_engine.compute(district, "Rice", season)
            weather = await fetch_weather_forecast(district, 180)

            risk = await classify_crop_risk(
                "Rice",
                abs(weather.get("rainfall_deviation_pct", 0)) / 50,
                "stable",
                0
            )

            results.append({
                "district": district,
                "tonnage_mt": budget.get("total_tonnage_mt", 0),
                "budget_crore": round(budget.get("procurement_cost_inr", 0) / 10000000, 1),
                "risk_score": risk.get("risk_score", 50),
                "risk_level": risk.get("overall_risk", "medium"),
                "sown_area_ha": DISTRICT_SOWN_AREA_HA.get(district, 100000),
            })
        except Exception as e:
            logger.error(f"Heatmap error for {district}: {e}")
            results.append({
                "district": district, "tonnage_mt": 0,
                "budget_crore": 0, "risk_score": 50,
                "risk_level": "unknown", "sown_area_ha": 0,
            })

    return results


@router.get("/warehouse-status/{district}")
def warehouse_status(district: str, db: Session = Depends(get_db)):
    """Get real-time warehouse status for a district."""
    warehouses = db.query(Warehouse).filter(Warehouse.district == district).all()
    result = []
    for w in warehouses:
        util = (w.current_stock_mt / w.capacity_mt * 100) if w.capacity_mt > 0 else 0
        result.append({
            "id": w.id, "name": w.name, "district": w.district,
            "owner_type": w.owner_type, "capacity_mt": w.capacity_mt,
            "current_stock_mt": w.current_stock_mt, "cold_storage": w.cold_storage,
            "utilisation_pct": round(util, 1),
            "lat": w.lat, "lng": w.lng,
        })
    return result


@router.get("/scheme-stats/{district}")
def scheme_stats(district: str, db: Session = Depends(get_db)):
    """Get eligible farmer count per scheme for a district."""
    farmers = db.query(Farmer).filter(Farmer.district == district).all()
    farmer_ids = [f.id for f in farmers]

    if not farmer_ids:
        return []

    schemes_data = (
        db.query(SchemeEligibility)
        .filter(SchemeEligibility.farmer_id.in_(farmer_ids))
        .all()
    )

    scheme_counts: dict[str, dict] = {}
    for s in schemes_data:
        if s.scheme_name not in scheme_counts:
            scheme_counts[s.scheme_name] = {"eligible": 0, "total": 0, "total_benefit": 0}
        scheme_counts[s.scheme_name]["total"] += 1
        if s.eligible:
            scheme_counts[s.scheme_name]["eligible"] += 1
            scheme_counts[s.scheme_name]["total_benefit"] += s.benefit_amount or 0

    return [
        {
            "scheme_name": name,
            "eligible_farmers": counts["eligible"],
            "total_checked": counts["total"],
            "total_benefit_inr": round(counts["total_benefit"], 0),
        }
        for name, counts in scheme_counts.items()
    ]
