"""
History Router - Histórico de eventos do usuário
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from app.core.dependencies import get_current_user, get_db
from app.models.user import User

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/{user_id}")
async def get_user_history(
    user_id: int,
    period: Optional[str] = "all",  # all, week, month
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📜 Retorna histórico de eventos do usuário

    Eventos incluem:
    - Level Up
    - Rank Up
    - Conquistas desbloqueadas
    - Missões completadas importantes
    - Marcos de streak
    - XP ganho
    - Metas completadas
    """

    # Validação: só pode acessar próprio histórico
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode acessar seu próprio histórico"
        )

    # Definir período
    cutoff_date = None
    if period == "week":
        cutoff_date = datetime.now() - timedelta(days=7)
    elif period == "month":
        cutoff_date = datetime.now() - timedelta(days=30)

    # Por enquanto, retornar dados simulados
    # TODO: Implementar tabela user_events no banco
    events = [
        {
            "id": 1,
            "user_id": user_id,
            "event_type": "level_up",
            "title": "Subiu de Nível!",
            "description": "Você alcançou o nível 5!",
            "metadata": {"new_level": 5, "xp_earned": 150},
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "user_id": user_id,
            "event_type": "achievement",
            "title": "Conquista Desbloqueada",
            "description": "Primeira Conquista - Complete sua primeira missão",
            "metadata": {},
            "created_at": (datetime.now() - timedelta(days=1)).isoformat()
        },
        {
            "id": 3,
            "user_id": user_id,
            "event_type": "streak_milestone",
            "title": "Sequência de 7 Dias",
            "description": "Você manteve sua sequência por 7 dias consecutivos!",
            "metadata": {"streak": 7},
            "created_at": (datetime.now() - timedelta(days=2)).isoformat()
        }
    ]

    # Filtrar por período
    if cutoff_date:
        events = [e for e in events if datetime.fromisoformat(e["created_at"]) >= cutoff_date]

    return {
        "user_id": user_id,
        "period": period,
        "total_events": len(events),
        "history": events
    }

