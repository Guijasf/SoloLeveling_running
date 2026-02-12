def calculate_rank(xp: int):
    if xp < 1000:
        return "Bronze"
    elif xp < 5000:
        return "Silver"
    elif xp < 15000:
        return "Gold"
    elif xp < 30000:
        return "Diamond"
    else:
        return "Shadow Monarch"