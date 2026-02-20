"""
Insights Router - Endpoint para análise de performance e insights
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.services.difficulty_adapter import get_performance_insights

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/{user_id}")
async def get_user_insights(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📊 Retorna insights sobre performance do usuário

    Inclui:
    - Taxa de conclusão
    - Velocidade de XP
    - Recomendações de dificuldade
    - Mensagens motivacionais
    - Próximos passos
    """

    # Validação: só pode acessar próprios insights
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode acessar seus próprios insights"
        )

    # Buscar insights
    insights_data = get_performance_insights(db, user_id)

    return {
        "user_id": user_id,
        "insights": insights_data
    }

