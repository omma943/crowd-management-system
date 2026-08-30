from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from database.db import Base, engine
from routers.events import router as events_router
from routers.crowd import router as crowd_router

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crowd Management API",
    description="Backend API for AI-Based Real-Time Crowd Management System",
    version="1.0.0"
)

# Enable CORS for frontend dashboard communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(events_router)
app.include_router(crowd_router)


@app.get("/")
def root():
    return {
        "service": "AI-Based Real-Time Crowd Management API",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }
