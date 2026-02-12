from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.goal import Goal
from app.schemas.goal_schema import GoalCreate, GoalResponse

from app.services.xp_service import add_xp
from fastapi import HTTPException

router = APIRouter(prefix="/goals", tags=["goals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=GoalResponse)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    new_goal = Goal(title=goal.title, user_id=goal.user_id)
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


@router.post("/complete/{goal_id}")
def complete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")

    if goal.completed:
        raise HTTPException(status_code=404, detail="Meta já concluida")

    goal.completed = True

    user = add_xp(db, goal.user_id, 50)

    db.commit()

    return {
        "mensagem": "Meta concluida com sucesso!",
        "user_level": user.level,
        "user_xp": user.xp
    }