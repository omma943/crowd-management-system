from typing import Optional, List
from pydantic import BaseModel


class EventCreate(BaseModel):
    camera_id: str
    gate_id: str
    direction: str
    count: int = 1


class EventResponse(BaseModel):
    id: int
    camera_id: str
    gate_id: str
    direction: str
    count: int
    timestamp: str

    class Config:
        from_attributes = True


class EventListResponse(BaseModel):
    total: int
    events: List[EventResponse]


class CrowdCurrentResponse(BaseModel):
    current_crowd: int


class CrowdStatsResponse(BaseModel):
    current_crowd: int
    entered_today: int
    exited_today: int
    peak_crowd: int
    peak_time: Optional[str] = None
    average_crowd: float
    busiest_hour: Optional[str] = None
    busiest_hour_count: int = 0


class GateAnalyticsResponse(BaseModel):
    gate_id: str
    entries: int
    exits: int
    current_contribution: int
    entry_camera: Optional[str] = None
    exit_camera: Optional[str] = None
    entry_status: str = "ONLINE"
    exit_status: str = "ONLINE"


class CameraStatusResponse(BaseModel):
    camera_id: str
    gate_id: str
    direction: str
    status: str
    last_event_time: Optional[str] = None


class CrowdHistoryPoint(BaseModel):
    time: str
    timestamp: str
    entries: int
    exits: int
    crowd: int


class AlertItem(BaseModel):
    id: str
    type: str
    priority: str
    title: str
    message: str
    timestamp: str
    status: str = "ACTIVE"
