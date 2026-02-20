"""
Dashboard Router - Endpoint consolidado para frontend
Retorna todos os dados necessários em uma única chamada
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.daily_mission import DailyMission
from app.services.scoring_service import calculate_area_scores, calculate_life_score
from app.services.focus_service import get_current_focus
from app.services.achievement_service import get_user_achievements, count_achievements
from app.services.rank_service import get_rank_info
from app.services.level_system import get_level_info

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/{user_id}")
async def get_dashboard_data(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📊 Dashboard Consolidado

    Retorna TUDO que o frontend precisa em uma única chamada:
    - Level e XP
    - Rank
    - Streak
    - Foco semanal
    - Missões do dia
    - Scores por área (radar)
    - Conquistas recentes
    - Progresso para próximo level
    """

    # Validação: só pode acessar próprio dashboard
    if current_user.id != user_id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode acessar seu próprio dashboard"
        )

    # Busca progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()

    if not progress:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progresso não encontrado. Usuário não inicializado."
        )

    # Calcula scores das áreas
    area_scores = calculate_area_scores(db, user_id)

    # Score geral
    life_score = calculate_life_score(area_scores)

    # Foco semanal
    focus = get_current_focus(db, user_id)
    focus_data = None

    if focus:
        focus_data = {
            "area": focus.area_name,
            "days_remaining": focus.days_remaining(),
            "xp_multiplier": focus.xp_multiplier,
            "improvement": focus.improvement
        }

    # Missões de hoje
    today = date.today()
    missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date == today
    ).all()

    missions_data = [
        {
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "area": m.area_name,
            "xp_reward": m.xp_reward,
            "difficulty": m.difficulty,
            "completed": m.completed
        }
        for m in missions
    ]

    # Conquistas
    all_achievements = get_user_achievements(db, user_id)
    achievements_data = [
        {
            "title": a.title,
            "description": a.description,
            "icon": a.icon,
            "xp_reward": a.xp_reward,
            "unlocked_at": a.unlocked_at.isoformat() if a.unlocked_at else None
        }
        for a in all_achievements[:5]  # Limitar a 5 mais recentes
    ]

    total_achievements = count_achievements(db, user_id)

    # Rank info
    rank_info = get_rank_info(progress.rank)

    # Level info
    level_info = get_level_info(progress.level)

    # XP para próximo level
    xp_for_next_level = level_info["xp_required"]
    xp_progress_percentage = (progress.xp / xp_for_next_level * 100) if xp_for_next_level > 0 else 0

    # Radar data (formatted for Chart.js)
    radar_labels = [area["area"] for area in area_scores]
    radar_values = [area["score"] for area in area_scores]

    return {
        # Informações do usuário
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },

        # Progresso
        "progress": {
            "level": progress.level,
            "xp": progress.xp,
            "next_level_xp": xp_for_next_level,
            "xp_progress_percentage": round(xp_progress_percentage, 1),
            "streak": progress.current_streak,
            "last_activity": progress.last_activity_date.isoformat() if progress.last_activity_date else None
        },

        # Rank
        "rank": {
            "current": progress.rank,
            "name": rank_info["name"],
            "emoji": rank_info["emoji"],
            "min_score": rank_info["min_score"],
            "max_score": rank_info["max_score"]
        },

        # Scores
        "scores": {
            "life_score": round(life_score, 1),
            "areas": area_scores
        },

        # Radar (Chart.js format)
        "radar": {
            "labels": radar_labels,
            "values": radar_values
        },

        # Foco semanal
        "focus": focus_data,

        # Missões de hoje
        "missions": {
            "today": missions_data,
            "total": len(missions_data),
            "completed": sum(1 for m in missions if m.completed)
        },

        # Conquistas
        "achievements": {
            "recent": achievements_data,
            "total": total_achievements
        }
    }







