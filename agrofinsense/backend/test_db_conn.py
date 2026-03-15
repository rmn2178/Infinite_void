import os
from dotenv import load_dotenv
load_dotenv()
from db.models import SessionLocal
from sqlalchemy import text

try:
    db = SessionLocal()
    # Test with string (what health() currently does)
    try:
        print("Testing with string 'SELECT 1'...")
        db.execute("SELECT 1")
        print("String test passed")
    except Exception as e:
        print(f"String test failed: {e}")
        
    # Test with text()
    try:
        print("Testing with text('SELECT 1')...")
        db.execute(text("SELECT 1"))
        print("text() test passed")
    except Exception as e:
        print(f"text() test failed: {e}")
    
    db.close()
except Exception as e:
    print(f"Connection failed: {e}")
