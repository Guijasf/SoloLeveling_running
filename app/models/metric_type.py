from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.core.database import Base

class MetricType(Base):
    __tablename__ = "metric_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    unit = Column(String, nullable=False)

    life_area_id = Column(Integer, ForeignKey("life_areas.id"))
    