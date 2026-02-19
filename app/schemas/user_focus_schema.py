from pydantic import BaseModel
from datetime import date
from typing import Optional


class UserFocusCreate(BaseModel):
    user_id: int
    area_name: str
    xp_multiplier: float = 1.5
    focus_end_date: Optional[date] = None


class UserFocusResponse(BaseModel):
    id: int
    user_id: int
    area_name: str
    focus_start_date: date
    focus_end_date: date
    xp_multiplier: float
    score_when_focused: Optional[float] = None
    logs_completed: int
    improvement: float
    is_active: bool
    days_remaining: int

    class Config:
        from_attributes = True

    @property
    def is_active(self) -> bool:
        return self.focus_end_date >= date.today()

    @property
    def days_remaining(self) -> int:
        if not self.is_active:
            return 0
        return (self.focus_end_date - date.today()).days

