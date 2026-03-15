"""PostGIS-based warehouse storage planner."""
import logging
from sqlalchemy import text
from db.models import SessionLocal

logger = logging.getLogger(__name__)


class StoragePlanner:
    async def allocate(
        self, district: str, crop: str,
        forecast_tonnage_mt: float, db=None
    ) -> dict:
        """Allocate storage for forecasted tonnage using PostGIS proximity."""
        own_db = db is None
        if own_db:
            db = SessionLocal()

        try:
            # Find warehouses within 100km using PostGIS ST_DWithin
            # 1 degree ≈ 111km, so 100km ≈ 0.9 degrees
            query = text("""
                SELECT id, name, district, owner_type, capacity_mt,
                       current_stock_mt, cold_storage, lat, lng,
                       (capacity_mt - current_stock_mt) as available_mt
                FROM warehouses
                WHERE district = :district
                   OR ST_DWithin(
                       geom,
                       (SELECT geom FROM warehouses WHERE district = :district LIMIT 1),
                       0.9
                   )
                ORDER BY
                    CASE WHEN district = :district THEN 0 ELSE 1 END,
                    (capacity_mt - current_stock_mt) DESC
            """)

            result = db.execute(query, {"district": district})
            warehouses = []
            total_available = 0

            for row in result:
                available = max(0, row.capacity_mt - row.current_stock_mt)
                total_available += available
                warehouses.append({
                    "id": row.id,
                    "name": row.name,
                    "district": row.district,
                    "owner_type": row.owner_type,
                    "capacity_mt": row.capacity_mt,
                    "current_stock_mt": row.current_stock_mt,
                    "available_mt": round(available, 0),
                    "cold_storage": row.cold_storage,
                    "lat": row.lat,
                    "lng": row.lng,
                    "utilisation_pct": round(
                        row.current_stock_mt / row.capacity_mt * 100
                        if row.capacity_mt > 0 else 0, 1
                    ),
                })

            total_capacity = sum(w["capacity_mt"] for w in warehouses)
            total_stock = sum(w["current_stock_mt"] for w in warehouses)
            utilisation = (total_stock / total_capacity * 100) if total_capacity > 0 else 0
            storage_gap = max(0, forecast_tonnage_mt - total_available)

            response = {
                "district": district,
                "crop": crop,
                "forecast_tonnage_mt": forecast_tonnage_mt,
                "total_capacity_mt": total_capacity,
                "total_available_mt": round(total_available, 0),
                "utilisation_pct": round(utilisation, 1),
                "storage_gap_mt": round(storage_gap, 0),
                "status": "sufficient" if storage_gap == 0 else "overflow",
                "warehouses": warehouses,
            }

            # If overflow, find redirect warehouse beyond 100km
            if storage_gap > 0:
                overflow_query = text("""
                    SELECT id, name, district, owner_type, capacity_mt,
                           current_stock_mt, lat, lng,
                           (capacity_mt - current_stock_mt) as available_mt
                    FROM warehouses
                    WHERE district != :district
                    AND (capacity_mt - current_stock_mt) > 0
                    ORDER BY (capacity_mt - current_stock_mt) DESC
                    LIMIT 3
                """)
                overflow_result = db.execute(overflow_query, {"district": district})
                redirect = []
                for row in overflow_result:
                    redirect.append({
                        "id": row.id,
                        "name": row.name,
                        "district": row.district,
                        "available_mt": round(max(0, row.capacity_mt - row.current_stock_mt), 0),
                    })
                response["overflow_redirect"] = redirect

            return response

        except Exception as e:
            logger.error(f"Storage planner error for {district}: {e}")
            return {
                "district": district,
                "crop": crop,
                "forecast_tonnage_mt": forecast_tonnage_mt,
                "total_capacity_mt": 0,
                "total_available_mt": 0,
                "utilisation_pct": 0,
                "storage_gap_mt": forecast_tonnage_mt,
                "status": "error",
                "warehouses": [],
                "error": str(e),
            }
        finally:
            if own_db:
                db.close()
