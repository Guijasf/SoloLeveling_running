from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "other"  # financial, weight, habit, career, health, relationships, learning, other
    target_value: Optional[float] = None
    priority: int = Field(default=3, ge=1, le=5)
    due_date: Optional[date] = None
    reward_xp: int = 100
    user_id: int


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None  # not_started, in_progress, completed, abandoned
    target_value: Optional[float] = None
    current_progress: Optional[float] = None
    priority: Optional[int] = Field(None, ge=1, le=5)
    due_date: Optional[date] = None
    reward_xp: Optional[int] = None


class GoalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    category: str
    status: str
    target_value: Optional[float]
    current_progress: float
    priority: int
    created_at: date
    updated_at: date
    due_date: Optional[date]
    completed_at: Optional[date]
    reward_xp: int
    completed: bool  # Compatibilidade

    class Config:
        from_attributes = True


class GoalListResponse(BaseModel):
    """Resposta simplificada para listar metas"""
    id: int
    title: str
    category: str
    status: str
    target_value: Optional[float]
    current_progress: float
    priority: int
    due_date: Optional[date]
    reward_xp: int

    class Config:
        from_attributes = True


class GoalProgressUpdate(BaseModel):
    """Para atualizar apenas o progresso"""
    current_progress: float
    status: Optional[str] = None


class GoalStatistics(BaseModel):
    """Estatísticas de metas do usuário"""
    total_goals: int
    completed_goals: int
    in_progress_goals: int
    completion_rate: float
    total_xp_earned: int
    total_xp_potential: int
    goals_by_category: dict
