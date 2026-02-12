from pydantic import BaseModel
from datetime import date


class DailyMissionResponse(BaseModel):
    id: int
    title: str
    xp_reward: int
    completed: bool
    mission_date: date

    class Config:
        from_attributes = True
