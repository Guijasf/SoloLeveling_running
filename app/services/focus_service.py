from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.models.user_focus import UserFocus
from app.services.scoring_service import calculate_area_scores, find_weakest_area


def generate_weekly_focus(db: Session, user_id: int):
    """
    Gera automaticamente um foco semanal para o usuário.

    - Detecta área mais fraca
    - Verifica se já existe foco ativo
    - Cria novo foco se necessário

    Args:
        db: Session do banco
        user_id: ID do usuário

    Returns:
        UserFocus ou None
    """
    # 1. Calcular scores e encontrar área mais fraca
    area_scores = calculate_area_scores(db, user_id)
    weakest = find_weakest_area(area_scores)

    if not weakest:
        return None

    # 2. Verificar se existe foco ativo
    today = date.today()
    active_focus = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.focus_end_date >= today
    ).first()

    # 3. Se foco ativo é para a mesma área, manter
    if active_focus and active_focus.area_name == weakest["area"]:
        return active_focus

    # 4. Se existe foco anterior mas para área diferente, finalizar
    if active_focus and active_focus.area_name != weakest["area"]:
        active_focus.focus_end_date = today - timedelta(days=1)
        db.commit()

    # 5. Criar novo foco para próxima semana
    new_focus = UserFocus(
        user_id=user_id,
        area_name=weakest["area"],
        score_when_focused=weakest["score"],
        focus_start_date=today,
        focus_end_date=today + timedelta(days=7),
        xp_multiplier=1.5  # 50% bonus
    )
    db.add(new_focus)
    db.commit()
    db.refresh(new_focus)

    return new_focus


def get_xp_multiplier(db: Session, user_id: int, area: str) -> float:
    """
    Retorna o multiplicador de XP para a área.

    Se o usuário está focando nesta área, retorna 1.5.
    Senão, retorna 1.0 (sem modificação).

    Args:
        db: Session do banco
        user_id: ID do usuário
        area: Nome da área (ex: "Health")

    Returns:
        float: Multiplicador (1.0 ou 1.5)
    """
    today = date.today()
    focus = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.area_name == area,
        UserFocus.focus_end_date >= today
    ).first()

    return focus.xp_multiplier if focus else 1.0


def get_current_focus(db: Session, user_id: int) -> UserFocus:
    """
    Retorna o foco semanal ativo do usuário.

    Args:
        db: Session do banco
        user_id: ID do usuário

    Returns:
        UserFocus ou None
    """
    today = date.today()
    return db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.focus_end_date >= today
    ).first()


def generate_weekly_focus_message(weakest_area: dict):
    """
    Gera mensagem motivacional para a área em foco.

    Args:
        weakest_area: Dict com {"area": "...", "score": ...}

    Returns:
        Dict com {"area": "...", "message": "..."}
    """
    if not weakest_area:
        return {
            "area": None,
            "message": "Nenhuma área encontrada para gerar foco semanal."
        }

    area_name = weakest_area.get("area")

    focus_messages = {
        "Health": "🏃 Priorize atividades físicas leves e alimentação equilibrada esta semana.",
        "Career": "💼 Dedique tempo ao aprendizado de novas habilidades profissionais.",
        "Finance": "💰 Revise seus gastos e planeje economias esta semana.",
        "Relationships": "🤝 Entre em contato com pessoas importantes e fortaleça vínculos.",
        "Mind": "🧠 Pratique leitura, meditação ou atividades de desenvolvimento mental."
    }

    message = focus_messages.get(
        area_name,
        "🎯 Concentre-se em melhorar esta área com pequenas ações diárias."
    )

    return {
        "area": area_name,
        "message": message
    }


