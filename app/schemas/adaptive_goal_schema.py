"""
Schemas (Pydantic) para validação de dados de metas adaptáveis
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum


class GoalTypeEnum(str, Enum):
    DAILY = "daily"
    FREQUENCY = "frequency"
    CUMULATIVE = "cumulative"
    MILESTONE = "milestone"


class GoalPeriodEnum(str, Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    CUSTOM = "custom"


class GoalStatusEnum(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    FAILED = "failed"


# ====== SCHEMAS DE ENTRADA ======

class GoalRegistryCreate(BaseModel):
    """Schema para criar registro de progresso"""
    date: date
    value: float = Field(..., gt=0, description="Valor deve ser positivo")
    note: Optional[str] = None


class AdaptiveGoalCreate(BaseModel):
    """Schema para criar nova meta"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    emoji: str = Field(default="🎯", max_length=10)
    
    type: GoalTypeEnum
    unit: str = Field(default="vezes", max_length=50)
    target_value: float = Field(..., gt=0)
    
    start_date: date
    end_date: date
    period: GoalPeriodEnum
    
    priority: int = Field(default=3, ge=1, le=5)
    xp_reward: int = Field(default=50, ge=0)


class AdaptiveGoalUpdate(BaseModel):
    """Schema para atualizar meta"""
    title: Optional[str] = None
    description: Optional[str] = None
    emoji: Optional[str] = None
    
    target_value: Optional[float] = None
    status: Optional[GoalStatusEnum] = None
    priority: Optional[int] = None
    
    class Config:
        validate_assignment = True


# ====== SCHEMAS DE SAÍDA ======

class GoalRegistryResponse(BaseModel):
    """Schema de resposta para registro de progresso"""
    id: int
    goal_id: int
    date: date
    value: float
    note: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdaptiveGoalResponse(BaseModel):
    """Schema de resposta para meta com progresso calculado"""
    id: int
    title: str
    description: Optional[str]
    emoji: str
    
    type: str
    unit: str
    target_value: float
    
    start_date: date
    end_date: date
    period: str
    
    status: str
    priority: int
    
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    
    registries: List[GoalRegistryResponse]
    
    class Config:
        from_attributes = True


class GoalProgressResponse(BaseModel):
    """Schema de resposta com progresso calculado"""
    goal: AdaptiveGoalResponse
    progress: Dict[str, Any]
    achievements: List[Dict[str, Any]]
    xp_earned: int
    
    class Config:
        from_attributes = True


class BulkProgressResponse(BaseModel):
    """Schema para retornar múltiplas metas com progresso"""
    goals: List[GoalProgressResponse]
    total_xp: int
    current_level: int
    next_level_xp: int
    active_count: int
    completed_count: int
    
    class Config:
        from_attributes = True
