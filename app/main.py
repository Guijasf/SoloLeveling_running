from fastapi import FastAPI
from app.core.database import engine, Base

from app.models import life_area, user, goal, user_focus, achievement
from app.routers import user_router, scoring_router, life_area_router, metric_type_router, metric_log_router, mission_router
from app.routers.goal_router import router as goal_router
from app.routers.focus_router import router as focus_router
from app.routers.achievement_router import router as achievement_router

app = FastAPI(title="SoloLeveling - RPG de Vida Real")

Base.metadata.create_all(bind=engine)

app.include_router(user_router.router)
app.include_router(goal_router)
app.include_router(life_area_router.router, prefix="/life-areas", tags=["Life Areas"])
app.include_router(metric_type_router.router)
app.include_router(metric_log_router.router)
app.include_router(scoring_router.router)
app.include_router(mission_router.router)
app.include_router(focus_router)
app.include_router(achievement_router)


@app.get("/")
def root():
    return {"message": "🎮 SoloLeveling - RPG de Vida Real", "status": "✅ Online"}
