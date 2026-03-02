from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Date, Text, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import date, datetime
from enum import Enum as PyEnum


class GoalCategory(PyEnum):
    FINANCIAL = "financial"
    WEIGHT = "weight"
    HABIT = "habit"
    CAREER = "career"
    HEALTH = "health"
    RELATIONSHIPS = "relationships"
    LEARNING = "learning"
    OTHER = "other"


class GoalStatus(PyEnum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Informações básicas
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, default="other")  # financial, weight, habit, career, etc
    status = Column(String, default="not_started")  # not_started, in_progress, completed, abandoned
    
    # Progresso
    target_value = Column(Float, nullable=True)  # Meta final (ex: 80kg, R$5000)
    current_progress = Column(Float, default=0)  # Progresso atual
    priority = Column(Integer, default=3)  # 1-5 (5 = máxima)
    
    # Datas
    created_at = Column(Date, default=date.today)
    updated_at = Column(Date, default=date.today, onupdate=date.today)
    due_date = Column(Date, nullable=True)
    completed_at = Column(Date, nullable=True)
    
    # Recompensas
    reward_xp = Column(Integer, default=100)
    
    # Legado (manter compatibilidade)
    completed = Column(Boolean, default=False)
    
    user = relationship("User")
