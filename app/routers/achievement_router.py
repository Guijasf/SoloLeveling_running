from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.achievement_schema import AchievementResponse, AchievementSummary
from app.services.achievement_service import (
    get_user_achievements,
    count_achievements,
    total_achievement_xp
)

router = APIRouter(prefix="/achievements", tags=["achievements"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_id}", response_model=list[AchievementResponse])
def get_achievements(user_id: int, db: Session = Depends(get_db)):
    """
    Obtém todos os achievements do usuário (desbloqueados).

    Retorna achievements em ordem decrescente de desbloqueio.
    """
    achievements = get_user_achievements(db, user_id)
    return achievements


@router.get("/{user_id}/count")
def get_achievement_count(user_id: int, db: Session = Depends(get_db)):
    """
    Conta total de achievements desbloqueados.
    """
    count = count_achievements(db, user_id)
    total_xp = total_achievement_xp(db, user_id)

    return {
        "total_achievements": count,
        "total_achievement_xp": total_xp
    }


@router.get("/{user_id}/summary")
def get_achievements_summary(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna sumário simplificado dos achievements para dashboard.

    Útil para mostrar os últimos achievements desbloqueados.
    """
    achievements = get_user_achievements(db, user_id)

    # Pegar últimos 5 achievements
    recent = achievements[:5]

    return {
        "total": len(achievements),
        "recent": [
            {
                "title": ach.title,
                "icon": ach.icon,
                "xp_reward": ach.xp_reward,
                "unlocked_at": ach.unlocked_at
            }
            for ach in recent
        ]
    }

