from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from .db import Base

class CrowdEvent(Base):

    __tablename__ = "crowd_events"
    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String) 
    gate_id = Column(String)
    direction = Column(String)
    count = Column(Integer)
    timestamp = Column(String)
    