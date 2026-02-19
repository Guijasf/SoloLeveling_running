from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import date, datetime


class UserFocus(Base):
    __tablename__ = "user_focus"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Área em foco
    area_name = Column(String, nullable=False)

    # Score quando começou a focar
    score_when_focused = Column(Float, nullable=True)

    # Período de foco
    focus_start_date = Column(Date, default=date.today, nullable=False)
    focus_end_date = Column(Date, nullable=False)

    # Multiplicador de XP para esta área (default 1.5x)
    xp_multiplier = Column(Float, default=1.5)

    # Contadores de progresso
    logs_completed = Column(Integer, default=0)
    improvement = Column(Float, default=0.0)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")

    def is_active(self):
        """Verifica se o foco ainda está ativo"""
        return self.focus_end_date >= date.today()

    def days_remaining(self):
        """Retorna dias restantes do foco"""
        if not self.is_active():
            return 0
        return (self.focus_end_date - date.today()).days
