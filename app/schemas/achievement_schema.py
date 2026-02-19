from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AchievementCreate(BaseModel):
    achievement_type: str
    title: str
    description: Optional[str] = None
    icon: str = "⭐"
    xp_reward: int = 100


class AchievementResponse(BaseModel):
    id: int
    user_id: int
    achievement_type: str
    title: str
    description: Optional[str]
    icon: str
    xp_reward: int
    unlocked_at: datetime
    progress: float

    class Config:
        from_attributes = True


class AchievementSummary(BaseModel):
    """Resumo simples de achievement para dashboard"""
    title: str
    icon: str
    xp_reward: int
    unlocked_at: datetime

    class Config:
        from_attributes = True

