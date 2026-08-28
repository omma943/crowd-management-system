from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from database.db import get_db
from database.models import CrowdEvent

router = APIRouter()

@router.get("/crowd/current")
def current_crowd(
    db: Session = Depends(get_db)
    ):

    entry = db.query(
        func.coalesce(
            func.sum(CrowdEvent.count), 0
        )
    ).filter(
        CrowdEvent.direction == "entry"
    ).scalar()

    exit_ = db.query(
        func.coalesce(
            func.sum(CrowdEvent.count), 0
        )
    ).filter(
        CrowdEvent.direction == "exit"
    ).scalar()

    return {
        "current_crowd": max(
            0,
            entry - exit_
        )
    }
    