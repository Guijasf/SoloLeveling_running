from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.goal import Goal
from app.schemas.goal_schema import GoalCreate, GoalResponse
from app.services.progress_engine import process_user_progress
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
    db.commit()

    # Engine centralizada processa o XP da goal completada
    progress_result = process_user_progress(db, goal.user_id)

    return {
        "mensagem": "Meta concluida com sucesso!",
        "user_level": progress_result["level"],
        "user_xp": progress_result["xp"],
        "xp_gained": 50  # TODO: Implementar XP reward customizável por goal
    }