LEVEL_XP = 1000

def add_xp(progress, amount):

    progress.xp += amount

    while progress.xp >= LEVEL_XP:
        progress.level += 1
        progress.xp -= LEVEL_XP

    return progress
