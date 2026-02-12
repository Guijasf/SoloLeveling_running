from datetime import date, timedelta


def update_streak(progress):

    today = date.today()

    if progress.last_activity_date is None:
        progress.current_streak = 1

    else:
        difference = (today - progress.last_activity_date).days

        if difference == 1:
            progress.current_streak += 1

        elif difference > 1:
            progress.current_streak = 1

    if progress.current_streak > progress.best_streak:
        progress.best_streak = progress.current_streak

    progress.last_activity_date = today
