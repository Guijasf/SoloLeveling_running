from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime, date
from enum import Enum as PyEnum


class GoalType(PyEnum):
    """Tipos de metas suportadas"""
    DAILY = "daily"              # Meta diária (ex: ler 15 páginas/dia)
    FREQUENCY = "frequency"      # Meta por frequência (ex: treinar 4x/semana)
    CUMULATIVE = "cumulative"    # Meta acumulativa (ex: correr 50km no mês)
    MILESTONE = "milestone"      # Meta final (ex: levantar 150kg)


class GoalPeriod(PyEnum):
    """Períodos de execução"""
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    CUSTOM = "custom"


class GoalStatus(PyEnum):
    """Status da meta"""
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    FAILED = "failed"


class AdaptiveGoal(Base):
    """Modelo universal de meta adaptável"""
    __tablename__ = "adaptive_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Identificação
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    emoji = Column(String, default="🎯")
    
    # Tipo e configuração
    type = Column(SQLEnum(GoalType), default=GoalType.DAILY, nullable=False)
    unit = Column(String, default="vezes")  # páginas, km, minutos, kg, horas, vezes, etc
    target_value = Column(Float, nullable=False)  # Valor alvo
    
    # Período e prazo
    start_date = Column(Date, default=date.today, nullable=False)
    end_date = Column(Date, nullable=False)
    period = Column(SQLEnum(GoalPeriod), default=GoalPeriod.DAY, nullable=False)
    
    # Status
    status = Column(SQLEnum(GoalStatus), default=GoalStatus.ACTIVE, nullable=False)
    priority = Column(Integer, default=3)  # 1-5
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Gamificação
    xp_reward = Column(Integer, default=50)
    tags = Column(String, default="")  # JSON array como string
    
    # Relacionamentos
    registries = relationship("GoalRegistry", back_populates="goal", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<AdaptiveGoal(id={self.id}, title={self.title}, type={self.type})>"


class GoalRegistry(Base):
    """Registro universal de progresso"""
    __tablename__ = "goal_registries"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("adaptive_goals.id"), nullable=False)
    
    # Registra
    date = Column(Date, nullable=False, index=True)
    value = Column(Float, nullable=False)  # Valor registrado
    note = Column(Text, nullable=True)  # Anotação opcional
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento
    goal = relationship("AdaptiveGoal", back_populates="registries")

    def __repr__(self):
        return f"<GoalRegistry(goal_id={self.goal_id}, date={self.date}, value={self.value})>"


class GoalAchievement(Base):
    """Achievements de metas"""
    __tablename__ = "goal_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal_id = Column(Integer, ForeignKey("adaptive_goals.id"), nullable=False)
    
    # Achievement
    achievement_id = Column(String, nullable=False)  # week_streak, month_streak, goal_completed, etc
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    xp_bonus = Column(Integer, default=0)
    
    # Timestamps
    unlocked_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<GoalAchievement(achievement_id={self.achievement_id}, name={self.name})>"
