from datetime import datetime

from database.models import CrowdEvent


def create_event(db, event):

    db_event = CrowdEvent(
        camera_id=event.camera_id,
        gate_id=event.gate_id,
        direction=event.direction,
        count=event.count,
        timestamp=datetime.now().isoformat()
    )

    db.add(db_event)

    db.commit()

    db.refresh(db_event)

    return db_event
