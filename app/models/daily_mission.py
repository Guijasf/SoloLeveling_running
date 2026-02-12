from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import date


class DailyMission(Base):
    __tablename__ = "daily_missions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    xp_reward = Column(Integer, default=50)

    completed = Column(Boolean, default=False)
    mission_date = Column(Date, default=date.today)

    user = relationship("User")
