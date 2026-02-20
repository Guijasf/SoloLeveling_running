"""
Schema para Perfil Público do Usuário
"""
from pydantic import BaseModel
from typing import Optional
from datetime import date


class UserProfilePublic(BaseModel):
    """Perfil público do usuário (compartilhável)"""
    id: int
    name: str
    level: int
    rank: str
    rank_name: str
    rank_emoji: str
    total_xp: int
    current_streak: int
    best_streak: int
    total_achievements: int
    life_score: float
    profile_created_at: Optional[str] = None

    class Config:
        from_attributes = True


class UserSettings(BaseModel):
    """Configurações do usuário"""
    profile_visibility: str = "public"  # public, friends, private
    notifications_enabled: bool = True
    weekly_report_enabled: bool = True
    theme: str = "dark"  # dark, light
    language: str = "pt-BR"  # pt-BR, en-US


class UserSettingsUpdate(BaseModel):
    """Schema para atualizar configurações"""
    profile_visibility: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    weekly_report_enabled: Optional[bool] = None
    theme: Optional[str] = None
    language: Optional[str] = None


class UserStatsResponse(BaseModel):
    """Estatísticas detalhadas do usuário"""
    total_days_active: int
    total_logs: int
    total_missions_completed: int
    total_goals_completed: int
    total_xp_earned: int
    total_achievements: int
    average_daily_xp: float
    most_improved_area: Optional[str] = None
    weakest_area: Optional[str] = None
    best_streak: int
    current_streak: int

