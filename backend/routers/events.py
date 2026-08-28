from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from database.db import get_db

from schemas.event_scheme import EventCreate

from services.crowd_service import create_event


router = APIRouter()

@router.post("/events")

def add_event(
    event: EventCreate,
    db: Session = Depends(get_db)
):

    return create_event(db, event)