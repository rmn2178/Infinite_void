"""Post-harvest loss prediction using ICAR 2023 base rates."""
import logging

logger = logging.getLogger(__name__)

# ICAR 2023 published base loss rates (%) by crop
CROP_BASE_LOSS = {
    "Rice": 4.6, "Wheat": 3.2, "Maize": 5.1, "Groundnut": 6.5,
    "Cotton": 2.0, "Banana": 18.0, "Tomato": 30.0, "Onion": 22.0,
    "Sugarcane": 4.0, "Turmeric": 8.0, "Ragi": 3.5,
}

# Factor multipliers
STORAGE_FACTOR = {
    "cold_storage": 0.6,
    "warehouse": 0.8,
    "open_air": 1.3,
    "kutcha": 1.5,
}

TRANSPORT_FACTOR = {
    "refrigerated": 0.7,
    "covered_truck": 0.9,
    "open_truck": 1.2,
    "bullock_cart": 1.5,
}

RISK_THRESHOLDS = {
    "low": 5.0,
    "medium": 12.0,
    "high": 25.0,
}


def predict_loss(inputs: dict) -> dict:
    """Predict post-harvest loss based on crop, storage, and transport conditions.

    Args:
        inputs: {
            crop: str,
            storage_type: str (cold_storage|warehouse|open_air|kutcha),
            transport_type: str (refrigerated|covered_truck|open_truck|bullock_cart),
            distance_km: float,
            humidity_pct: float (0-100),
            tonnage: float,
            price_per_quintal: float,
        }
    """
    crop = inputs.get("crop", "Rice")
    base_loss = CROP_BASE_LOSS.get(crop, 5.0)

    storage_type = inputs.get("storage_type", "warehouse")
    transport_type = inputs.get("transport_type", "covered_truck")
    distance_km = inputs.get("distance_km", 50)
    humidity = inputs.get("humidity_pct", 65)
    tonnage = inputs.get("tonnage", 100)
    price_per_quintal = inputs.get("price_per_quintal", 2300)

    # Apply factors
    s_factor = STORAGE_FACTOR.get(storage_type, 1.0)
    t_factor = TRANSPORT_FACTOR.get(transport_type, 1.0)

    # Distance factor: loss increases with distance
    dist_factor = 1.0 + (distance_km / 500) * 0.3

    # Humidity factor: high humidity increases loss for perishables
    humidity_factor = 1.0
    if crop in ["Banana", "Tomato", "Onion"]:
        humidity_factor = 1.0 + max(0, humidity - 60) / 100

    # Final loss percentage
    loss_pct = base_loss * s_factor * t_factor * dist_factor * humidity_factor
    loss_pct = round(min(loss_pct, 50.0), 1)

    # Risk level
    if loss_pct <= RISK_THRESHOLDS["low"]:
        risk_level = "low"
    elif loss_pct <= RISK_THRESHOLDS["medium"]:
        risk_level = "medium"
    elif loss_pct <= RISK_THRESHOLDS["high"]:
        risk_level = "high"
    else:
        risk_level = "critical"

    # Dominant factor
    factors = {
        "storage": s_factor,
        "transport": t_factor,
        "distance": dist_factor,
        "humidity": humidity_factor,
    }
    dominant = max(factors, key=factors.get)

    # Estimated value loss
    value_loss = tonnage * 10 * price_per_quintal * (loss_pct / 100)

    # Recommendation
    recommendations = {
        "storage": f"Upgrade to cold storage — could reduce loss by {(s_factor - 0.6) / s_factor * 100:.0f}%",
        "transport": f"Use refrigerated transport — could reduce transit loss by {(t_factor - 0.7) / t_factor * 100:.0f}%",
        "distance": f"Use nearest warehouse (currently {distance_km}km) — reduce to <50km",
        "humidity": f"Dehumidification needed — current {humidity}% is too high for {crop}",
    }

    return {
        "loss_percentage": loss_pct,
        "risk_level": risk_level,
        "dominant_factor": dominant,
        "recommendation": recommendations.get(dominant, "Optimize supply chain logistics"),
        "estimated_value_loss_inr": round(value_loss, 0),
        "base_loss_pct": base_loss,
        "crop": crop,
    }
