from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.metric_log import MetricLog
from app.models.user_progress import UserProgress
from app.schemas.metric_log_schema import MetricLogCreate, MetricLogResponse
from app.services.xp_service import add_xp
from app.services.streak_service import update_streak


router = APIRouter(prefix="/metric-logs", tags=["Metric Logs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MetricLogResponse)
def create_log(log: MetricLogCreate, db: Session = Depends(get_db)):

    new_log = MetricLog(**log.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # 🔥 adicionar XP automático
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == log.user_id
    ).first()

    if progress:
        add_xp(progress, 20)

        update_streak(progress)

        progress.level = calculate_level(progress.xp)
        progress.rank = calculate_rank(progress.level)

        db.commit()

    return new_log

@router.get("/", response_model=list[MetricLogResponse])
def list_logs(db: Session = Depends(get_db)):
    return db.query(MetricLog).all()
