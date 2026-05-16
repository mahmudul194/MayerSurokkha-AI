import asyncio
from app.database import db

async def test_sync():
    print("Testing connection to cloud...")
    await db.connect()
    
    if db.db is None:
        print("Failed to connect. Check your MONGODB_URL in .env")
        return

    test_record = {
        "mother_id": "TEST-001",
        "name": "Test User",
        "age": 25,
        "week": 20,
        "bp_sys": 120,
        "bp_dia": 80,
        "risk_level": "Low",
        "timestamp": 123456789,
        "status": "Verified Connection"
    }

    print("Inserting test record...")
    await db.health_records.insert_one(test_record)
    print("Success! You should now see 'MayerSurokkhaDB' in Atlas.")

if __name__ == "__main__":
    asyncio.run(test_sync())
