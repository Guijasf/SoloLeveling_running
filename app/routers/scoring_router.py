from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.scoring_service import (
    calculate_area_scores,
    calculate_life_score,
    find_weakest_area
)
from app.services.scoring_service import calculate_trend
from app.services.focus_service import generate_weekly_focus
from app.services.radar_service import build_radar_data
from app.services.rank_service import calculate_rank

router = APIRouter(prefix="/score", tags=["Scoring"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_id}")
def get_user_score(user_id: int, db: Session = Depends(get_db)):

    area_scores = calculate_area_scores(db, user_id)
    life_score = calculate_life_score(area_scores)
    weakest_area = find_weakest_area(area_scores)
    trend = calculate_trend(db, user_id)
    weekly_focus = generate_weekly_focus(weakest_area)
    radar = build_radar_data(area_scores, life_score)
    rank = calculate_rank(life_score)

    return {
        "life_score": life_score,
        "trend": trend,
        "area_scores": area_scores,
        "rank": rank,
        "weakest_area": weakest_area,
        "weekly_focus": weekly_focus,
        "radar": radar

    }

router = APIRouter(prefix="/score", tags=["Score"])

@router.get("/")
def score_status():
    return {"msg": "Score funcionando corretamente"}
