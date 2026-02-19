from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.metric_log import MetricLog
from app.schemas.metric_log_schema import MetricLogCreate
from app.services.progress_engine import process_user_progress

router = APIRouter(prefix="/metric-logs", tags=["Metric Logs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_log(log: MetricLogCreate, db: Session = Depends(get_db)):

    new_log = MetricLog(**log.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Engine recebe o novo log para calcular XP corretamente
    result = process_user_progress(db, log.user_id, new_log)

    return {
        "metric": new_log,
        "progress": result
    }


@router.get("/")
def list_logs(db: Session = Depends(get_db)):
    return db.query(MetricLog).all()
