def generate_weekly_focus(weakest_area: dict):
    if not weakest_area:
        return {
            "area": None,
            "message": "Nenhuma área encontrada para gerar foco semanal."
        }

    area_name = weakest_area.get("name")

    focus_messages = {
        "Health": "Priorize atividades físicas leves e alimentação equilibrada esta semana.",
        "Career": "Dedique tempo ao aprendizado de novas habilidades profissionais.",
        "Finance": "Revise seus gastos e planeje economias esta semana.",
        "Relationships": "Entre em contato com pessoas importantes e fortaleça vínculos.",
        "Mind": "Pratique leitura, meditação ou atividades de desenvolvimento mental."
    }

    message = focus_messages.get(
        area_name,
        "Concentre-se em melhorar esta área com pequenas ações diárias."
    )

    return {
        "area": area_name,
        "message": message
    }
