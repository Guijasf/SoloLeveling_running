def build_radar_data(area_scores: list, life_score: float):
    """
    Constrói dados para visualização em radar chart.
    Recebe area_scores no formato: [{"area": "Health", "score": 8.5}, ...]
    """
    labels = []
    data = []

    for area in area_scores:
        labels.append(area.get("area", "Unknown"))
        data.append(area.get("score", 0))

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
