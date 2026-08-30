from datetime import datetime


def create_event(camera_id, gate_id, direction, count):
    return {
        "camera_id": camera_id,
        "gate_id": gate_id,
        "direction": direction,
        "count": count,
        "timestamp": datetime.now().isoformat()
    }