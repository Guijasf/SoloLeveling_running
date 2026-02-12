from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import SessionLocal
from app.models.daily_mission import DailyMission
from app.schemas.daily_mission_schema import DailyMissionResponse
from app.services.mission_service import generate_daily_missions
from app.services.scoring_service import calculate_area_scores


router = APIRouter(prefix="/missions", tags=["missions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_id}", response_model=list[DailyMissionResponse])
def get_today_missions(user_id: int, db: Session = Depends(get_db)):

    today = date.today()

    missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date == today
    ).all()

    if missions:
        return missions

    # se não existir, gera novas
    area_scores = calculate_area_scores(db, user_id)
    weakest = min(area_scores, key=lambda x: x["score"])

    return generate_daily_missions(db, user_id, weakest)
