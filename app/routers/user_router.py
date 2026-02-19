from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.user import User
from app.models.user_progress import UserProgress
from app.schemas.user_schema import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # cria progress automaticamente
    progress = UserProgress(user_id=new_user.id, xp=0, level=1)
    db.add(progress)
    db.commit()

    return new_user


@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()
