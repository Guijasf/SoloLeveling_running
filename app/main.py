from fastapi import FastAPI
from app.core.database import engine, Base


from app.models import life_area
from app.models import user
from app.models import goal

from app.routers import user_router, scoring_router
from app.routers.goal_router import router as goal_router
from app.routers import life_area_router
from app.routers import metric_type_router
from app.routers import metric_log_router
from app.routers import scoring_router
from app.routers import mission_router
app = FastAPI(title="Sistema Evolução 360°")

Base.metadata.create_all(bind=engine)

app.include_router(user_router.router)
app.include_router(goal_router)
app.include_router(
    life_area_router.router,
    prefix="/life-areas",
    tags=["Life Areas"]
)

app.include_router(metric_type_router.router)
app.include_router(metric_log_router.router)
app.include_router(scoring_router.router)
app.include_router(mission_router.router)

app.include_router(user_router.router)
app.include_router(scoring_router.router)
@app.get("/")
def root():
    return {"message": "Welcome to Sistema Evolução 360° 🚀"}
@app.get("/")
def root():
    return {"msg": "API rodando corretamente"}