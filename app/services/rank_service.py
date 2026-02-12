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