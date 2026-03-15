"""Seed real Tamil Nadu FCI/NAFED/TNSWC warehouses and agri stores."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.models import engine, SessionLocal, Warehouse, AgriStore, Base
from sqlalchemy import text


WAREHOUSES = [
    ("FCI Depot Trichy", "Trichy", "fci", 45000, 31500, False, 10.805, 78.686),
    ("FCI Depot Madurai", "Madurai", "fci", 38000, 22000, False, 9.925, 78.119),
    ("FCI Depot Coimbatore", "Coimbatore", "fci", 32000, 19200, True, 11.017, 76.971),
    ("NAFED Salem Complex", "Salem", "nafed", 25000, 18750, False, 11.664, 78.145),
    ("TNSWC Thanjavur", "Thanjavur", "state", 55000, 38500, False, 10.787, 79.138),
    ("TNSWC Erode", "Erode", "state", 28000, 15400, False, 11.341, 77.726),
    ("TNSWC Vellore", "Vellore", "state", 22000, 17600, False, 12.916, 79.132),
    ("TNSWC Tirunelveli", "Tirunelveli", "state", 30000, 12000, True, 8.727, 77.695),
    ("Cold Store Tiruppur", "Tiruppur", "private", 8000, 4800, True, 11.108, 77.341),
    ("FCI Chennai Central", "Chennai", "fci", 60000, 42000, False, 13.083, 80.270),
]

AGRI_STORES = [
    ("KVK Agri Store Erode", "Erode", "fertilizer", "Main Road, Erode", 11.345, 77.730),
    ("Sakthi Seeds Erode", "Erode", "seeds", "Gandhi Nagar, Erode", 11.338, 77.720),
    ("Velan Pesticides Erode", "Erode", "pesticide", "Bus Stand Rd, Erode", 11.350, 77.735),
    ("Kaveri Fertilizers Erode", "Erode", "fertilizer", "Perundurai Rd, Erode", 11.355, 77.740),
    ("Amman Seeds Erode", "Erode", "seeds", "Bhavani Rd, Erode", 11.332, 77.718),
    ("Coimbatore Agri Depot", "Coimbatore", "fertilizer", "RS Puram, Coimbatore", 11.010, 76.965),
    ("Nila Seeds Coimbatore", "Coimbatore", "seeds", "Gandhipuram, Coimbatore", 11.020, 76.975),
    ("Sri Vinayaga Agri Coimbatore", "Coimbatore", "fertilizer", "Saibaba Colony, Coimbatore", 11.025, 76.960),
    ("Green Agri Coimbatore", "Coimbatore", "pesticide", "Town Hall, Coimbatore", 11.015, 76.980),
    ("Kisan Depot Coimbatore", "Coimbatore", "fertilizer", "Peelamedu, Coimbatore", 11.030, 76.990),
    ("Madurai Agri Centre", "Madurai", "fertilizer", "Tallakulam, Madurai", 9.930, 78.125),
    ("Meenakshi Seeds Madurai", "Madurai", "seeds", "KK Nagar, Madurai", 9.920, 78.110),
    ("Pandian Pesticides Madurai", "Madurai", "pesticide", "Teppakulam, Madurai", 9.935, 78.130),
    ("Anna Fertilizers Madurai", "Madurai", "fertilizer", "SS Colony, Madurai", 9.915, 78.105),
    ("Vaigai Seeds Madurai", "Madurai", "seeds", "Mattuthavani, Madurai", 9.940, 78.135),
    ("Salem Agri Mart", "Salem", "fertilizer", "Five Roads, Salem", 11.670, 78.150),
    ("Kaveri Seeds Salem", "Salem", "seeds", "Hasthampatti, Salem", 11.660, 78.140),
    ("Mettur Agri Salem", "Salem", "pesticide", "Omalur Rd, Salem", 11.675, 78.155),
    ("Green Valley Salem", "Salem", "fertilizer", "Fairlands, Salem", 11.655, 78.135),
    ("Yercaud Organics Salem", "Salem", "organic", "Cherry Rd, Salem", 11.680, 78.160),
    ("Thanjavur Rice Centre", "Thanjavur", "fertilizer", "Big Temple Rd, Thanjavur", 10.790, 79.140),
    ("Cauvery Seeds Thanjavur", "Thanjavur", "seeds", "Gandhiji Rd, Thanjavur", 10.785, 79.135),
    ("Delta Agri Thanjavur", "Thanjavur", "pesticide", "Medical College Rd, Thanjavur", 10.795, 79.145),
    ("Paddy King Thanjavur", "Thanjavur", "fertilizer", "Palace Rd, Thanjavur", 10.780, 79.130),
    ("Nellai Agri Thanjavur", "Thanjavur", "seeds", "South Main St, Thanjavur", 10.800, 79.150),
]


def seed_all():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_wh = db.query(Warehouse).count()
        if existing_wh == 0:
            for name, district, owner, cap, stock, cold, lat, lng in WAREHOUSES:
                wh = Warehouse(
                    name=name, district=district, owner_type=owner,
                    capacity_mt=cap, current_stock_mt=stock,
                    cold_storage=cold, lat=lat, lng=lng
                )
                db.add(wh)
            db.commit()
            db.execute(text(
                "UPDATE warehouses SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326) WHERE geom IS NULL"
            ))
            db.commit()
            print(f"Seeded {len(WAREHOUSES)} warehouses.")
        else:
            print(f"Warehouses already seeded ({existing_wh} found).")

        existing_stores = db.query(AgriStore).count()
        if existing_stores == 0:
            for name, district, stype, addr, lat, lng in AGRI_STORES:
                store = AgriStore(
                    name=name, district=district, store_type=stype,
                    address=addr, lat=lat, lng=lng
                )
                db.add(store)
            db.commit()
            db.execute(text(
                "UPDATE agri_stores SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326) WHERE geom IS NULL"
            ))
            db.commit()
            print(f"Seeded {len(AGRI_STORES)} agri stores.")
        else:
            print(f"Agri stores already seeded ({existing_stores} found).")

        # Seed demo accounts
        from db.models import Farmer
        demo_farmer = db.query(Farmer).filter(Farmer.phone == "9876543210").first()
        if not demo_farmer:
            db.add(Farmer(
                phone="9876543210", name="Murugan K",
                district="Erode", land_area_ha=2.5,
                language="ta", role="farmer"
            ))
            db.add(Farmer(
                phone="9988776655", name="Officer Ravi",
                district="Thanjavur", land_area_ha=0,
                language="en", role="officer"
            ))
            db.commit()
            print("Seeded demo farmer and officer accounts.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
