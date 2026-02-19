from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import date


class DailyMission(Base):
    __tablename__ = "daily_missions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Missão
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    # Recompensa
    xp_reward = Column(Integer, default=50)

    # Status
    completed = Column(Boolean, default=False)
    mission_date = Column(Date, default=date.today, nullable=False)

    # Dificuldade dinâmica
    difficulty = Column(String, default="medium")  # easy/medium/hard

    # Métrica alvo (para missões dinâmicas)
    target_metric_value = Column(Float, nullable=True)  # Ex: 5.0 (score alvo)
    completed_value = Column(Float, nullable=True)  # O que o usuário alcançou

    # Contexto
    area_name = Column(String, nullable=True)  # A área que a missão afeta
    reason = Column(String, nullable=True)  # Por que essa missão? ("focus", "weak", "trending")

    user = relationship("User")

    def is_completed_by_metric(self) -> bool:
        """Verifica se missão foi completada pelo valor de métrica"""
        if not self.target_metric_value or not self.completed_value:
            return self.completed
        return self.completed_value >= self.target_metric_value


