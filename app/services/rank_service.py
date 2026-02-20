def calculate_rank(life_score: float):
    if life_score <= 20:
        return "E"
    elif life_score <= 40:
        return "D"
    elif life_score <= 60:
        return "C"
    elif life_score <= 75:
        return "B"
    elif life_score <= 90:
        return "A"
    else:
        return "S"


def get_rank_info(rank: str) -> dict:
    """
    Retorna informações detalhadas sobre um rank.
    """
    rank_data = {
        "E": {"name": "Novato", "emoji": "🌱", "min_score": 0, "max_score": 20},
        "D": {"name": "Iniciante", "emoji": "⚡", "min_score": 21, "max_score": 40},
        "C": {"name": "Competente", "emoji": "💪", "min_score": 41, "max_score": 60},
        "B": {"name": "Experiente", "emoji": "🔥", "min_score": 61, "max_score": 75},
        "A": {"name": "Elite", "emoji": "⭐", "min_score": 76, "max_score": 90},
        "S": {"name": "Lendário", "emoji": "👑", "min_score": 91, "max_score": 100},
    }

    return rank_data.get(rank, rank_data["E"])
