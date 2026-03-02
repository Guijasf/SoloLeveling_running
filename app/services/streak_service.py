from datetime import date, timedelta


def update_streak(progress):
    """
    Atualiza streak do usuário.
    
    Regras:
    - Se é 1º dia: streak = 1
    - Se log é dia após último: streak += 1
    - Se log é mais de 1 dia depois: streak = 1 (reset)
    - Se é mesmo dia: sem mudança
    """
    today = date.today()

    if progress.last_activity_date is None:
        # Primeiro log
        progress.current_streak = 1

    else:
        difference = (today - progress.last_activity_date).days

        if difference == 1:
            # Dia consecutivo - aumentar streak
            progress.current_streak += 1

        elif difference > 1:
            # Dias perdidos - resetar streak
            progress.current_streak = 1

        # Se difference == 0 (mesmo dia), sem mudança

    # Atualizar best_streak se necessário
    if progress.current_streak > progress.best_streak:
        progress.best_streak = progress.current_streak

    progress.last_activity_date = today


def get_streak_bonus_xp(streak: int) -> int:
    """
    Calcula XP bônus por streak.
    
    Recompensas por milestone:
    - 7 dias → 50 XP
    - 14 dias → 100 XP
    - 30 dias → 200 XP
    - 50 dias → 300 XP
    - 100 dias → 500 XP
    """
    if streak >= 100:
        return 500
    elif streak >= 50:
        return 300
    elif streak >= 30:
        return 200
    elif streak >= 14:
        return 100
    elif streak >= 7:
        return 50
    else:
        return 0


def get_streak_multiplier(streak: int) -> float:
    """
    Calcula multiplicador de XP por streak.
    
    O usuário ganha mais XP conforme a sequência aumenta:
    - 0-6 dias: 1.0x (base)
    - 7-13 dias: 1.1x
    - 14-29 dias: 1.2x
    - 30-49 dias: 1.3x
    - 50-99 dias: 1.4x
    - 100+ dias: 1.5x
    """
    if streak >= 100:
        return 1.5
    elif streak >= 50:
        return 1.4
    elif streak >= 30:
        return 1.3
    elif streak >= 14:
        return 1.2
    elif streak >= 7:
        return 1.1
    else:
        return 1.0


def get_streak_milestone_message(streak: int) -> str:
    """
    Retorna mensagem ao atingir milestone.
    """
    milestones = {
        7: "🥉 Bronze Streak! 7 dias consecutivos!",
        14: "🌟 14 dias! Você é consistente!",
        30: "🥈 Silver Streak! 30 dias de consistência!",
        50: "🔥 50 dias! Você é imparável!",
        100: "🏆 OURO PURO! 100 dias de sequência perfeita!",
    }
    
    for threshold in sorted(milestones.keys(), reverse=True):
        if streak == threshold:
            return milestones[threshold]
    
    return ""


def check_streak_milestone(progress) -> dict:
    """
    Verifica se streak atingiu um milestone.
    
    Retorna:
    {
        "milestone_reached": True/False,
        "streak": 30,
        "bonus_xp": 200,
        "message": "🥈 Silver Streak!",
        "emoji": "🥈"
    }
    """
    streak = progress.current_streak
    bonus = get_streak_bonus_xp(streak)
    message = get_streak_milestone_message(streak)
    
    if message:
        return {
            "milestone_reached": True,
            "streak": streak,
            "bonus_xp": bonus,
            "message": message,
            "emoji": message.split()[0] if message else ""
        }
    
    return {
        "milestone_reached": False,
        "streak": streak,
        "bonus_xp": 0,
        "message": "",
        "emoji": ""
    }


def format_streak_display(streak: int) -> dict:
    """
    Formata streak para exibição no frontend.
    """
    level_badge = "🥉"  # Padrão
    level_name = "Iniciante"
    
    if streak >= 100:
        level_badge = "💎"
        level_name = "Diamante"
    elif streak >= 50:
        level_badge = "🏆"
        level_name = "Ouro"
    elif streak >= 30:
        level_badge = "🥈"
        level_name = "Prata"
    elif streak >= 14:
        level_badge = "⭐"
        level_name = "Estrela"
    elif streak >= 7:
        level_badge = "🥉"
        level_name = "Bronze"
    
    multiplier = get_streak_multiplier(streak)
    
    return {
        "days": streak,
        "level": level_name,
        "badge": level_badge,
        "xp_multiplier": multiplier,
        "bonus_message": get_streak_milestone_message(streak)
    }
