from fastapi import FastAPI

from database.db import Base
from database.db import engine

from routers.events import router as events_router
from routers.crowd import router as crowd_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crowd MAnagement API"
)

app.include_router(events_router)

app.include_router(crowd_router)