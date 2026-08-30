from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.event_schema import EventCreate, EventResponse, EventListResponse
from services.crowd_service import create_event, get_events_paginated

router = APIRouter()


@router.post("/events", response_model=EventResponse)
def add_event(
    event: EventCreate,
    db: Session = Depends(get_db)
):
    """
    Record a new person detection entry or exit event.
    Original endpoint preserved.
    """
    return create_event(db, event)


@router.get("/events", response_model=EventListResponse)
def list_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    direction: Optional[str] = Query(None, description="Filter by entry or exit"),
    gate_id: Optional[str] = Query(None, description="Filter by gate ID"),
    camera_id: Optional[str] = Query(None, description="Filter by camera ID"),
    start_date: Optional[str] = Query(None, description="Filter by ISO start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter by ISO end date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    List historical crowd events ordered by newest first with filters.
    """
    return get_events_paginated(
        db=db,
        skip=skip,
        limit=limit,
        direction=direction,
        gate_id=gate_id,
        camera_id=camera_id,
        start_date=start_date,
        end_date=end_date
    )
