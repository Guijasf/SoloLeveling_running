"""
Notification Router - Sistema de notificações
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.core.dependencies import get_current_user, get_db
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/{user_id}")
async def get_user_notifications(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    🔔 Retorna notificações do usuário
    """

    # Validação
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode acessar suas próprias notificações"
        )

    # Por enquanto, retornar dados simulados
    # TODO: Implementar tabela notifications no banco
    notifications = [
        {
            "id": 1,
            "user_id": user_id,
            "type": "level_up",
            "title": "Você subiu de nível!",
            "message": "Parabéns! Agora você está no nível 5.",
            "read": False,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "user_id": user_id,
            "type": "new_mission",
            "title": "Novas missões disponíveis",
            "message": "3 novas missões foram geradas para você hoje!",
            "read": True,
            "created_at": datetime.now().isoformat()
        }
    ]

    return {
        "user_id": user_id,
        "total": len(notifications),
        "unread_count": len([n for n in notifications if not n["read"]]),
        "notifications": notifications
    }


@router.put("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ✅ Marca notificação como lida
    """

    # TODO: Implementar lógica real
    return {
        "notification_id": notification_id,
        "read": True,
        "message": "Notificação marcada como lida"
    }


@router.put("/{user_id}/read-all")
async def mark_all_notifications_as_read(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ✅ Marca todas as notificações como lidas
    """

    # Validação
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode marcar suas próprias notificações"
        )

    # TODO: Implementar lógica real
    return {
        "user_id": user_id,
        "marked_count": 5,
        "message": "Todas as notificações marcadas como lidas"
    }

