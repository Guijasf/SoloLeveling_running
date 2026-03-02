from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import SessionLocal
from app.models.daily_mission import DailyMission
from app.schemas.daily_mission_schema import DailyMissionResponse
from app.services.mission_service import generate_dynamic_missions
from app.services.scoring_service import calculate_area_scores, find_weakest_area, calculate_trend
from app.services.focus_service import get_current_focus


router = APIRouter(prefix="/missions", tags=["missions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_id}", response_model=list[DailyMissionResponse])
def get_today_missions(user_id: int, db: Session = Depends(get_db)):
    """
    Obtém ou gera as missões dinâmicas de hoje.

    Missões são geradas automaticamente baseadas em:
    - Score da área mais fraca
    - Tendência (crescendo/caindo)
    - Foco semanal (se existe)
    - Rank do usuário
    """
    today = date.today()

    # Verificar se existem missões de hoje
    missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date == today
    ).all()

    if missions:
        return missions

    # Se não existem, gerar novas (dinâmicas)
    from app.models.user_progress import UserProgress

    area_scores = calculate_area_scores(db, user_id)
    weakest = find_weakest_area(area_scores)

    if not weakest:
        return []

    # Coletar contexto
    trend = calculate_trend(db, user_id)
    focus = get_current_focus(db, user_id)
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()

    is_focused = focus and focus.area_name == weakest["area"]

    context = {
        "area": weakest["area"],
        "score": weakest["score"],
        "trend": trend,
        "rank": progress.rank if progress else "E",
        "streak": progress.current_streak if progress and hasattr(progress, 'current_streak') else 0,
        "is_focused": is_focused,
        "reason": "focus" if is_focused else ("weak" if weakest["score"] < 5 else "normal")
    }

    # Gerar missões dinâmicas
    missions = generate_dynamic_missions(db, user_id, context)

    return missions


@router.post("/{mission_id}/complete")
def complete_mission(mission_id: int, db: Session = Depends(get_db)):
    """Marca missão como completa"""
    from datetime import date
    mission = db.query(DailyMission).filter(DailyMission.id == mission_id).first()

    if not mission:
        return {"error": "Missão não encontrada"}

    if mission.completed:
        return {"error": "Missão já foi completada"}

    mission.completed = True
    mission.completed_at = date.today()
    db.commit()

    return {
        "status": "completed",
        "mission_id": mission_id,
        "xp_reward": mission.xp_reward,
        "title": mission.title,
        "message": f"✅ Missão completada! +{mission.xp_reward} XP"
    }


@router.get("/{user_id}/process-today")
def process_today_missions(user_id: int, db: Session = Depends(get_db)):
    """
    Processa todas as missões completadas de HOJE.
    
    Retorna:
    - Total XP ganho
    - Bônus de streak
    - Taxa de conclusão
    - Detalhes de cada missão
    """
    from app.services.mission_service import process_missions
    
    result = process_missions(db, user_id)
    
    return {
        "user_id": user_id,
        "date": date.today(),
        **result
    }


@router.post("/generate-smart/{user_id}")
def generate_smart_missions_endpoint(user_id: int, db: Session = Depends(get_db)):
    """
    🧠 Gera missões INTELIGENTES usando difficulty adapter

    Usa:
    - Análise de performance dos últimos 7 dias
    - Dificuldade adaptativa
    - XP adaptativo
    - Multiplicador de foco
    - Priorização de áreas fracas
    """
    from app.services.mission_service import generate_smart_missions
    from app.services.scoring_service import calculate_area_scores

    # Calcular scores das áreas
    area_scores = calculate_area_scores(db, user_id)

    if not area_scores:
        return {
            "message": "Usuário sem dados suficientes para gerar missões",
            "missions": []
        }

    # Gerar missões inteligentes
    missions = generate_smart_missions(db, user_id, area_scores)

    return {
        "message": f"✅ {len(missions)} missões inteligentes geradas!",
        "missions": missions,
        "total": len(missions)
    }

