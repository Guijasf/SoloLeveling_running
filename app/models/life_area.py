from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class LifeArea(Base):
    __tablename__ = "life_areas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    weight = Column(Float, default=1.0)
