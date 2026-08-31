from datetime import datetime, date, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database.models import CrowdEvent


def create_event(db: Session, event):
    """
    Save a new entry or exit event.
    Preserves original signature and behavior.
    """
    timestamp = datetime.now().isoformat()
    db_event = CrowdEvent(
        camera_id=event.camera_id,
        gate_id=event.gate_id,
        direction=event.direction,
        count=event.count,
        timestamp=timestamp
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_current_crowd(db: Session) -> int:
    """
    Calculate current crowd count: sum(entries) - sum(exits), min 0.
    """
    entry = db.query(
        func.coalesce(func.sum(CrowdEvent.count), 0)
    ).filter(CrowdEvent.direction == "entry").scalar() or 0

    exit_ = db.query(
        func.coalesce(func.sum(CrowdEvent.count), 0)
    ).filter(CrowdEvent.direction == "exit").scalar() or 0

    return max(0, int(entry - exit_))


def get_today_stats(db: Session) -> Dict[str, Any]:
    """
    Calculate comprehensive today statistics:
    - current_crowd
    - entered_today
    - exited_today
    - peak_crowd
    - peak_time
    - average_crowd
    - busiest_hour
    - busiest_hour_count
    """
    today_str = date.today().isoformat()

    # Query all events today ordered chronologically
    today_events = db.query(CrowdEvent).filter(
        CrowdEvent.timestamp.startswith(today_str)
    ).order_by(CrowdEvent.timestamp.asc(), CrowdEvent.id.asc()).all()

    entered_today = 0
    exited_today = 0
    running_crowd = 0
    peak_crowd = 0
    peak_time: Optional[str] = None
    crowd_samples = []
    hour_activity: Dict[int, int] = {h: 0 for h in range(24)}

    for ev in today_events:
        cnt = ev.count if ev.count is not None else 1
        if ev.direction == "entry":
            entered_today += cnt
            running_crowd += cnt
        elif ev.direction == "exit":
            exited_today += cnt
            running_crowd = max(0, running_crowd - cnt)

        crowd_samples.append(running_crowd)
        if running_crowd > peak_crowd:
            peak_crowd = running_crowd
            try:
                dt = datetime.fromisoformat(ev.timestamp)
                peak_time = dt.strftime("%I:%M %p")
            except Exception:
                peak_time = ev.timestamp

        # Track busiest hour by total volume
        try:
            dt = datetime.fromisoformat(ev.timestamp)
            hour_activity[dt.hour] += cnt
        except Exception:
            pass

    current_crowd = get_current_crowd(db)

    # Average crowd
    if crowd_samples:
        avg_crowd = round(sum(crowd_samples) / len(crowd_samples), 1)
    else:
        avg_crowd = float(current_crowd)

    # If no peak was reached higher than current, use current
    if peak_crowd == 0 and current_crowd > 0:
        peak_crowd = current_crowd
        peak_time = datetime.now().strftime("%I:%M %p")

    # Busiest hour
    busiest_hour_val = None
    busiest_hour_cnt = 0
    if any(hour_activity.values()):
        max_hour = max(hour_activity, key=lambda h: hour_activity[h])
        busiest_hour_cnt = hour_activity[max_hour]
        if busiest_hour_cnt > 0:
            start_dt = datetime(2026, 1, 1, max_hour, 0)
            end_dt = start_dt + timedelta(hours=1)
            busiest_hour_val = f"{start_dt.strftime('%I %p').lstrip('0')} - {end_dt.strftime('%I %p').lstrip('0')}"

    return {
        "current_crowd": current_crowd,
        "entered_today": entered_today,
        "exited_today": exited_today,
        "peak_crowd": peak_crowd,
        "peak_time": peak_time or datetime.now().strftime("%I:%M %p"),
        "average_crowd": avg_crowd,
        "busiest_hour": busiest_hour_val or "10 AM - 11 AM",
        "busiest_hour_count": busiest_hour_cnt
    }


def get_crowd_history(db: Session, period: str = "today") -> List[Dict[str, Any]]:
    """
    Get timeline history for charts:
    - today: Hourly data from 06:00 to 23:00 (or current hour)
    - 7days / 30days: Daily aggregated breakdown
    """
    today = date.today()
    points = []

    if period == "today" or period == "yesterday":
        target_date = today if period == "today" else today - timedelta(days=1)
        target_str = target_date.isoformat()

        events = db.query(CrowdEvent).filter(
            CrowdEvent.timestamp.startswith(target_str)
        ).order_by(CrowdEvent.timestamp.asc()).all()

        hourly_entries = {h: 0 for h in range(24)}
        hourly_exits = {h: 0 for h in range(24)}

        for ev in events:
            cnt = ev.count if ev.count is not None else 1
            try:
                dt = datetime.fromisoformat(ev.timestamp)
                h = dt.hour
            except Exception:
                h = 12
            if ev.direction == "entry":
                hourly_entries[h] += cnt
            elif ev.direction == "exit":
                hourly_exits[h] += cnt

        running = 0
        # Show hours 06:00 to 22:00 or current hour
        current_h = datetime.now().hour if period == "today" else 23
        end_hour = max(current_h, 18)
        start_hour = min(8, current_h)

        for h in range(start_hour, end_hour + 1):
            ent = hourly_entries[h]
            ext = hourly_exits[h]
            running = max(0, running + ent - ext)
            time_label = f"{h:02d}:00"
            points.append({
                "time": time_label,
                "timestamp": f"{target_str}T{time_label}:00",
                "entries": ent,
                "exits": ext,
                "crowd": running
            })

    elif period in ("7days", "30days", "week", "month"):
        days = 7 if "7" in period or period == "week" else 30
        for i in range(days - 1, -1, -1):
            d = today - timedelta(days=i)
            d_str = d.isoformat()
            events = db.query(CrowdEvent).filter(
                CrowdEvent.timestamp.startswith(d_str)
            ).all()

            ent = sum(e.count for e in events if e.direction == "entry")
            ext = sum(e.count for e in events if e.direction == "exit")
            points.append({
                "time": d.strftime("%b %d"),
                "timestamp": d_str,
                "entries": ent,
                "exits": ext,
                "crowd": max(0, ent - ext)
            })

    return points


def get_gate_analytics(db: Session) -> List[Dict[str, Any]]:
    """
    Get entry/exit metrics grouped by gate.
    """
    gates_data: Dict[str, Dict[str, Any]] = {}

    events = db.query(CrowdEvent).all()

    for ev in events:
        gid = ev.gate_id or "GATE_1"
        if gid not in gates_data:
            gates_data[gid] = {
                "gate_id": gid,
                "entries": 0,
                "exits": 0,
                "cameras": set()
            }
        cnt = ev.count if ev.count is not None else 1
        if ev.direction == "entry":
            gates_data[gid]["entries"] += cnt
        elif ev.direction == "exit":
            gates_data[gid]["exits"] += cnt

        if ev.camera_id:
            gates_data[gid]["cameras"].add(ev.camera_id)

    for g in ["GATE_1", "GATE_2"]:
        if g not in gates_data:
            gates_data[g] = {
                "gate_id": g,
                "entries": 0,
                "exits": 0,
                "cameras": {f"{g}_ENTRY", f"{g}_EXIT"} if g == "GATE_2" else {"ENTRY_01", "EXIT_01"}
            }

    results = []
    for gid, data in sorted(gates_data.items()):
        cams = list(data["cameras"])
        entry_cam = next((c for c in cams if "entry" in c.lower()), f"{gid}_ENTRY")
        exit_cam = next((c for c in cams if "exit" in c.lower()), f"{gid}_EXIT")
        contrib = max(0, data["entries"] - data["exits"])
        results.append({
            "gate_id": gid,
            "entries": data["entries"],
            "exits": data["exits"],
            "current_contribution": contrib,
            "entry_camera": entry_cam,
            "exit_camera": exit_cam,
            "entry_status": "ONLINE",
            "exit_status": "ONLINE"
        })

    return results


def get_camera_statuses(db: Session) -> List[Dict[str, Any]]:
    """
    Get known cameras with their health status and last recorded activity.
    """
    default_cameras = [
        {"camera_id": "ENTRY_01", "gate_id": "GATE_1", "direction": "entry", "status": "ONLINE"},
        {"camera_id": "EXIT_01", "gate_id": "GATE_1", "direction": "exit", "status": "ONLINE"},
        {"camera_id": "GATE_2_ENTRY", "gate_id": "GATE_2", "direction": "entry", "status": "ONLINE"},
        {"camera_id": "GATE_2_EXIT", "gate_id": "GATE_2", "direction": "exit", "status": "ONLINE"}
    ]

    cams_dict = {c["camera_id"]: c for c in default_cameras}

    # Find last event for each camera from db
    events = db.query(CrowdEvent).order_by(desc(CrowdEvent.timestamp)).all()
    for ev in events:
        cid = ev.camera_id
        if cid:
            if cid not in cams_dict:
                cams_dict[cid] = {
                    "camera_id": cid,
                    "gate_id": ev.gate_id or "GATE_1",
                    "direction": ev.direction or "entry",
                    "status": "ONLINE",
                    "last_event_time": ev.timestamp
                }
            elif "last_event_time" not in cams_dict[cid] or cams_dict[cid]["last_event_time"] is None:
                cams_dict[cid]["last_event_time"] = ev.timestamp

    return list(cams_dict.values())


def get_events_paginated(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    direction: Optional[str] = None,
    gate_id: Optional[str] = None,
    camera_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> Dict[str, Any]:
    """
    Query paginated events with optional filtering.
    """
    query = db.query(CrowdEvent)

    if direction and direction != "all":
        query = query.filter(CrowdEvent.direction == direction.lower())
    if gate_id and gate_id != "all":
        query = query.filter(CrowdEvent.gate_id == gate_id)
    if camera_id and camera_id != "all":
        query = query.filter(CrowdEvent.camera_id == camera_id)
    if start_date:
        query = query.filter(CrowdEvent.timestamp >= start_date)
    if end_date:
        query = query.filter(CrowdEvent.timestamp <= end_date + "T23:59:59")

    total = query.count()
    events = query.order_by(desc(CrowdEvent.timestamp), desc(CrowdEvent.id)).offset(skip).limit(limit).all()

    return {
        "total": total,
        "events": events
    }
