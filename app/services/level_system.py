def calculate_level(xp: int) -> int:
    return int((xp / 100) ** 0.5) + 1


def get_level_info(level: int) -> dict:
    """
    Retorna informações sobre um level específico.
    Inclui XP necessário para atingir o próximo nível.
    """
    # Fórmula inversa: xp = ((level - 1) ^ 2) * 100
    current_level_xp = ((level - 1) ** 2) * 100
    next_level_xp = (level ** 2) * 100

    xp_required = next_level_xp - current_level_xp

    return {
        "level": level,
        "xp_required": xp_required,
        "total_xp_to_level": next_level_xp,
        "title": get_level_title(level)
    }


def get_level_title(level: int) -> str:
    """
    Retorna título baseado no level.
    """
    if level < 5:
        return "Discípulo"
    elif level < 10:
        return "Aprendiz"
    elif level < 20:
        return "Guerreiro"
    elif level < 30:
        return "Estrategista"
    elif level < 50:
        return "Mestre"
    elif level < 75:
        return "Lenda"
    else:
        return "Arquiteto da Vida"
