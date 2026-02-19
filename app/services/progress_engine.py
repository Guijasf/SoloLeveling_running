from sqlalchemy.orm import Session
from app.models.user_progress import UserProgress
from app.services.scoring_service import (
    calculate_area_scores,
    calculate_life_score,
    find_weakest_area,
    calculate_trend
)
from app.services.level_system import calculate_level
from app.services.rank_service import calculate_rank
from app.services.streak_service import update_streak
from app.services.mission_service import process_missions, generate_dynamic_missions
from app.services.focus_service import get_current_focus
from app.services.achievement_service import check_and_unlock_achievements
from app.services.difficulty_adapter import get_adaptive_difficulty


def process_user_progress(db: Session, user_id: int, new_log=None):
    """
    Engine central que processa todo o progresso do usuário.

    É a ÚNICA responsável por:
    - Calcular scores por área
    - Atualizar XP
    - Calcular e atualizar Level
    - Calcular e atualizar Rank
    - Processar multiplicadores de foco
    - Atualizar streak

    Args:
        db: Sessão do banco
        user_id: ID do usuário
        new_log: Novo log de métrica (para contexto de cálculo de XP)

    Returns:
        Dict com progresso atualizado
    """

    # 1️⃣ Calcular scores por área (novo formato padronizado)
    area_scores = calculate_area_scores(db, user_id)
    life_score = calculate_life_score(area_scores)

    # 2️⃣ Buscar ou criar progresso do usuário
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).first()

    if not progress:
        progress = UserProgress(user_id=user_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)

    # 3️⃣ Atualizar streak
    update_streak(progress)

    # 4️⃣ Calcular XP baseado no novo log (COM multiplicador de foco)
    xp_gain = _calculate_xp_gain(new_log, area_scores, progress, db, user_id)
    progress.xp += xp_gain

    # 5️⃣ Processar missões (pode dar XP extra)
    mission_bonus = process_missions(db, user_id)
    progress.xp += mission_bonus

    # 6️⃣ Gerar missões dinâmicas para hoje (se não existem)
    _update_dynamic_missions(db, user_id, area_scores, progress)

    # 7️⃣ Calcular e atualizar Level e Rank APENAS aqui
    progress.level = calculate_level(progress.xp)
    progress.rank = calculate_rank(life_score)

    # 8️⃣ Verificar achievements desbloqueados (NOVO - CAMADA 2 PASSO 3)
    new_achievements = check_and_unlock_achievements(db, user_id, progress)
    achievement_bonus = sum(ach.xp_reward for ach in new_achievements)
    progress.xp += achievement_bonus

    # 9️⃣ Calcular adaptabilidade de dificuldade (NOVO - CAMADA 2 PASSO 4)
    difficulty_info = get_adaptive_difficulty(db, user_id, progress)

    db.commit()

    return {
        "area_scores": area_scores,
        "life_score": life_score,
        "xp_gain": xp_gain,
        "mission_bonus": mission_bonus,
        "achievement_bonus": achievement_bonus,
        "new_achievements": [{"title": ach.title, "icon": ach.icon, "xp": ach.xp_reward} for ach in new_achievements],
        "difficulty_info": difficulty_info,
        "xp": progress.xp,
        "level": progress.level,
        "rank": progress.rank,
        "streak": progress.current_streak if hasattr(progress, 'current_streak') else 0
    }


def _calculate_xp_gain(new_log, area_scores, progress, db=None, user_id=None):
    """
    Calcula XP ganho baseado no novo log e scores atuais.

    Aplica multiplicador de foco semanal se o usuário está focando em uma área.
    """
    if not new_log:
        # Se não houver novo log, usa score médio
        if area_scores:
            avg_score = sum(a["score"] for a in area_scores) / len(area_scores)
            return max(1, int(avg_score * 0.3))
        return 5

    # XP baseado no valor do log (0-10) multiplicado por 3
    log_value = new_log.value if hasattr(new_log, 'value') else 0
    base_xp = max(1, int(log_value * 3))

    # ✨ NOVO: Aplicar multiplicador de foco semanal (1.5x)
    multiplier = 1.0
    if db and user_id and hasattr(new_log, 'metric_type_id'):
        try:
            from app.models.metric_type import MetricType
            from app.models.life_area import LifeArea
            from app.services.focus_service import get_xp_multiplier

            # Descobrir a área deste log
            metric = db.query(MetricType).filter(
                MetricType.id == new_log.metric_type_id
            ).first()

            if metric:
                area = db.query(LifeArea).filter(
                    LifeArea.id == metric.life_area_id
                ).first()

                if area:
                    # Obter multiplicador (1.5 se focando, 1.0 senão)
                    multiplier = get_xp_multiplier(db, user_id, area.name)
        except:
            multiplier = 1.0

    final_xp = int(base_xp * multiplier)
    return final_xp


def _update_dynamic_missions(db: Session, user_id: int, area_scores: list, progress):
    """
    Gera missões dinâmicas para o dia se não existem.

    Baseado em contexto real:
    - Score da área mais fraca
    - Tendência (growing/declining/stable)
    - Foco semanal (se existe)
    - Rank do usuário
    """
    from datetime import date
    from app.models.daily_mission import DailyMission

    today = date.today()

    # Verificar se já existem missões de hoje
    existing_missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date == today
    ).first()

    if existing_missions:
        return  # Já existem, não regenerar

    # Coletar contexto
    weakest = find_weakest_area(area_scores)
    if not weakest:
        return

    trend = calculate_trend(db, user_id)
    focus = get_current_focus(db, user_id)
    is_focused = focus and focus.area_name == weakest["area"]

    context = {
        "area": weakest["area"],
        "score": weakest["score"],
        "trend": trend,
        "rank": progress.rank,
        "streak": progress.current_streak if hasattr(progress, 'current_streak') else 0,
        "is_focused": is_focused,
        "reason": "focus" if is_focused else ("weak" if weakest["score"] < 5 else "normal")
    }

    # Gerar missões dinâmicas
    generate_dynamic_missions(db, user_id, context)
