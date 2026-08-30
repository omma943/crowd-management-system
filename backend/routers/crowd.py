from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.db import get_db
from database.models import CrowdEvent
from schemas.event_schema import (
    CrowdCurrentResponse,
    CrowdStatsResponse,
    GateAnalyticsResponse,
    CameraStatusResponse,
    CrowdHistoryPoint,
    AlertItem
)
from services.crowd_service import (
    get_current_crowd,
    get_today_stats,
    get_crowd_history,
    get_gate_analytics,
    get_camera_statuses
)

router = APIRouter()


@router.get("/crowd/current", response_model=CrowdCurrentResponse)
def current_crowd(db: Session = Depends(get_db)):
    """
    Get live crowd count = max(0, total entries - total exits).
    Original endpoint preserved.
    """
    entry = db.query(
        func.coalesce(func.sum(CrowdEvent.count), 0)
    ).filter(CrowdEvent.direction == "entry").scalar()

    exit_ = db.query(
        func.coalesce(func.sum(CrowdEvent.count), 0)
    ).filter(CrowdEvent.direction == "exit").scalar()

    return {
        "current_crowd": max(0, (entry or 0) - (exit_ or 0))
    }


@router.get("/crowd/stats", response_model=CrowdStatsResponse)
@router.get("/crowd/today", response_model=CrowdStatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """
    Get comprehensive today KPI statistics:
    current crowd, entered today, exited today, peak crowd, peak time, average crowd, busiest hour.
    """
    return get_today_stats(db)


@router.get("/crowd/history", response_model=List[CrowdHistoryPoint])
def get_history(
    period: str = Query("today", description="Period: today, yesterday, 7days, 30days"),
    db: Session = Depends(get_db)
):
    """
    Get time-series history data for crowd trends and entry vs exit comparisons.
    """
    return get_crowd_history(db, period)


@router.get("/crowd/gates", response_model=List[GateAnalyticsResponse])
def get_gates(db: Session = Depends(get_db)):
    """
    Get multi-gate analytics: entries, exits, contribution, cameras.
    """
    return get_gate_analytics(db)


@router.get("/crowd/cameras", response_model=List[CameraStatusResponse])
def get_cameras(db: Session = Depends(get_db)):
    """
    Get camera statuses and last detected event times.
    """
    return get_camera_statuses(db)


@router.get("/crowd/alerts", response_model=List[AlertItem])
def get_alerts(
    capacity: int = Query(200, description="Configurable maximum capacity"),
    db: Session = Depends(get_db)
):
    """
    Generate threshold-based and operational alerts based on real backend metrics.
    """
    stats = get_today_stats(db)
    current = stats["current_crowd"]
    occupancy_pct = (current / capacity * 100) if capacity > 0 else 0
    now_str = datetime.now().isoformat()
    now_time = datetime.now().strftime("%I:%M %p")

    alerts = []

    if current > capacity:
        alerts.append({
            "id": "alert-overcap",
            "type": "OVER_CAPACITY",
            "priority": "CRITICAL",
            "title": "Over Capacity Alert",
            "message": f"Current crowd ({current}) exceeds maximum capacity ({capacity}) by {current - capacity} people. Occupancy is {occupancy_pct:.1f}%.",
            "timestamp": now_time,
            "status": "ACTIVE"
        })
    elif occupancy_pct >= 90:
        alerts.append({
            "id": "alert-critical",
            "type": "CRITICAL_CROWD",
            "priority": "CRITICAL",
            "title": "Critical Crowd Density",
            "message": f"Occupancy reached {occupancy_pct:.1f}% ({current}/{capacity}). Immediate gate flow restriction recommended.",
            "timestamp": now_time,
            "status": "ACTIVE"
        })
    elif occupancy_pct >= 70:
        alerts.append({
            "id": "alert-high",
            "type": "HIGH_CROWD",
            "priority": "HIGH",
            "title": "High Crowd Density",
            "message": f"Occupancy reached {occupancy_pct:.1f}% ({current}/{capacity}). Monitor entry gates closely.",
            "timestamp": now_time,
            "status": "ACTIVE"
        })
    elif occupancy_pct >= 30:
        alerts.append({
            "id": "alert-moderate",
            "type": "MODERATE_CROWD",
            "priority": "INFO",
            "title": "Moderate Crowd Flow",
            "message": f"Crowd levels are moderate at {occupancy_pct:.1f}% capacity ({current}/{capacity}).",
            "timestamp": now_time,
            "status": "ACTIVE"
        })
    else:
        alerts.append({
            "id": "alert-normal",
            "type": "NORMAL_OPERATION",
            "priority": "INFO",
            "title": "Normal Operations",
            "message": f"Crowd levels are low ({current}/{capacity} people, {occupancy_pct:.1f}%). Normal flow active.",
            "timestamp": now_time,
            "status": "ACTIVE"
        })

    # Add peak alert if peak happened today
    if stats["peak_crowd"] > 0:
        alerts.append({
            "id": "alert-peak",
            "type": "PEAK_RECORDED",
            "priority": "WARNING" if stats["peak_crowd"] >= capacity * 0.8 else "INFO",
            "title": f"Peak Crowd Today: {stats['peak_crowd']} People",
            "message": f"Peak attendance recorded at {stats['peak_time']}.",
            "timestamp": stats["peak_time"] or now_time,
            "status": "RECORDED"
        })

    return alerts
