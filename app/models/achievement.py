from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Tipo de achievement
    achievement_type = Column(String, nullable=False)  # ex: "streak_7", "rank_b", "xp_1000"

    # Informações
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, default="⭐")  # emoji ou icone

    # Recompensa
    xp_reward = Column(Integer, default=100)

    # Metadata
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    progress = Column(Float, default=0.0)  # 0-100%, para achievements progressivos

    user = relationship("User")

    def is_completed(self) -> bool:
        """Verifica se achievement foi desbloqueado"""
        return self.unlocked_at is not None

