# Constantes para o sistema de XP
LEVEL_XP_BASE = 100  # XP necessário para level 1


def calculate_xp_for_level(level: int) -> int:
    """
    Calcula XP total acumulado necessário para atingir um nível.
    Cresce quadraticamente: 100, 400, 900, 1600, ...
    """
    return LEVEL_XP_BASE * (level ** 2)


def xp_until_next_level(current_xp: int, current_level: int) -> int:
    """
    Calcula quanto XP ainda é necessário para o próximo nível.
    """
    xp_needed_for_next = calculate_xp_for_level(current_level + 1)
    return max(0, xp_needed_for_next - current_xp)
