from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import SessionLocal
from app.models.user_progress import UserProgress
from app.services.streak_service import (
    get_streak_multiplier,
    get_streak_bonus_xp,
    check_streak_milestone,
    format_streak_display
)

router = APIRouter(prefix="/streak", tags=["streak"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_id}")
def get_user_streak(user_id: int, db: Session = Depends(get_db)):
    """Obtém informações de streak do usuário."""
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    
    if not progress:
        return {
            "user_id": user_id,
            "current_streak": 0,
            "best_streak": 0,
            "multiplier": 1.0,
            "last_activity": None,
            "display": format_streak_display(0)
        }
    
    multiplier = get_streak_multiplier(progress.current_streak)
    display = format_streak_display(progress.current_streak)
    
    return {
        "user_id": user_id,
        "current_streak": progress.current_streak,
        "best_streak": progress.best_streak,
        "multiplier": multiplier,
        "last_activity": progress.last_activity_date,
        "display": display
    }


@router.get("/{user_id}/bonus")
def get_streak_bonus(user_id: int, db: Session = Depends(get_db)):
    """Obtém bonus XP do streak atualmente ativo."""
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    
    if not progress:
        return {
            "user_id": user_id,
            "bonus_xp": 0,
            "multiplier": 1.0,
            "milestone": None
        }
    
    bonus = get_streak_bonus_xp(progress.current_streak)
    multiplier = get_streak_multiplier(progress.current_streak)
    milestone = check_streak_milestone(progress)
    
    return {
        "user_id": user_id,
        "current_streak": progress.current_streak,
        "bonus_xp": bonus,
        "multiplier": multiplier,
        "milestone": milestone
    }


@router.get("/{user_id}/leaderboard")
def get_streak_leaderboard(user_id: int = None, db: Session = Depends(get_db)):
    """
    Retorna leaderboard de streaks (top 10).
    
    Se user_id fornecido, inclui posição do usuário.
    """
    # Buscar top 10 com maior streak
    top_streaks = db.query(UserProgress).order_by(
        UserProgress.current_streak.desc()
    ).limit(10).all()
    
    leaderboard = []
    for idx, prog in enumerate(top_streaks, 1):
        leaderboard.append({
            "position": idx,
            "user_id": prog.user_id,
            "streak": prog.current_streak,
            "best_streak": prog.best_streak,
            "badge": format_streak_display(prog.current_streak)["badge"],
            "level": format_streak_display(prog.current_streak)["level"]
        })
    
    # Se user_id fornecido, encontrar sua posição
    user_position = None
    if user_id:
        all_users = db.query(UserProgress).order_by(
            UserProgress.current_streak.desc()
        ).all()
        
        for idx, prog in enumerate(all_users, 1):
            if prog.user_id == user_id:
                user_progress = prog
                user_position = {
                    "position": idx,
                    "user_id": user_id,
                    "streak": user_progress.current_streak,
                    "best_streak": user_progress.best_streak
                }
                break
    
    return {
        "leaderboard": leaderboard,
        "user_position": user_position
    }
