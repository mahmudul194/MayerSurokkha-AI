import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class MayerDatabase:
    def __init__(self):
        self.client = None
        self.db = None
        self.uri = os.getenv("MONGODB_URL")
        
    async def connect(self):
        if not self.uri:
            print("Database Error: MONGODB_URL not found in environment.")
            return
            
        try:
            self.client = AsyncIOMotorClient(self.uri)
            self.db = self.client.get_database("MayerSurokkhaDB")
            # Verify connection
            await self.client.admin.command('ping')
            print("Neural Link: Cloud Database connected successfully.")
        except Exception as e:
            print(f"Database Connection Failed: {str(e)}")

    @property
    def health_records(self):
        return self.db["health_records"]

    @property
    def chat_history(self):
        return self.db["chat_history"]

    @property
    def anc_visits(self):
        return self.db["anc_visits"]

db = MayerDatabase()
