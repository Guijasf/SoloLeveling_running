from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.life_area import LifeArea
from app.schemas.life_area_schema import LifeAreaCreate, LifeAreaResponse

router = APIRouter(prefix="/life-areas", tags=["Life Areas"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=LifeAreaResponse)
def create_area(area: LifeAreaCreate, db: Session = Depends(get_db)):
    new_area = LifeArea(
        name=area.name,
        weight=area.weight
    )
    db.add(new_area)
    db.commit()
    db.refresh(new_area)
    return new_area


@router.get("/", response_model=list[LifeAreaResponse])
def list_areas(db: Session = Depends(get_db)):
    return db.query(LifeArea).all()
