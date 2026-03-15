"""Scheme router — eligibility check and scheme listing."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.models import get_db, Farmer
from integrations.vistaar import check_scheme_eligibility

router = APIRouter(prefix="/scheme", tags=["scheme"])

ALL_SCHEMES = [
    {
        "name": "PM-KISAN",
        "description": "Income support of ₹6,000 per year in three installments",
        "criteria": "Small and marginal farmers with ≤ 2 hectares",
        "benefit": "₹6,000/year",
        "ministry": "Ministry of Agriculture",
    },
    {
        "name": "PMFBY",
        "description": "Pradhan Mantri Fasal Bima Yojana — crop insurance",
        "criteria": "All farmers growing notified crops (Rice, Maize, Groundnut, Cotton, Sugarcane, Ragi)",
        "benefit": "30% of sum insured (₹35,000/ha × land area × 0.3)",
        "ministry": "Ministry of Agriculture",
    },
    {
        "name": "Soil Health Card (SHC)",
        "description": "Free soil testing and nutrient recommendation",
        "criteria": "All farmers eligible",
        "benefit": "₹1,000 (free testing worth ₹1,000)",
        "ministry": "Ministry of Agriculture",
    },
    {
        "name": "PM-AASHA",
        "description": "Pradhan Mantri Annadata Aay SanraksHan Abhiyan — price support",
        "criteria": "Farmers growing oilseeds and pulses",
        "benefit": "₹2,000 per hectare",
        "ministry": "Ministry of Agriculture",
    },
    {
        "name": "MIDH",
        "description": "Mission for Integrated Development of Horticulture",
        "criteria": "Farmers growing horticulture crops (Banana, Tomato, Onion, Turmeric)",
        "benefit": "₹15,000 per hectare",
        "ministry": "Ministry of Agriculture",
    },
    {
        "name": "PKVY",
        "description": "Paramparagat Krishi Vikas Yojana — organic farming support",
        "criteria": "Farmers with ≥ 0.5 hectares",
        "benefit": "₹50,000 per cluster for 3 years",
        "ministry": "Ministry of Agriculture",
    },
]


@router.post("/check/{farmer_id}")
async def check_eligibility(farmer_id: int, db: Session = Depends(get_db)):
    """Check scheme eligibility for a farmer."""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        return {"error": "Farmer not found"}

    from db.models import Recommendation
    rec = (
        db.query(Recommendation)
        .filter(Recommendation.farmer_id == farmer_id, Recommendation.status == "complete")
        .order_by(Recommendation.created_at.desc())
        .first()
    )
    crop = rec.top_crop if rec else "Rice"

    schemes = await check_scheme_eligibility(
        farmer_id, farmer.land_area_ha, crop,
        farmer.district, {"name": farmer.name}
    )
    return schemes


@router.get("/list")
def list_schemes():
    """Get all schemes with full criteria and benefit amounts."""
    return ALL_SCHEMES
