from app.models.daily_mission import DailyMission
from datetime import date


def generate_daily_missions(db, user_id, weakest_area):

    missions = []

    area_name = weakest_area["area"]

    templates = [
        f"Dedique 30 minutos para melhorar {area_name}",
        f"Estude algo novo em {area_name}",
        f"Execute uma ação prática em {area_name}"
    ]

    for title in templates:
        mission = DailyMission(
            user_id=user_id,
            title=title,
            xp_reward=50,
            mission_date=date.today()
        )

        db.add(mission)
        missions.append(mission)

    db.commit()

    return missions
