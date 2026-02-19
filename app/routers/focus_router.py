from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.focus_service import (
    generate_weekly_focus,
    get_current_focus,
    generate_weekly_focus_message
)
from app.schemas.user_focus_schema import UserFocusResponse

router = APIRouter(prefix="/focus", tags=["focus"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_id}", response_model=UserFocusResponse)
def get_weekly_focus(user_id: int, db: Session = Depends(get_db)):
    """
    Obtém ou gera o foco semanal atual do usuário.

    - Se não existe foco ativo, gera automaticamente
    - Retorna foco com multiplicador de XP
    - Indica quantos dias faltam
    """
    # Gerar ou obter foco (gera se não existe)
    focus = generate_weekly_focus(db, user_id)

    if not focus:
        raise HTTPException(
            status_code=404,
            detail="Não foi possível gerar foco. Nenhuma área encontrada."
        )

    return focus


@router.get("/{user_id}/current", response_model=dict)
def get_current_weekly_focus(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna o foco semanal atual COM mensagem motivacional.
    """
    focus = get_current_focus(db, user_id)

    if not focus:
        return {
            "active": False,
            "message": "Nenhum foco semanal ativo. Um novo será gerado próxima atualização."
        }

    return {
        "active": True,
        "area": focus.area_name,
        "starts": focus.focus_start_date.isoformat(),
        "ends": focus.focus_end_date.isoformat(),
        "days_remaining": focus.days_remaining(),
        "xp_multiplier": focus.xp_multiplier,
        "initial_score": focus.score_when_focused,
        "improvement": focus.improvement,
        "logs_completed": focus.logs_completed,
        "message": generate_weekly_focus_message({
            "area": focus.area_name,
            "score": focus.score_when_focused
        })["message"]
    }


@router.get("/{user_id}/info")
def get_focus_info(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna informações sobre foco semanal (versão simplificada).
    Útil para dashboard ou resumo rápido.
    """
    focus = get_current_focus(db, user_id)

    if not focus:
        return {
            "status": "no_focus",
            "message": "Sem foco ativo no momento"
        }

    return {
        "status": "active",
        "area": focus.area_name,
        "multiplier": focus.xp_multiplier,
        "days_left": focus.days_remaining(),
        "score_at_start": focus.score_when_focused
    }

