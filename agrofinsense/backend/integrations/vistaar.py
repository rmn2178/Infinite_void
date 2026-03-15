"""Vistaar scheme eligibility checker with real 2025-26 benefit amounts."""
import logging
from db.models import SessionLocal, SchemeEligibility

logger = logging.getLogger(__name__)

INSURED_CROPS = ["Rice", "Maize", "Groundnut", "Cotton", "Sugarcane", "Ragi", "Soybean"]
HORTICULTURE_CROPS = ["Banana", "Tomato", "Onion", "Turmeric"]
OILSEED_PULSE_CROPS = ["Groundnut", "Soybean", "Tur", "Sunflower"]


async def check_scheme_eligibility(
    farmer_id: int,
    land_ha: float,
    crop: str,
    district: str,
    farmer_data: dict
) -> list[dict]:
    """Check eligibility for all central/state schemes with real 2025-26 amounts."""
    schemes = []

    # PM-KISAN: ₹6000/yr if land_ha <= 2.0
    pm_kisan_eligible = land_ha <= 2.0
    schemes.append({
        "scheme_name": "PM-KISAN",
        "eligible": pm_kisan_eligible,
        "benefit_amount": 6000.0 if pm_kisan_eligible else 0,
        "reason": "Small/marginal farmer with ≤2 ha" if pm_kisan_eligible
                  else f"Land area {land_ha} ha exceeds 2 ha limit",
    })

    # PMFBY: 30% of (land × ₹35000) if crop is in insured list
    pmfby_eligible = crop in INSURED_CROPS
    pmfby_amount = land_ha * 35000 * 0.3 if pmfby_eligible else 0
    schemes.append({
        "scheme_name": "PMFBY",
        "eligible": pmfby_eligible,
        "benefit_amount": round(pmfby_amount, 2),
        "reason": f"{crop} is covered under PMFBY insurance" if pmfby_eligible
                  else f"{crop} not in PMFBY insured crop list",
    })

    # SHC (Soil Health Card): ₹1000 always eligible
    schemes.append({
        "scheme_name": "Soil Health Card (SHC)",
        "eligible": True,
        "benefit_amount": 1000.0,
        "reason": "All farmers eligible for free soil testing",
    })

    # PM-AASHA: ₹(land × 2000) if oilseed/pulse
    pm_aasha_eligible = crop in OILSEED_PULSE_CROPS
    pm_aasha_amount = land_ha * 2000 if pm_aasha_eligible else 0
    schemes.append({
        "scheme_name": "PM-AASHA",
        "eligible": pm_aasha_eligible,
        "benefit_amount": round(pm_aasha_amount, 2),
        "reason": f"{crop} is an oilseed/pulse eligible for price support" if pm_aasha_eligible
                  else f"{crop} not an oilseed or pulse crop",
    })

    # MIDH: ₹(land × 15000) if horticulture
    midh_eligible = crop in HORTICULTURE_CROPS
    midh_amount = land_ha * 15000 if midh_eligible else 0
    schemes.append({
        "scheme_name": "MIDH",
        "eligible": midh_eligible,
        "benefit_amount": round(midh_amount, 2),
        "reason": f"{crop} is a horticulture crop eligible for MIDH" if midh_eligible
                  else f"{crop} not a horticulture crop",
    })

    # PKVY (Paramparagat Krishi Vikas Yojana): ₹50000 if land >= 0.5 ha
    pkvy_eligible = land_ha >= 0.5
    schemes.append({
        "scheme_name": "PKVY",
        "eligible": pkvy_eligible,
        "benefit_amount": 50000.0 if pkvy_eligible else 0,
        "reason": "Eligible for organic farming cluster support" if pkvy_eligible
                  else f"Minimum 0.5 ha required, has {land_ha} ha",
    })

    # Save to DB
    try:
        db = SessionLocal()
        for s in schemes:
            db.add(SchemeEligibility(
                farmer_id=farmer_id,
                scheme_name=s["scheme_name"],
                eligible=s["eligible"],
                benefit_amount=s["benefit_amount"],
                reason=s["reason"],
            ))
        db.commit()
        db.close()
    except Exception as e:
        logger.warning(f"Scheme DB save error: {e}")

    return schemes
