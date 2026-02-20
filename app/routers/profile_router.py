"""
Router de Perfil Público e Estatísticas
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.user_settings import UserSettings
from app.schemas.profile_schema import (
    UserProfilePublic,
    UserSettings as UserSettingsSchema,
    UserSettingsUpdate,
    UserStatsResponse
)
from app.services.scoring_service import calculate_area_scores, calculate_life_score
from app.services.achievement_service import count_achievements
from app.services.rank_service import get_rank_info
from app.services.stats_service import calculate_user_stats, get_activity_history

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/{user_id}/public", response_model=UserProfilePublic)
async def get_public_profile(user_id: int, db: Session = Depends(get_db)):
    """
    🌐 Retorna perfil público do usuário (não requer autenticação).

    Pode ser compartilhado via link único.
    Respeita configurações de privacidade.
    """
    # Buscar usuário
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )

    # Verificar configurações de privacidade
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()

    if settings and settings.profile_visibility == "private":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este perfil é privado"
        )

    # Buscar progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil não inicializado"
        )

    # Calcular scores
    area_scores = calculate_area_scores(db, user_id)
    life_score = calculate_life_score(area_scores)

    # Rank info
    rank_info = get_rank_info(progress.rank)

    # Total de achievements
    total_achievements = count_achievements(db, user_id)

    return {
        "id": user.id,
        "name": user.name,
        "level": progress.level,
        "rank": progress.rank,
        "rank_name": rank_info["name"],
        "rank_emoji": rank_info["emoji"],
        "total_xp": progress.xp,
        "current_streak": progress.current_streak,
        "best_streak": progress.best_streak,
        "total_achievements": total_achievements,
        "life_score": round(life_score, 1),
        "profile_created_at": None  # Pode adicionar campo created_at no User
    }


@router.get("/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_statistics(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📊 Retorna estatísticas detalhadas do usuário (protegido).

    Apenas o próprio usuário pode ver suas estatísticas.
    """
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode ver suas próprias estatísticas"
        )

    stats = calculate_user_stats(db, user_id)

    return stats


@router.get("/{user_id}/activity")
async def get_activity_calendar(
    user_id: int,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📅 Retorna calendário de atividade (heatmap style).

    Args:
        days: Número de dias para retornar (padrão: 30)
    """
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode ver sua própria atividade"
        )

    activity = get_activity_history(db, user_id, days)

    return {
        "user_id": user_id,
        "days_requested": days,
        "activity": activity
    }


@router.get("/{user_id}/settings", response_model=UserSettingsSchema)
async def get_user_settings(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ⚙️ Retorna configurações do usuário.
    """
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode ver suas próprias configurações"
        )

    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()

    # Se não existe, cria com valores padrão
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "profile_visibility": settings.profile_visibility,
        "notifications_enabled": settings.notifications_enabled,
        "weekly_report_enabled": settings.weekly_report_enabled,
        "theme": settings.theme,
        "language": settings.language
    }


@router.put("/{user_id}/settings", response_model=UserSettingsSchema)
async def update_user_settings(
    user_id: int,
    settings_update: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ⚙️ Atualiza configurações do usuário.
    """
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode atualizar suas próprias configurações"
        )

    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()

    # Se não existe, cria
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)

    # Atualiza apenas campos não-None
    update_data = settings_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)

    return {
        "profile_visibility": settings.profile_visibility,
        "notifications_enabled": settings.notifications_enabled,
        "weekly_report_enabled": settings.weekly_report_enabled,
        "theme": settings.theme,
        "language": settings.language
    }

