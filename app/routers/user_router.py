from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.user import User
from app.models.user_progress import UserProgress
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.xp_service import add_xp

router = APIRouter(prefix="/users", tags=["users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # cria progress automaticamente
    progress = UserProgress(user_id=new_user.id, xp=0, level=1)
    db.add(progress)
    db.commit()

    return new_user


@router.post("/{user_id}/add-xp")
def add_xp_route(user_id: int, db: Session = Depends(get_db)):

    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).first()

    if not progress:
        progress = UserProgress(user_id=user_id, xp=0, level=1)
        db.add(progress)

    add_xp(progress, 50)

    db.commit()

    return {
        "xp": progress.xp,
        "level": progress.level
    }
router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def list_users():
    return {"msg": "Lista de usuários funcionando"}

@router.post("/{user_id}/add-xp")
def add_xp(user_id: int, xp: int):
    return {
        "user_id": user_id,
        "xp_added": xp,
        "msg": "XP adicionada com sucesso"
    }