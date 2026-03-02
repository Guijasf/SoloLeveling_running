"""
Public API routes - sem autenticação (para testes e dashboard)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.user import User
from app.models.daily_mission import DailyMission
from app.models.user_progress import UserProgress
from app.schemas.user_schema import UserDashboardResponse

router = APIRouter(prefix="/public", tags=["public"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/users/{user_id}")
async def get_user_public(user_id: int, db: Session = Depends(get_db)):
    """
    Get user data with progress (PUBLIC - sem autenticação)
    Usado por dashboard para exibir dados do jogador
    """
    from fastapi import HTTPException, status
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Get progress data
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).first()
    
    if not progress:
        progress = UserProgress(user_id=user_id, level=1, xp=0)
    
    # Calculate XP to next level (e.g., 2700 XP per level)
    next_level_xp = (progress.level * 1000) + 1700
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "level": progress.level,
        "username": user.name,
        "xp": progress.xp,
        "current_xp": progress.xp % 2700,  # XP in current level
        "next_level_xp": next_level_xp
    }


@router.get("/missions/{user_id}")
async def get_missions_public(user_id: int, db: Session = Depends(get_db)):
    """
    Get user's daily missions (PUBLIC - sem autenticação)
    """
    missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id
    ).all()
    
    # Emoji mapping for different mission types
    emoji_map = {
        "estudar": "📚", "estudo": "📚",
        "exercício": "🏃", "exercicio": "🏃", "academia": "💪",
        "meditar": "🧘", "meditação": "🧘",
        "ler": "📖", "leitura": "📖",
        "amigo": "👥", "social": "👥",
        "trabalho": "💼", "reunião": "👔",
        "código": "💻", "programar": "💻",
        "dormir": "😴", "sono": "😴",
    }
    
    def get_emoji(title):
        title_lower = title.lower()
        for keyword, emoji in emoji_map.items():
            if keyword in title_lower:
                return emoji
        return "📝"
    
    return {
        "user_id": user_id,
        "missions": [
            {
                "id": m.id,
                "title": m.title,
                "description": m.description,
                "completed": m.completed,
                "emoji": get_emoji(m.title),
                "xp_reward": m.xp_reward,
                "difficulty": m.difficulty
            }
            for m in missions
        ]
    }


@router.get("/scoring/{user_id}")
async def get_scoring_public(user_id: int, db: Session = Depends(get_db)):
    """
    Get user scoring by area (PUBLIC - sem autenticação)
    Para renderizar o gráfico de pentágono
    """
    from app.models.life_area import LifeArea
    from app.models.goal import Goal
    
    # Default areas if none exist
    default_areas = {
        "Saúde": 65,
        "Trabalho": 58,
        "Relacionamentos": 72,
        "Finanças": 45,
        "Hobbies": 80
    }
    
    areas = db.query(LifeArea).all()
    
    area_scores = {}
    if areas:
        for area in areas:
            # Calcula score baseado em goals completados
            goals = db.query(Goal).filter(
                Goal.user_id == user_id,
                Goal.life_area_id == area.id
            ).all()
            
            if goals:
                completed = sum(1 for g in goals if g.completed)
                score = (completed / len(goals)) * 100
            else:
                score = 50  # Score padrão se nenhum goal
            
            area_scores[area.name] = score
    else:
        # Se nenhuma área cadastrada, usar áreas padrão
        area_scores = default_areas
    
    return {
        "user_id": user_id,
        "area_scores": area_scores
    }


@router.get("/streak/{user_id}")
async def get_streak_public(user_id: int, db: Session = Depends(get_db)):
    """
    Get user streak (PUBLIC - sem autenticação)
    """
    from app.models.user_progress import UserProgress
    
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).first()
    
    if not progress:
        return {
            "user_id": user_id,
            "current_streak": 0,
            "multiplier": 1.0,
            "best_streak": 0
        }
    
    return {
        "user_id": user_id,
        "current_streak": progress.current_streak or 0,
        "multiplier": progress.streak_multiplier or 1.0,
        "best_streak": progress.best_streak or 0
    }
