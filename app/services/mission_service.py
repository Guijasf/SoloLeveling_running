from app.models.daily_mission import DailyMission
from datetime import date
from sqlalchemy.orm import Session
from app.services.difficulty_adapter import (
    analyze_user_performance,
    calculate_adaptive_difficulty,
    calculate_adaptive_xp
)
from app.services.focus_service import get_xp_multiplier
import random


# Templates de missões por área e dificuldade
MISSION_TEMPLATES = {
    "Health": {
        "easy": [
            {"title": "🚶 Caminhe 15 minutos", "description": "Uma caminhada leve hoje", "target": 3.0},
            {"title": "💧 Beba 2 litros de água", "description": "Mantenha-se hidratado", "target": 2.5},
            {"title": "🛌 Durma 7+ horas", "description": "Uma boa noite de sono", "target": 2.0},
        ],
        "medium": [
            {"title": "🏃 40 minutos de exercício", "description": "Atividade moderada", "target": 5.0},
            {"title": "🥗 Prepare refeição saudável", "description": "Cozinhe algo nutritivo", "target": 4.5},
            {"title": "🧘 Alongamento 20min", "description": "Flexibilidade e bem-estar", "target": 5.0},
        ],
        "hard": [
            {"title": "💪 60min de exercício intenso", "description": "Desafiador e gratificante", "target": 8.0},
            {"title": "📋 Crie plano alimentar", "description": "Planeje nutrição semanal", "target": 8.5},
            {"title": "🏋️ Treine novo exercício", "description": "Expanda seus limites", "target": 9.0},
        ]
    },
    "Career": {
        "easy": [
            {"title": "📚 Leia 20min sobre sua área", "description": "Aprendizado contínuo", "target": 3.0},
            {"title": "💼 Pratique uma skill básica", "description": "Reforce o fundamenta", "target": 2.5},
            {"title": "📝 Tire notas de trabalho", "description": "Organize aprendizados", "target": 2.0},
        ],
        "medium": [
            {"title": "🎓 Complete módulo online", "description": "1 hora de aprendizado", "target": 5.0},
            {"title": "🛠️ Trabalhe em projeto", "description": "Progresso prático", "target": 5.5},
            {"title": "🔍 Pesquise nova tecnologia", "description": "Esteja atualizado", "target": 5.0},
        ],
        "hard": [
            {"title": "🏆 Complete 2 cursos online", "description": "Aprofunde conhecimento", "target": 8.0},
            {"title": "🚀 Crie portfólio project", "description": "Demonstre habilidades", "target": 9.0},
            {"title": "💬 Apresente ideia profissional", "description": "Comunique expertise", "target": 8.5},
        ]
    },
    "Finance": {
        "easy": [
            {"title": "💰 Revise despesas do dia", "description": "Acompanhamento básico", "target": 2.5},
            {"title": "📊 Anote uma transação", "description": "Mantenha registros", "target": 2.0},
            {"title": "🏦 Verifique saldo", "description": "Fique atualizado", "target": 2.0},
        ],
        "medium": [
            {"title": "📈 Analise gastos semanais", "description": "Identifique padrões", "target": 5.0},
            {"title": "💳 Planeje orçamento", "description": "Controle financeiro", "target": 5.5},
            {"title": "🎯 Economize algo hoje", "description": "Alcance meta", "target": 5.0},
        ],
        "hard": [
            {"title": "📊 Crie plano financeiro", "description": "Estratégia de 6 meses", "target": 8.5},
            {"title": "📚 Estude investimento", "description": "Educação financeira", "target": 8.0},
            {"title": "🎯 Alcance meta mensal", "description": "Grande conquista", "target": 9.0},
        ]
    },
    "Relationships": {
        "easy": [
            {"title": "📞 Envie mensagem amigável", "description": "Mande um oi", "target": 2.5},
            {"title": "❤️ Pense em alguém especial", "description": "Gratidão", "target": 2.0},
            {"title": "😊 Sorria para alguém", "description": "Pequeno gesto", "target": 2.0},
        ],
        "medium": [
            {"title": "☕ Convide amigo para sair", "description": "Qualidade time", "target": 5.0},
            {"title": "🎁 Prepare surpresa", "description": "Mostre que se importa", "target": 5.5},
            {"title": "💬 Tenha conversa profunda", "description": "Conexão real", "target": 5.0},
        ],
        "hard": [
            {"title": "🤝 Resolva um conflito", "description": "Maturidade emocional", "target": 8.5},
            {"title": "👨‍👩‍👧‍👦 Organize encontro em grupo", "description": "Trabalho em comunidade", "target": 8.0},
            {"title": "💝 Expresse amor/gratidão", "description": "Vulnerabilidade positiva", "target": 9.0},
        ]
    },
    "Mind": {
        "easy": [
            {"title": "📖 Leia 20 minutos", "description": "Conhecimento leve", "target": 2.5},
            {"title": "🧘 Medite 10 minutos", "description": "Clareza mental", "target": 2.0},
            {"title": "✍️ Escreva no diário", "description": "Autoconhecimento", "target": 2.0},
        ],
        "medium": [
            {"title": "🎨 Crie algo", "description": "Expressão criativa", "target": 5.0},
            {"title": "🎬 Assista documentário", "description": "Inspire-se", "target": 5.0},
            {"title": "🧩 Resolva quebra-cabeça", "description": "Exercite a mente", "target": 5.5},
        ],
        "hard": [
            {"title": "📚 Leia livro importante", "description": "Profundidade", "target": 8.5},
            {"title": "🎓 Aprenda nova perspectiva", "description": "Transformação", "target": 8.0},
            {"title": "🌟 Realize epifania pessoal", "description": "Mudança de vida", "target": 9.0},
        ]
    }
}


def get_mission_difficulty(area_score: float, trend: str, rank: str) -> str:
    """
    Calcula dificuldade dinâmica baseada em contexto.

    Args:
        area_score: Score atual da área (0-10)
        trend: "growing", "stable", "declining"
        rank: Rank do usuário (E, D, C, B, A, S)

    Returns:
        "easy", "medium" ou "hard"
    """
    # Score muito baixo → easy
    if area_score < 3:
        return "easy"

    # Score baixo + crescendo → medium
    if area_score < 5:
        return "medium" if trend == "growing" else "easy"

    # Score médio → medium (ou hard se crescendo rápido)
    if area_score < 7:
        return "hard" if trend == "growing" else "medium"

    # Score alto → hard
    if area_score < 9:
        return "hard"

    # Score muito alto → hard (desafiar)
    return "hard"


def get_mission_count(is_focused: bool, score: float) -> int:
    """
    Calcula quantas missões gerar por dia.

    Se área está em foco, gera mais.
    Se score é muito baixo, gera menos (não desanimar).
    """
    if score <= 2.5:
        return 2  # Só 2, não quer desanimar

    if is_focused:
        return 5  # 5 missões para área em foco

    return 3  # 3 missões padrão


def generate_dynamic_missions(db: Session, user_id: int, context: dict):
    """
    Gera missões dinâmicas baseadas em contexto real do usuário.

    Context esperado:
    {
        "area": "Health",
        "score": 5.0,
        "trend": "declining",
        "rank": "C",
        "streak": 3,
        "is_focused": True,
        "reason": "focus"  # ou "weak", "trending"
    }
    """
    area = context.get("area", "Mind")
    score = context.get("score", 5.0)
    trend = context.get("trend", "stable")
    is_focused = context.get("is_focused", False)
    reason = context.get("reason", "normal")
    rank = context.get("rank", "C")

    # 1. Calcular dificuldade
    difficulty = get_mission_difficulty(score, trend, rank)

    # 2. Calcular quantidade
    mission_count = get_mission_count(is_focused, score)

    # 3. Obter templates da área
    templates = MISSION_TEMPLATES.get(area, MISSION_TEMPLATES["Mind"])
    difficulty_templates = templates.get(difficulty, templates.get("medium", []))

    # 4. Selecionar templates (até mission_count)
    selected_templates = difficulty_templates[:mission_count]

    # 5. Calcular XP reward baseado em dificuldade
    xp_multiplier = {"easy": 1.0, "medium": 1.5, "hard": 2.0}.get(difficulty, 1.0)
    base_xp = 50
    xp_reward = int(base_xp * xp_multiplier)

    # 6. Criar missões
    missions = []
    for template in selected_templates:
        mission = DailyMission(
            user_id=user_id,
            title=template["title"],
            description=template.get("description", ""),
            xp_reward=xp_reward,
            difficulty=difficulty,
            target_metric_value=template.get("target", 5.0),
            mission_date=date.today(),
            area_name=area,
            reason=reason
        )
        db.add(mission)
        missions.append(mission)

    db.commit()
    return missions


def process_missions(db: Session, user_id: int) -> int:
    """
    Processa missões completadas e retorna XP total ganho.

    Verifica se há missões completadas desde última chamada
    e retorna o bônus XP total.
    """
    # TODO: Implementar lógica de detecção de missões completadas
    # Por enquanto, retorna 0
    return 0


def generate_smart_missions(db: Session, user_id: int, area_scores: list) -> list:
    """
    🧠 Gera missões INTELIGENTES baseadas em:
    - Performance do usuário (difficulty adapter)
    - Área de foco semanal (xp multiplier)
    - Scores atuais (priorização)
    - Tendências (adaptação)

    Returns:
        Lista de DailyMission criadas
    """

    # 1. Analisar performance do usuário
    performance = analyze_user_performance(db, user_id)

    # 2. Determinar quantas missões gerar
    base_missions = 5
    if performance["recommendation"] == "decrease":
        total_missions = 3  # Menos missões para não sobrecarregar
    elif performance["recommendation"] == "increase":
        total_missions = 6  # Mais missões para desafiar
    else:
        total_missions = base_missions

    # 3. Priorizar áreas (mais fraca primeiro, depois foco)
    sorted_areas = sorted(area_scores, key=lambda x: x.get("current", 0))

    missions = []
    today = date.today()

    # Remover missões antigas do dia (se houver)
    db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date == today
    ).delete()

    # 4. Distribuir missões entre áreas
    for i in range(total_missions):
        # Escolher área (priorizando as mais fracas)
        area_index = i % len(sorted_areas)
        area_data = sorted_areas[area_index]
        area = area_data["area"]

        # 5. Calcular dificuldade adaptativa
        base_diff = 2 if i < 2 else 3  # Primeiras missões mais fáceis
        difficulty = calculate_adaptive_difficulty(db, user_id, base_diff)

        # 6. Escolher template baseado na dificuldade
        if difficulty <= 2:
            diff_key = "easy"
        elif difficulty <= 3:
            diff_key = "medium"
        else:
            diff_key = "hard"

        # Buscar template aleatório da área e dificuldade
        templates = MISSION_TEMPLATES.get(area, {}).get(diff_key, [])
        if not templates:
            continue

        template = random.choice(templates)

        # 7. Calcular XP adaptativo
        base_xp = 30
        xp_reward = calculate_adaptive_xp(db, user_id, base_xp, difficulty)

        # 8. Aplicar multiplicador de foco (se área está em foco)
        focus_multiplier = get_xp_multiplier(db, user_id, area)
        xp_reward = int(xp_reward * focus_multiplier)

        # 9. Criar missão
        reason = f"Performance: {performance['level']} | Dificuldade adaptativa: {difficulty}"

        mission = DailyMission(
            user_id=user_id,
            title=template["title"],
            description=template["description"],
            xp_reward=xp_reward,
            difficulty=difficulty,
            target_metric_value=template.get("target", 5.0),
            mission_date=today,
            area_name=area,
            reason=reason,
            completed=False
        )

        db.add(mission)
        missions.append(mission)

    db.commit()

    return missions
