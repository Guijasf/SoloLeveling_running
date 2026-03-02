"""
Script para criar dados de teste
"""
from app.core.database import SessionLocal
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.daily_mission import DailyMission
from datetime import datetime, date

db = SessionLocal()

try:
    # Get or create user
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        print("User 1 not found")
        exit(1)
    
    print(f"✅ User encontrado: {user.name}")
    
    # Get or create progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == 1).first()
    if not progress:
        progress = UserProgress(user_id=1, level=5, xp=3500)
        db.add(progress)
        db.commit()
        print("✅ UserProgress criado")
    else:
        progress.level = 5
        progress.xp = 3500
        progress.current_streak = 7
        db.commit()
        print(f"✅ UserProgress atualizado - Level: {progress.level}, XP: {progress.xp}")
    
    # Clear existing missions
    existing = db.query(DailyMission).filter(DailyMission.user_id == 1).all()
    for m in existing:
        db.delete(m)
    db.commit()
    
    # Create test missions
    missions_data = [
        {"title": "Estudar por 2h", "xp_reward": 200, "completed": True},
        {"title": "Exercício matinal", "xp_reward": 150, "completed": True},
        {"title": "Meditar 10min", "xp_reward": 100, "completed": True},
        {"title": "Ler 30min", "xp_reward": 120, "completed": False},
        {"title": "Ligar para amigo", "xp_reward": 80, "completed": False},
    ]
    
    for mission_data in missions_data:
        mission = DailyMission(
            user_id=1,
            title=mission_data["title"],
            xp_reward=mission_data["xp_reward"],
            completed=mission_data["completed"],
            mission_date=date.today(),
            difficulty="medium"
        )
        db.add(mission)
    
    db.commit()
    print(f"✅ {len(missions_data)} missões criadas")
    
    print("\n✅ Dados de teste criados com sucesso!")
    
except Exception as e:
    print(f"❌ Erro: {e}")
    db.rollback()
finally:
    db.close()
