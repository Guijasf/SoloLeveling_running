from sqlalchemy.orm import Session
from app.models.achievement import Achievement
from datetime import datetime


# Definição de todos os achievements disponíveis
ACHIEVEMENT_DEFINITIONS = {
    # ⚡ STREAK MILESTONES
    "streak_3": {
        "title": "🔥 Consistência",
        "description": "Mantenha um streak de 3 dias consecutivos",
        "icon": "🔥",
        "xp_reward": 50,
        "condition": lambda progress: progress.current_streak >= 3
    },
    "streak_7": {
        "title": "🔥 Uma Semana Completa",
        "description": "Mantenha um streak de 7 dias consecutivos",
        "icon": "🔥",
        "xp_reward": 100,
        "condition": lambda progress: progress.current_streak >= 7
    },
    "streak_14": {
        "title": "🔥🔥 Duas Semanas!",
        "description": "Mantenha um streak de 14 dias consecutivos",
        "icon": "🔥",
        "xp_reward": 200,
        "condition": lambda progress: progress.current_streak >= 14
    },
    "streak_30": {
        "title": "👑 Lendário",
        "description": "Mantenha um streak de 30 dias consecutivos",
        "icon": "👑",
        "xp_reward": 500,
        "condition": lambda progress: progress.current_streak >= 30
    },

    # 💎 XP MILESTONES
    "xp_100": {
        "title": "💎 Primeiros Passos",
        "description": "Acumule 100 XP",
        "icon": "💎",
        "xp_reward": 25,
        "condition": lambda progress: progress.xp >= 100
    },
    "xp_500": {
        "title": "💎 Ganhador",
        "description": "Acumule 500 XP",
        "icon": "💎",
        "xp_reward": 50,
        "condition": lambda progress: progress.xp >= 500
    },
    "xp_1000": {
        "title": "💎 Coletor de XP",
        "description": "Acumule 1.000 XP",
        "icon": "💎",
        "xp_reward": 100,
        "condition": lambda progress: progress.xp >= 1000
    },
    "xp_5000": {
        "title": "💎💎 Mestre do XP",
        "description": "Acumule 5.000 XP",
        "icon": "💎",
        "xp_reward": 300,
        "condition": lambda progress: progress.xp >= 5000
    },
    "xp_10000": {
        "title": "💎💎💎 Lenda Viva",
        "description": "Acumule 10.000 XP",
        "icon": "💎",
        "xp_reward": 500,
        "condition": lambda progress: progress.xp >= 10000
    },

    # ⬆️ RANK UPGRADES
    "rank_d": {
        "title": "⬆️ Rank D",
        "description": "Suba para Rank D",
        "icon": "⬆️",
        "xp_reward": 50,
        "condition": lambda progress: progress.rank in ["D", "C", "B", "A", "S"]
    },
    "rank_c": {
        "title": "⬆️⬆️ Rank C",
        "description": "Suba para Rank C",
        "icon": "⬆️",
        "xp_reward": 100,
        "condition": lambda progress: progress.rank in ["C", "B", "A", "S"]
    },
    "rank_b": {
        "title": "⬆️⬆️⬆️ Rank B",
        "description": "Suba para Rank B",
        "icon": "⬆️",
        "xp_reward": 200,
        "condition": lambda progress: progress.rank in ["B", "A", "S"]
    },
    "rank_a": {
        "title": "⬆️⬆️⬆️⬆️ Rank A",
        "description": "Suba para Rank A",
        "icon": "⬆️",
        "xp_reward": 300,
        "condition": lambda progress: progress.rank in ["A", "S"]
    },
    "rank_s": {
        "title": "👑 Rank S",
        "description": "Suba para Rank S",
        "icon": "👑",
        "xp_reward": 500,
        "condition": lambda progress: progress.rank == "S"
    },

    # 📈 LEVEL MILESTONES
    "level_5": {
        "title": "📈 Nível 5",
        "description": "Alcance Nível 5",
        "icon": "📈",
        "xp_reward": 100,
        "condition": lambda progress: progress.level >= 5
    },
    "level_10": {
        "title": "📈 Nível 10",
        "description": "Alcance Nível 10",
        "icon": "📈",
        "xp_reward": 200,
        "condition": lambda progress: progress.level >= 10
    },
    "level_20": {
        "title": "📈 Nível 20",
        "description": "Alcance Nível 20",
        "icon": "📈",
        "xp_reward": 300,
        "condition": lambda progress: progress.level >= 20
    },

    # 🎯 SPECIAL
    "first_login": {
        "title": "🎮 Bem-vindo!",
        "description": "Faça seu primeiro login",
        "icon": "🎮",
        "xp_reward": 10,
        "condition": lambda progress: progress.xp >= 1  # Simples, só precisa ter progresso
    },
}


def check_and_unlock_achievements(db: Session, user_id: int, progress) -> list:
    """
    Verifica se usuário desbloqueou novos achievements.

    Args:
        db: Session do banco
        user_id: ID do usuário
        progress: Objeto UserProgress com dados atuais

    Returns:
        Lista de achievements recém desbloqueados
    """
    new_achievements = []

    # Verificar cada achievement
    for achievement_type, definition in ACHIEVEMENT_DEFINITIONS.items():
        # Verificar se condição foi atingida
        try:
            condition_met = definition["condition"](progress)
        except:
            condition_met = False

        if not condition_met:
            continue  # Condição não atendida, pular

        # Verificar se já foi desbloqueado
        existing = db.query(Achievement).filter(
            Achievement.user_id == user_id,
            Achievement.achievement_type == achievement_type
        ).first()

        if existing:
            continue  # Já desbloqueado, pular

        # Desbloquear novo achievement!
        ach = _unlock_achievement(db, user_id, achievement_type, definition)
        if ach:
            new_achievements.append(ach)

    return new_achievements


def _unlock_achievement(db: Session, user_id: int, achievement_type: str, definition: dict) -> Achievement:
    """
    Desbloqueia um achievement novo.

    Args:
        db: Session do banco
        user_id: ID do usuário
        achievement_type: Tipo de achievement
        definition: Definição do achievement

    Returns:
        Objeto Achievement criado
    """
    achievement = Achievement(
        user_id=user_id,
        achievement_type=achievement_type,
        title=definition["title"],
        description=definition["description"],
        icon=definition["icon"],
        xp_reward=definition["xp_reward"],
        unlocked_at=datetime.utcnow()
    )

    db.add(achievement)
    db.commit()
    db.refresh(achievement)

    return achievement


def get_user_achievements(db: Session, user_id: int) -> list:
    """
    Retorna todos os achievements do usuário.

    Args:
        db: Session do banco
        user_id: ID do usuário

    Returns:
        Lista de Achievement objects
    """
    return db.query(Achievement).filter(
        Achievement.user_id == user_id
    ).order_by(Achievement.unlocked_at.desc()).all()


def count_achievements(db: Session, user_id: int) -> int:
    """
    Conta quantos achievements o usuário tem.

    Args:
        db: Session do banco
        user_id: ID do usuário

    Returns:
        Número de achievements
    """
    return db.query(Achievement).filter(
        Achievement.user_id == user_id
    ).count()


def total_achievement_xp(db: Session, user_id: int) -> int:
    """
    Calcula XP total ganho com achievements.

    Args:
        db: Session do banco
        user_id: ID do usuário

    Returns:
        XP total de achievements
    """
    achievements = db.query(Achievement).filter(
        Achievement.user_id == user_id
    ).all()

    return sum(ach.xp_reward for ach in achievements)

