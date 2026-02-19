from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.models.metric_log import MetricLog
from app.models.metric_type import MetricType
from app.models.life_area import LifeArea


def calculate_area_scores(db: Session, user_id: int):
    """
    Calcula scores de cada área da vida do usuário.
    Retorna formato padronizado: [{"area": "Health", "score": 8.5}, ...]
    """
    one_week_ago = date.today() - timedelta(days=7)

    results = (
        db.query(
            LifeArea.name.label("area_name"),
            func.avg(MetricLog.value).label("avg_value")
        )
        .join(MetricType, MetricType.life_area_id == LifeArea.id)
        .join(MetricLog, MetricLog.metric_type_id == MetricType.id)
        .filter(MetricLog.user_id == user_id)
        .filter(MetricLog.log_date >= one_week_ago)
        .group_by(LifeArea.id, LifeArea.name)
        .all()
    )

    area_scores = []
    for r in results:
        score = min((r.avg_value or 0), 10)
        area_scores.append({
            "area": r.area_name,
            "score": round(score, 2)
        })

    return area_scores


def calculate_life_score(area_scores):

    if not area_scores:
        return 0

    total = sum(a["score"] for a in area_scores)
    life_score = (total / len(area_scores)) * 10

    return round(life_score, 2)


def find_weakest_area(area_scores):
    """
    Encontra a área com menor score.
    Retorna: {"area": "Health", "score": 5.0}
    """
    if not area_scores:
        return None

    return min(area_scores, key=lambda x: x["score"])

def calculate_trend(db, user_id):

    today = date.today()

    last_week = today - timedelta(days=7)
    previous_week = today - timedelta(days=14)

    current_avg = (
        db.query(func.avg(MetricLog.value))
        .filter(MetricLog.user_id == user_id)
        .filter(MetricLog.log_date >= last_week)
        .scalar()
    )

    previous_avg = (
        db.query(func.avg(MetricLog.value))
        .filter(MetricLog.user_id == user_id)
        .filter(MetricLog.log_date >= previous_week)
        .filter(MetricLog.log_date < last_week)
        .scalar()
    )

    current_avg = current_avg or 0
    previous_avg = previous_avg or 0

    if current_avg > previous_avg:
        return "growing"
    elif current_avg < previous_avg:
        return "declining"
    else:
        return "stable"
