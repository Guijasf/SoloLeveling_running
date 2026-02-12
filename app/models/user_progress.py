from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    rank = Column(String, default="E")

    current_streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)

    user = relationship("User")
