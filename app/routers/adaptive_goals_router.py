"""
Router para endpoint de metas adaptáveis
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.core.dependencies import get_db
from app.models.goal_adaptive import AdaptiveGoal, GoalRegistry, GoalType
from app.schemas.adaptive_goal_schema import (
    AdaptiveGoalCreate,
    AdaptiveGoalUpdate,
    AdaptiveGoalResponse,
    GoalRegistryCreate,
    GoalRegistryResponse,
    GoalProgressResponse,
    BulkProgressResponse
)
from app.services.goal_calculator import CalculatorFactory
from app.services.gamification_service import GamificationService


router = APIRouter(prefix="/api/goals", tags=["goals"])


# ====== METAS (CRUD) ======

@router.post("/", response_model=AdaptiveGoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_data: AdaptiveGoalCreate,
    user_id: int = 1,  # TODO: Get from token
    db: Session = Depends(get_db)
):
    """Cria nova meta adaptável"""
    
    if goal_data.end_date <= goal_data.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_date deve ser posterior a start_date"
        )
    
    new_goal = AdaptiveGoal(
        user_id=user_id,
        title=goal_data.title,
        description=goal_data.description,
        emoji=goal_data.emoji,
        type=goal_data.type,
        unit=goal_data.unit,
        target_value=goal_data.target_value,
        start_date=goal_data.start_date,
        end_date=goal_data.end_date,
        period=goal_data.period,
        priority=goal_data.priority,
        xp_reward=goal_data.xp_reward
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    return new_goal


@router.get("/{goal_id}", response_model=GoalProgressResponse)
async def get_goal_progress(
    goal_id: int,
    user_id: int = 1,  # TODO: Get from token
    db: Session = Depends(get_db)
):
    """Retorna meta com progresso calculado"""
    
    goal = db.query(AdaptiveGoal).filter(
        AdaptiveGoal.id == goal_id,
        AdaptiveGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    registries = goal.registries
    calculator = CalculatorFactory.get_calculator(goal.type)
    progress = calculator.calculate_progress(goal, registries)
    achievements = GamificationService.get_achievements(goal, progress, registries)
    xp_earned = sum(
        GamificationService.calculate_xp(goal, r, progress) 
        for r in registries
    )
    
    return GoalProgressResponse(
        goal=goal,
        progress=progress,
        achievements=achievements,
        xp_earned=xp_earned
    )


@router.get("/", response_model=BulkProgressResponse)
async def get_all_goals(
    user_id: int = 1,  # TODO: Get from token
    status_filter: str = None,
    db: Session = Depends(get_db)
):
    """Retorna todas as metas do usuário com progresso calculado"""
    
    query = db.query(AdaptiveGoal).filter(AdaptiveGoal.user_id == user_id)
    
    if status_filter:
        query = query.filter(AdaptiveGoal.status == status_filter)
    
    goals = query.all()
    
    goal_progress_list = []
    total_xp = 0
    
    for goal in goals:
        registries = goal.registries
        calculator = CalculatorFactory.get_calculator(goal.type)
        progress = calculator.calculate_progress(goal, registries)
        achievements = GamificationService.get_achievements(goal, progress, registries)
        xp_earned = sum(
            GamificationService.calculate_xp(goal, r, progress) 
            for r in registries
        )
        total_xp += xp_earned
        
        goal_progress_list.append(GoalProgressResponse(
            goal=goal,
            progress=progress,
            achievements=achievements,
            xp_earned=xp_earned
        ))
    
    active_count = len([g for g in goals if g.status.value == "active"])
    completed_count = len([g for g in goals if g.status.value == "completed"])
    
    level_info = GamificationService.calculate_level(total_xp)
    
    return BulkProgressResponse(
        goals=goal_progress_list,
        total_xp=total_xp,
        current_level=level_info['level'],
        next_level_xp=level_info['xp_for_next_level'],
        active_count=active_count,
        completed_count=completed_count
    )


@router.patch("/{goal_id}", response_model=AdaptiveGoalResponse)
async def update_goal(
    goal_id: int,
    goal_update: AdaptiveGoalUpdate,
    user_id: int = 1,  # TODO: Get from token
    db: Session = Depends(get_db)
):
    """Atualiza uma meta"""
    
    goal = db.query(AdaptiveGoal).filter(
        AdaptiveGoal.id == goal_id,
        AdaptiveGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    # Atualiza apenas campos fornecidos
    update_data = goal_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    db.commit()
    db.refresh(goal)
    
    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: int,
    user_id: int = 1,  # TODO: Get from token
    db: Session = Depends(get_db)
):
    """Deleta uma meta"""
    
    goal = db.query(AdaptiveGoal).filter(
        AdaptiveGoal.id == goal_id,
        AdaptiveGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    db.delete(goal)
    db.commit()


# ====== REGISTOS DE PROGRESSO ======

@router.post("/{goal_id}/registries", response_model=GoalRegistryResponse, status_code=status.HTTP_201_CREATED)
async def register_progress(
    goal_id: int,
    registry_data: GoalRegistryCreate,
    user_id: int = 1,  # TODO: Get from token
    db: Session = Depends(get_db)
):
    """Registra progresso em uma meta"""
    
    goal = db.query(AdaptiveGoal).filter(
        AdaptiveGoal.id == goal_id,
        AdaptiveGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    # Verifica se já existe registro para essa data
    existing = db.query(GoalRegistry).filter(
        GoalRegistry.goal_id == goal_id,
        GoalRegistry.date == registry_data.date
    ).first()
    
    if existing:
        # Atualiza registro existente
        existing.value = registry_data.value
        existing.note = registry_data.note
        db.commit()
        db.refresh(existing)
        return existing
    
    # Cria novo registro
    new_registry = GoalRegistry(
        goal_id=goal_id,
        date=registry_data.date,
        value=registry_data.value,
        note=registry_data.note
    )
    
    db.add(new_registry)
    db.commit()
    db.refresh(new_registry)
    
    return new_registry


@router.get("/{goal_id}/registries", response_model=List[GoalRegistryResponse])
async def get_goal_registries(
    goal_id: int,
    user_id: int = 1,  # TODO: Get from token
    db: Session = Depends(get_db)
):
    """Retorna todos os registos de uma meta"""
    
    goal = db.query(AdaptiveGoal).filter(
        AdaptiveGoal.id == goal_id,
        AdaptiveGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    registries = db.query(GoalRegistry).filter(
        GoalRegistry.goal_id == goal_id
    ).all()
    
    return registries


@router.delete("/{goal_id}/registries/{registry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_registry(
    goal_id: int,
    registry_id: int,
    user_id: int = 1,  # TODO: Get from token
    db: Session = Depends(get_db)
):
    """Deleta um registro de progresso"""
    
    goal = db.query(AdaptiveGoal).filter(
        AdaptiveGoal.id == goal_id,
        AdaptiveGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    registry = db.query(GoalRegistry).filter(
        GoalRegistry.id == registry_id,
        GoalRegistry.goal_id == goal_id
    ).first()
    
    if not registry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro não encontrado"
        )
    
    db.delete(registry)
    db.commit()
