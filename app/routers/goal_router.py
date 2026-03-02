from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date, datetime

from app.core.database import SessionLocal
from app.models.goal import Goal
from app.schemas.goal_schema import (
    GoalCreate, 
    GoalUpdate, 
    GoalResponse, 
    GoalListResponse, 
    GoalProgressUpdate,
    GoalStatistics
)
from app.services.progress_engine import process_user_progress
from sqlalchemy import func

router = APIRouter(prefix="/goals", tags=["goals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==================== CREATE ====================

@router.post("/", response_model=GoalResponse)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova meta para o usuário.
    
    Categorias: financial, weight, habit, career, health, relationships, learning, other
    """
    new_goal = Goal(
        user_id=goal.user_id,
        title=goal.title,
        description=goal.description,
        category=goal.category,
        status="not_started",
        target_value=goal.target_value,
        priority=goal.priority,
        due_date=goal.due_date,
        reward_xp=goal.reward_xp,
        completed=False
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


# ==================== READ ====================

@router.get("/{user_id}", response_model=list[GoalListResponse])
def list_goals(
    user_id: int, 
    status: str = Query(None),  # filter by status
    category: str = Query(None),  # filter by category
    db: Session = Depends(get_db)
):
    """
    Lista todas as metas do usuário.
    
    Pode filtrar por status e/ou categoria.
    """
    query = db.query(Goal).filter(Goal.user_id == user_id)
    
    if status:
        query = query.filter(Goal.status == status)
    if category:
        query = query.filter(Goal.category == category)
    
    goals = query.order_by(Goal.priority.desc(), Goal.created_at.desc()).all()
    return goals


@router.get("/{user_id}/{goal_id}", response_model=GoalResponse)
def get_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    """Obtém detalhes de uma meta específica."""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    
    return goal


@router.get("/{user_id}/stats/overview")
def get_goals_statistics(user_id: int, db: Session = Depends(get_db)):
    """Retorna estatísticas de metas do usuário."""
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    
    if not goals:
        return {
            "total_goals": 0,
            "completed_goals": 0,
            "in_progress_goals": 0,
            "completion_rate": 0,
            "total_xp_earned": 0,
            "total_xp_potential": sum(g.reward_xp for g in goals),
            "goals_by_category": {}
        }
    
    completed = len([g for g in goals if g.status == "completed"])
    in_progress = len([g for g in goals if g.status == "in_progress"])
    
    # Contar por categoria
    categories = {}
    for goal in goals:
        cat = goal.category
        if cat not in categories:
            categories[cat] = 0
        categories[cat] += 1
    
    # XP ganho (goals completadas)
    xp_earned = sum(g.reward_xp for g in goals if g.status == "completed")
    
    return {
        "total_goals": len(goals),
        "completed_goals": completed,
        "in_progress_goals": in_progress,
        "completion_rate": round((completed / len(goals) * 100) if goals else 0, 1),
        "total_xp_earned": xp_earned,
        "total_xp_potential": sum(g.reward_xp for g in goals),
        "goals_by_category": categories
    }


# ==================== UPDATE ====================

@router.put("/{user_id}/{goal_id}", response_model=GoalResponse)
def update_goal(
    user_id: int, 
    goal_id: int, 
    goal_update: GoalUpdate, 
    db: Session = Depends(get_db)
):
    """Atualiza uma meta existente."""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    
    # Atualizar campos fornecidos
    update_data = goal_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    goal.updated_at = date.today()
    db.commit()
    db.refresh(goal)
    return goal


@router.patch("/{user_id}/{goal_id}/progress", response_model=GoalResponse)
def update_goal_progress(
    user_id: int, 
    goal_id: int, 
    progress_update: GoalProgressUpdate, 
    db: Session = Depends(get_db)
):
    """Atualiza apenas o progresso da meta."""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    
    goal.current_progress = progress_update.current_progress
    if progress_update.status:
        goal.status = progress_update.status
    
    goal.updated_at = date.today()
    db.commit()
    db.refresh(goal)
    return goal


# ==================== COMPLETE ====================

@router.post("/{user_id}/{goal_id}/complete")
def complete_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    """
    Marca uma meta como completada.
    
    - Atualiza status
    - Registra data de conclusão
    - Processa XP reward
    - Dispara engine de progresso
    """
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user_id
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")

    if goal.status == "completed":
        raise HTTPException(status_code=400, detail="Meta já foi concluída")

    goal.status = "completed"
    goal.completed = True  # Compatibilidade
    goal.completed_at = date.today()
    goal.updated_at = date.today()
    
    # Se não atingiu 100%, atualizar para 100%
    if goal.target_value and goal.current_progress < goal.target_value:
        goal.current_progress = goal.target_value
    
    db.commit()

    # Processar XP via engine centralizada
    progress_result = process_user_progress(db, user_id)

    return {
        "status": "completed",
        "goal_id": goal_id,
        "goal_title": goal.title,
        "xp_reward": goal.reward_xp,
        "user_level": progress_result.get("level"),
        "user_xp": progress_result.get("xp"),
        "message": f"🎉 Meta completada! +{goal.reward_xp} XP"
    }


@router.post("/{user_id}/{goal_id}/abandon")
def abandon_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    """Marca uma meta como abandonada."""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user_id
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")

    if goal.status == "completed":
        raise HTTPException(status_code=400, detail="Não é possível abandonar meta completada")

    goal.status = "abandoned"
    goal.updated_at = date.today()
    db.commit()

    return {
        "status": "abandoned",
        "goal_id": goal_id,
        "goal_title": goal.title,
        "message": "Meta marcada como abandonada"
    }


# ==================== DELETE ====================

@router.delete("/{user_id}/{goal_id}")
def delete_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    """Deleta uma meta (apenas se not_started)."""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user_id
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")

    # Não permitir deletar goals já iniciadas ou completadas
    if goal.status != "not_started":
        raise HTTPException(
            status_code=400, 
            detail="Só é possível deletar metas que ainda não foram iniciadas"
        )

    db.delete(goal)
    db.commit()

    return {
        "status": "deleted",
        "goal_id": goal_id,
        "message": "Meta deletada com sucesso"
    }
