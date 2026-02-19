from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class MetricType(Base):
    __tablename__ = "metric_types"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    life_area_id = Column(Integer, ForeignKey("life_areas.id"), nullable=False)
    name = Column(String, nullable=False)
    unit = Column(String, default="score")

    user = relationship("User")
    life_area = relationship("LifeArea")
