"""Government budget engine — MSP procurement + PMFBY computation."""
import logging
from db.models import SessionLocal, GovBudgetProjection
from ml.yield_model import predict_yield, DISTRICT_SOWN_AREA_HA

logger = logging.getLogger(__name__)

# Real MSP 2025-26 values (₹ per quintal)
MSP_2025_26 = {
    "Rice": 2300, "Wheat": 2275, "Maize": 2090, "Groundnut": 6783,
    "Sunflower": 7280, "Soybean": 4892, "Cotton": 7121,
    "Sugarcane": 340, "Ragi": 4290, "Tur": 8000,
}

# PMFBY premium rates and coverage
PMFBY_PREMIUM_RATE = {
    "Rice": 0.02, "Maize": 0.02, "Groundnut": 0.05, "Cotton": 0.05,
    "Sugarcane": 0.05, "Ragi": 0.02, "Soybean": 0.05,
}

DISTRICT_FARMER_COUNT = {
    "Erode": 125000, "Salem": 98000, "Madurai": 115000, "Thanjavur": 185000,
    "Coimbatore": 88000, "Trichy": 132000, "Vellore": 95000,
    "Tirunelveli": 108000, "Chennai": 8000, "Tiruppur": 72000,
}


class BudgetEngine:
    async def compute(self, district: str, crop: str, season: str = "Kharif 2025") -> dict:
        """Compute full district budget projection."""
        sown_area = DISTRICT_SOWN_AREA_HA.get(district, 100000)
        msp = MSP_2025_26.get(crop, 2300)
        farmer_count = DISTRICT_FARMER_COUNT.get(district, 100000)

        # Get yield prediction
        features = {
            "nitrogen_ppm": 180, "phosphorus_ppm": 22,
            "potassium_ppm": 160, "ph_value": 6.5,
            "organic_carbon_pct": 0.65, "ndvi_mean": 0.7,
            "ndvi_std": 0.06, "rainfall_deviation_pct": 5,
            "irrigation_flag": 1, "crop": crop, "district": district,
        }
        yield_pred = predict_yield(features, sown_area)
        total_tonnage = yield_pred["district_tonnage_mt"]

        # Procurement cost (tonnage * MSP * 10 quintals per tonne)
        procurement_cost = total_tonnage * msp * 10

        # PMFBY payout estimate
        premium_rate = PMFBY_PREMIUM_RATE.get(crop, 0.02)
        sum_insured_per_farmer = sown_area / farmer_count * msp * 10 if farmer_count > 0 else 0
        total_insured = sum_insured_per_farmer * farmer_count * 0.4  # ~40% coverage
        pmfby_payout = total_insured * premium_rate * 3  # Average 3x claims ratio

        # Total scheme spend = procurement + PMFBY + PM-KISAN estimate
        pm_kisan_est = min(farmer_count, farmer_count * 0.6) * 6000
        total_scheme = procurement_cost + pmfby_payout + pm_kisan_est

        result = {
            "district": district,
            "crop": crop,
            "season": season,
            "total_tonnage_mt": round(total_tonnage, 0),
            "procurement_cost_inr": round(procurement_cost, 0),
            "msp_used": msp,
            "pmfby_payout_est_inr": round(pmfby_payout, 0),
            "total_scheme_spend": round(total_scheme, 0),
            "farmer_count": farmer_count,
            "sown_area_ha": sown_area,
        }

        # Save to DB
        try:
            db = SessionLocal()
            db.add(GovBudgetProjection(
                district=district, crop=crop, season=season,
                total_tonnage_mt=total_tonnage,
                procurement_cost_inr=procurement_cost,
                msp_used=msp,
                pmfby_payout_est_inr=pmfby_payout,
                total_scheme_spend=total_scheme,
            ))
            db.commit()
            db.close()
        except Exception as e:
            logger.warning(f"Budget DB save error: {e}")

        return result
