"""Crop matching engine based on real ICAR NPK requirements."""
import logging

logger = logging.getLogger(__name__)

# Real ICAR published NPK requirements (kg/ha ranges)
CROP_NPK_REQUIREMENTS = {
    "Rice":       {"N": (200, 280), "P": (15, 25), "K": (150, 200), "pH": (5.5, 7.0)},
    "Maize":      {"N": (180, 240), "P": (12, 22), "K": (120, 180), "pH": (5.8, 7.5)},
    "Groundnut":  {"N": (20, 40),   "P": (20, 35), "K": (100, 150), "pH": (6.0, 7.5)},
    "Sugarcane":  {"N": (280, 350), "P": (20, 30), "K": (200, 280), "pH": (6.5, 7.5)},
    "Cotton":     {"N": (120, 160), "P": (30, 50), "K": (80, 120),  "pH": (6.0, 8.0)},
    "Banana":     {"N": (200, 300), "P": (25, 40), "K": (300, 450), "pH": (6.0, 7.5)},
    "Turmeric":   {"N": (150, 200), "P": (30, 50), "K": (200, 300), "pH": (5.5, 7.0)},
    "Onion":      {"N": (100, 130), "P": (35, 50), "K": (100, 150), "pH": (6.0, 7.5)},
    "Tomato":     {"N": (120, 160), "P": (40, 60), "K": (150, 200), "pH": (5.5, 7.0)},
    "Ragi":       {"N": (80, 120),  "P": (10, 20), "K": (80, 120),  "pH": (5.5, 7.5)},
}

# 2025 subsidised fertilizer prices (₹/kg)
FERTILIZER_PRICES = {
    "DAP": 27.0,    # Di-Ammonium Phosphate
    "Urea": 5.4,    # Nitrogen
    "MOP": 17.0,    # Muriate of Potash
}

# Crop-season suitability
CROP_SEASON = {
    "Kharif": ["Rice", "Maize", "Groundnut", "Cotton", "Sugarcane", "Ragi"],
    "Rabi": ["Rice", "Maize", "Onion", "Tomato", "Turmeric"],
    "Summer": ["Banana", "Sugarcane", "Tomato", "Onion"],
}


def _soil_match_score(soil: dict, crop_req: dict) -> float:
    """Score how well soil matches crop NPK requirements (0-10)."""
    n = soil.get("nitrogen_ppm", 150)
    p = soil.get("phosphorus_ppm", 25)
    k = soil.get("potassium_ppm", 150)
    ph = soil.get("ph_value", 6.5)

    def range_score(val, low, high):
        if low <= val <= high:
            return 10.0
        elif val < low:
            return max(0, 10 - (low - val) / (low * 0.5) * 10)
        else:
            return max(0, 10 - (val - high) / (high * 0.5) * 10)

    n_score = range_score(n, *crop_req["N"])
    p_score = range_score(p, *crop_req["P"])
    k_score = range_score(k, *crop_req["K"])
    ph_score = range_score(ph, *crop_req["pH"])

    return round((n_score * 0.3 + p_score * 0.2 + k_score * 0.2 + ph_score * 0.3), 1)


def _weather_match_score(weather: dict, crop: str) -> float:
    """Score weather suitability (0-10)."""
    deviation = abs(weather.get("rainfall_deviation_pct", 0))
    temp = weather.get("avg_temp_max", 32)

    rain_score = max(0, 10 - deviation / 5)

    # Temperature preferences by crop
    temp_optimal = {
        "Rice": 32, "Maize": 30, "Groundnut": 30, "Cotton": 33,
        "Sugarcane": 32, "Banana": 30, "Turmeric": 28, "Onion": 25,
        "Tomato": 27, "Ragi": 30,
    }
    opt = temp_optimal.get(crop, 30)
    temp_score = max(0, 10 - abs(temp - opt) / 2)

    return round((rain_score * 0.6 + temp_score * 0.4), 1)


def match_crops(soil_profile: dict, weather: dict, season: str = "Kharif") -> list[dict]:
    """Return top 3 crop matches with scores."""
    season_crops = CROP_SEASON.get(season, list(CROP_NPK_REQUIREMENTS.keys()))
    results = []

    for crop in season_crops:
        if crop not in CROP_NPK_REQUIREMENTS:
            continue
        req = CROP_NPK_REQUIREMENTS[crop]
        soil_score = _soil_match_score(soil_profile, req)
        weather_score = _weather_match_score(weather, crop)
        combined = round(soil_score * 0.6 + weather_score * 0.4, 1)

        gap = fertilizer_gap_calculator(soil_profile, crop)

        results.append({
            "crop": crop,
            "score": min(10.0, combined),
            "soil_match": soil_score,
            "weather_match": weather_score,
            "fertilizer_gap": gap,
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:3]


def fertilizer_gap_calculator(soil: dict, crop: str) -> dict:
    """Calculate fertilizer gap and cost for a specific crop."""
    req = CROP_NPK_REQUIREMENTS.get(crop, CROP_NPK_REQUIREMENTS["Rice"])
    n = soil.get("nitrogen_ppm", 150)
    p = soil.get("phosphorus_ppm", 25)
    k = soil.get("potassium_ppm", 150)

    # Calculate deficit (kg/ha needed)
    n_target = (req["N"][0] + req["N"][1]) / 2
    p_target = (req["P"][0] + req["P"][1]) / 2
    k_target = (req["K"][0] + req["K"][1]) / 2

    n_deficit = max(0, n_target - n)
    p_deficit = max(0, p_target - p)
    k_deficit = max(0, k_target - k)

    # Convert to fertilizer amounts
    # Urea is 46% N, DAP is 46% P2O5 (20% P), MOP is 60% K2O (50% K)
    urea_kg = round(n_deficit / 0.46, 1)
    dap_kg = round(p_deficit / 0.20, 1)
    mop_kg = round(k_deficit / 0.50, 1)

    cost = (
        urea_kg * FERTILIZER_PRICES["Urea"]
        + dap_kg * FERTILIZER_PRICES["DAP"]
        + mop_kg * FERTILIZER_PRICES["MOP"]
    )

    return {
        "DAP_kg_per_ha": dap_kg,
        "urea_kg_per_ha": urea_kg,
        "MOP_kg_per_ha": mop_kg,
        "estimated_cost_inr": round(cost, 2),
    }
