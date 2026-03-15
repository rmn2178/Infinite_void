import os
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey,
    create_engine
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://agro:agropass@localhost:5432/agrofinsense")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    district = Column(String(50), nullable=False)
    land_area_ha = Column(Float, default=1.0)
    language = Column(String(5), default="ta")
    role = Column(String(20), default="farmer")
    created_at = Column(DateTime, server_default=func.now())

    soil_profiles = relationship("SoilProfile", back_populates="farmer")
    yield_forecasts = relationship("YieldForecast", back_populates="farmer")
    recommendations = relationship("Recommendation", back_populates="farmer")
    scheme_eligibilities = relationship("SchemeEligibility", back_populates="farmer")


class SoilProfile(Base):
    __tablename__ = "soil_profiles"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    nitrogen_ppm = Column(Float)
    phosphorus_ppm = Column(Float)
    potassium_ppm = Column(Float)
    ph_value = Column(Float)
    organic_carbon_pct = Column(Float)
    confidence_score = Column(Float, default=0.0)
    raw_text = Column(Text)
    mongo_doc_id = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())

    farmer = relationship("Farmer", back_populates="soil_profiles")


class WeatherSnapshot(Base):
    __tablename__ = "weather_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(50), nullable=False)
    total_rainfall_mm = Column(Float)
    rainfall_deviation_pct = Column(Float)
    avg_temp_max = Column(Float)
    avg_solar = Column(Float)
    forecast_days = Column(Integer, default=180)
    fetched_at = Column(DateTime, server_default=func.now())


class MarketPrice(Base):
    __tablename__ = "market_prices"
    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String(50), nullable=False)
    district = Column(String(50), nullable=False)
    mandi = Column(String(100))
    price = Column(Float, nullable=False)
    arrival_date = Column(String(30))
    is_live = Column(Boolean, default=True)
    fetched_at = Column(DateTime, server_default=func.now())


class YieldForecast(Base):
    __tablename__ = "yield_forecasts"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    crop = Column(String(50), nullable=False)
    district = Column(String(50), nullable=False)
    predicted_kg_per_ha = Column(Float)
    confidence_low = Column(Float)
    confidence_high = Column(Float)
    district_tonnage_mt = Column(Float)
    limiting_factor = Column(String(200))
    season = Column(String(20), default="Kharif 2025")
    created_at = Column(DateTime, server_default=func.now())

    farmer = relationship("Farmer", back_populates="yield_forecasts")


class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    top_crop = Column(String(50))
    top_crops_json = Column(Text)
    yield_prediction_json = Column(Text)
    price_forecast_json = Column(Text)
    scheme_eligibility_json = Column(Text)
    why_narrative = Column(Text)
    ai_model_used = Column(String(50), default="gemma3:4b")
    status = Column(String(20), default="processing")
    created_at = Column(DateTime, server_default=func.now())

    farmer = relationship("Farmer", back_populates="recommendations")


class SchemeEligibility(Base):
    __tablename__ = "scheme_eligibility"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    scheme_name = Column(String(100), nullable=False)
    eligible = Column(Boolean, default=False)
    benefit_amount = Column(Float, default=0)
    reason = Column(String(300))
    checked_at = Column(DateTime, server_default=func.now())

    farmer = relationship("Farmer", back_populates="scheme_eligibilities")


class GovBudgetProjection(Base):
    __tablename__ = "gov_budget_projections"
    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(50), nullable=False)
    crop = Column(String(50), nullable=False)
    season = Column(String(20), nullable=False)
    total_tonnage_mt = Column(Float)
    procurement_cost_inr = Column(Float)
    msp_used = Column(Float)
    pmfby_payout_est_inr = Column(Float)
    total_scheme_spend = Column(Float)
    created_at = Column(DateTime, server_default=func.now())


class Warehouse(Base):
    __tablename__ = "warehouses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    district = Column(String(50), nullable=False)
    owner_type = Column(String(20), nullable=False)
    capacity_mt = Column(Float, nullable=False)
    current_stock_mt = Column(Float, default=0)
    cold_storage = Column(Boolean, default=False)
    lat = Column(Float)
    lng = Column(Float)
    geom = Column(Geometry("POINT", srid=4326))


class AgriStore(Base):
    __tablename__ = "agri_stores"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    district = Column(String(50), nullable=False)
    store_type = Column(String(50), default="fertilizer")
    address = Column(String(300))
    lat = Column(Float)
    lng = Column(Float)
    geom = Column(Geometry("POINT", srid=4326))


class DistrictSummary(Base):
    __tablename__ = "district_summaries"
    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(50), nullable=False)
    season = Column(String(20), nullable=False)
    summary_text = Column(Text)
    yield_data_json = Column(Text)
    budget_data_json = Column(Text)
    storage_data_json = Column(Text)
    ai_model_used = Column(String(50), default="gemma3:4b")
    created_at = Column(DateTime, server_default=func.now())


def init_db():
    Base.metadata.create_all(bind=engine)
