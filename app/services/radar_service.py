def build_radar_data(area_scores: list, life_score: float):
    labels = []
    data = []

    for area in area_scores:
        labels.append(area.get("name"))
        data.append(area.get("score"))

    return {
        "labels": labels,
        "datasets": [
            {
                "label": "Life Areas",
                "data": data
            },
            {
                "label": "Life Score",
                "data": [life_score] * len(labels)
            }
        ]
    }
