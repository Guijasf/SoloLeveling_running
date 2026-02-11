from sqlalchemy.orm import Session
from models.user import User
from services.level_system import calculate_level

def add_xp(db, user_id: int, amount: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    user.xp += amount

    while user.xp >= 100:
        user.xp -= 100
        user.level += 1

    db.commit()
    db.refresh(user)

    return user
