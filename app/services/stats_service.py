"""
Service para cálculo de estatísticas do usuário
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.user_progress import UserProgress
from app.models.metric_log import MetricLog
from app.models.daily_mission import DailyMission
from app.models.goal import Goal
from app.models.achievement import Achievement
from app.services.scoring_service import calculate_area_scores, find_weakest_area


def calculate_user_stats(db: Session, user_id: int) -> dict:
    """
    Calcula estatísticas completas do usuário.

    Returns:
        dict com estatísticas detalhadas
    """
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()

    if not progress:
        return _get_empty_stats()

    # 1. Total de logs
    total_logs = db.query(MetricLog).filter(MetricLog.user_id == user_id).count()

    # 2. Total de missões completadas
    total_missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.completed == True
    ).count()

    # 3. Total de goals completadas
    total_goals = db.query(Goal).filter(
        Goal.user_id == user_id,
        Goal.completed == True
    ).count()

    # 4. Total de achievements
    total_achievements = db.query(Achievement).filter(
        Achievement.user_id == user_id
    ).count()

    # 5. Dias ativos (baseado em logs únicos por data)
    unique_dates = db.query(func.count(func.distinct(MetricLog.log_date))).filter(
        MetricLog.user_id == user_id
    ).scalar() or 0

    # 6. XP médio por dia
    average_daily_xp = progress.xp / unique_dates if unique_dates > 0 else 0

    # 7. Área mais fraca e mais forte
    area_scores = calculate_area_scores(db, user_id)

    weakest_area = None
    most_improved_area = None

    if area_scores:
        weakest = find_weakest_area(area_scores)
        weakest_area = weakest["area"] if weakest else None

        # Área mais forte (maior score)
        strongest = max(area_scores, key=lambda x: x["score"])
        most_improved_area = strongest["area"]

    # 8. Tendência de evolução (últimos 7 dias vs 7 dias anteriores)
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    two_weeks_ago = today - timedelta(days=14)

    recent_logs = db.query(func.count(MetricLog.id)).filter(
        MetricLog.user_id == user_id,
        MetricLog.log_date >= week_ago
    ).scalar() or 0

    previous_logs = db.query(func.count(MetricLog.id)).filter(
        MetricLog.user_id == user_id,
        MetricLog.log_date >= two_weeks_ago,
        MetricLog.log_date < week_ago
    ).scalar() or 0

    trend = "stable"
    if recent_logs > previous_logs * 1.2:
        trend = "growing"
    elif recent_logs < previous_logs * 0.8:
        trend = "declining"

    return {
        "total_days_active": unique_dates,
        "total_logs": total_logs,
        "total_missions_completed": total_missions,
        "total_goals_completed": total_goals,
        "total_xp_earned": progress.xp,
        "total_achievements": total_achievements,
        "average_daily_xp": round(average_daily_xp, 1),
        "most_improved_area": most_improved_area,
        "weakest_area": weakest_area,
        "best_streak": progress.best_streak,
        "current_streak": progress.current_streak,
        "trend": trend,
        "activity_last_7_days": recent_logs,
        "activity_previous_7_days": previous_logs
    }


def _get_empty_stats() -> dict:
    """Retorna stats vazias para novo usuário"""
    return {
        "total_days_active": 0,
        "total_logs": 0,
        "total_missions_completed": 0,
        "total_goals_completed": 0,
        "total_xp_earned": 0,
        "total_achievements": 0,
        "average_daily_xp": 0.0,
        "most_improved_area": None,
        "weakest_area": None,
        "best_streak": 0,
        "current_streak": 0,
        "trend": "stable",
        "activity_last_7_days": 0,
        "activity_previous_7_days": 0
    }


def get_activity_history(db: Session, user_id: int, days: int = 30) -> list:
    """
    Retorna histórico de atividade dos últimos N dias.

    Args:
        db: Session do banco
        user_id: ID do usuário
        days: Número de dias para retornar

    Returns:
        Lista de dicts com data e contagem de logs
    """
    today = datetime.now().date()
    start_date = today - timedelta(days=days)

    # Agrupa logs por data
    logs_by_date = db.query(
        MetricLog.log_date,
        func.count(MetricLog.id).label('count')
    ).filter(
        MetricLog.user_id == user_id,
        MetricLog.log_date >= start_date
    ).group_by(MetricLog.log_date).all()

    # Converte para dict
    activity_dict = {log.log_date: log.count for log in logs_by_date}

    # Preenche dias sem atividade
    result = []
    current_date = start_date

    while current_date <= today:
        result.append({
            "date": current_date.isoformat(),
            "activity_count": activity_dict.get(current_date, 0)
        })
        current_date += timedelta(days=1)

    return result



