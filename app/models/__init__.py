# Importar todos os models para garantir que os relacionamentos sejam criados
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.user_settings import UserSettings
from app.models.user_focus import UserFocus
from app.models.daily_mission import DailyMission
from app.models.life_area import LifeArea
from app.models.achievement import Achievement
from app.models.metric_type import MetricType
from app.models.metric_log import MetricLog

__all__ = [
    "User",
    "UserProgress",
    "UserSettings", 
    "UserFocus",
    "DailyMission",
    "LifeArea",
    "Achievement",
    "MetricType",
    "MetricLog"
]
