from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.metric_type import MetricType
from app.schemas.metric_type_schema import MetricTypeCreate, MetricTypeResponse

router = APIRouter(prefix="/metric-types", tags=["Metric Types"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MetricTypeResponse)
def create_metric_type(metric: MetricTypeCreate, db: Session = Depends(get_db)):
    new_metric = MetricType(**metric.model_dump())
    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)
    return new_metric


@router.get("/", response_model=list[MetricTypeResponse])
def list_metric_types(db: Session = Depends(get_db)):
    return db.query(MetricType).all()
