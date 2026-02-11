from fastapi import FastAPI
from database import engine, Base

from routers import user_router

from models import user, goal

from routers.goal_router import router as goal_router


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router.router)

app.include_router(goal_router)
@app.get("/")
def root():
    return {"message": "Welcome to SoloLeveling API running"}