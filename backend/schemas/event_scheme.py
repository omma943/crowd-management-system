from pydantic import BaseModel

class EventCreate(BaseModel):
    camera_id: str
    gate_id: str
    direction: str
    count: int
    