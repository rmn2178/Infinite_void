-- AgroFinSense Database Schema (PostGIS)

CREATE EXTENSION IF NOT EXISTS postgis;

-- Farmers
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    district VARCHAR(50) NOT NULL,
    land_area_ha FLOAT DEFAULT 1.0,
    language VARCHAR(5) DEFAULT 'ta',
    role VARCHAR(20) DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Soil profiles
CREATE TABLE IF NOT EXISTS soil_profiles (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    nitrogen_ppm FLOAT,
    phosphorus_ppm FLOAT,
    potassium_ppm FLOAT,
    ph_value FLOAT,
    organic_carbon_pct FLOAT,
    confidence_score FLOAT DEFAULT 0.0,
    raw_text TEXT,
    mongo_doc_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Weather snapshots
CREATE TABLE IF NOT EXISTS weather_snapshots (
    id SERIAL PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    total_rainfall_mm FLOAT,
    rainfall_deviation_pct FLOAT,
    avg_temp_max FLOAT,
    avg_solar FLOAT,
    forecast_days INTEGER DEFAULT 180,
    fetched_at TIMESTAMP DEFAULT NOW()
);

-- Market prices
CREATE TABLE IF NOT EXISTS market_prices (
    id SERIAL PRIMARY KEY,
    crop VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    mandi VARCHAR(100),
    price FLOAT NOT NULL,
    arrival_date VARCHAR(30),
    is_live BOOLEAN DEFAULT TRUE,
    fetched_at TIMESTAMP DEFAULT NOW()
);

-- Yield forecasts
CREATE TABLE IF NOT EXISTS yield_forecasts (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    crop VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    predicted_kg_per_ha FLOAT,
    confidence_low FLOAT,
    confidence_high FLOAT,
    district_tonnage_mt FLOAT,
    limiting_factor VARCHAR(200),
    season VARCHAR(20) DEFAULT 'Kharif 2025',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    top_crop VARCHAR(50),
    top_crops_json TEXT,
    yield_prediction_json TEXT,
    price_forecast_json TEXT,
    scheme_eligibility_json TEXT,
    why_narrative TEXT,
    ai_model_used VARCHAR(50) DEFAULT 'gemma3:4b',
    status VARCHAR(20) DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scheme eligibility
CREATE TABLE IF NOT EXISTS scheme_eligibility (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    scheme_name VARCHAR(100) NOT NULL,
    eligible BOOLEAN DEFAULT FALSE,
    benefit_amount FLOAT DEFAULT 0,
    reason VARCHAR(300),
    checked_at TIMESTAMP DEFAULT NOW()
);

-- Gov budget projections
CREATE TABLE IF NOT EXISTS gov_budget_projections (
    id SERIAL PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    crop VARCHAR(50) NOT NULL,
    season VARCHAR(20) NOT NULL,
    total_tonnage_mt FLOAT,
    procurement_cost_inr FLOAT,
    msp_used FLOAT,
    pmfby_payout_est_inr FLOAT,
    total_scheme_spend FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Warehouses (PostGIS)
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    district VARCHAR(50) NOT NULL,
    owner_type VARCHAR(20) NOT NULL,
    capacity_mt FLOAT NOT NULL,
    current_stock_mt FLOAT DEFAULT 0,
    cold_storage BOOLEAN DEFAULT FALSE,
    lat FLOAT,
    lng FLOAT,
    geom geometry(Point, 4326)
);

-- Agri stores
CREATE TABLE IF NOT EXISTS agri_stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    district VARCHAR(50) NOT NULL,
    store_type VARCHAR(50) DEFAULT 'fertilizer',
    address VARCHAR(300),
    lat FLOAT,
    lng FLOAT,
    geom geometry(Point, 4326)
);

-- District summary cache
CREATE TABLE IF NOT EXISTS district_summaries (
    id SERIAL PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    season VARCHAR(20) NOT NULL,
    summary_text TEXT,
    yield_data_json TEXT,
    budget_data_json TEXT,
    storage_data_json TEXT,
    ai_model_used VARCHAR(50) DEFAULT 'gemma3:4b',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_prices_crop_district ON market_prices(crop, district);
CREATE INDEX IF NOT EXISTS idx_weather_district ON weather_snapshots(district);
CREATE INDEX IF NOT EXISTS idx_warehouses_geom ON warehouses USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_agri_stores_geom ON agri_stores USING GIST(geom);
