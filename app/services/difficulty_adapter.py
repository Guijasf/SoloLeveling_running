from sqlalchemy.orm import Session
from app.models.user_progress import UserProgress
from datetime import datetime, timedelta


class DifficultyAdapter:
    """
    Sistema que adapta dificuldade baseado em performance do usuário.

    Analisa:
    - Velocidade de progresso (XP/dia)
    - Consistência (streak)
    - Performance (score médio)
    - Engagement (missões completadas)

    Ajusta:
    - Dificuldade das missões (0.8x - 1.2x)
    - XP necessário para level
    - Quantidade de missões
    - Recompensas
    """

    def __init__(self, progress: UserProgress):
        self.progress = progress
        self.xp_current = progress.xp
        self.level_current = progress.level
        self.streak_current = progress.current_streak if hasattr(progress, 'current_streak') else 0

    def calculate_xp_velocity(self, days_active: int = 7) -> float:
        """
        Calcula XP por dia (velocidade de progresso).

        Args:
            days_active: Quantos dias o usuário está ativo

        Returns:
            XP por dia (ex: 100 XP/dia)
        """
        if days_active <= 0:
            return 0
        return self.xp_current / days_active

    def calculate_consistency_score(self) -> float:
        """
        Calcula score de consistência baseado em streak.

        Returns:
            0-100, onde 100 é perfeitamente consistente
        """
        # Streak de 30 dias = 100% consistência
        consistency = min(self.streak_current / 30.0 * 100, 100)
        return consistency

    def calculate_performance_rating(self, avg_score: float = 5.0) -> str:
        """
        Classifica performance do usuário.

        Args:
            avg_score: Score médio das áreas (0-10)

        Returns:
            "poor", "slow", "balanced", "fast", "very_fast"
        """
        velocity = self.calculate_xp_velocity(7)  # XP por dia na última semana

        # Calibração:
        # < 50 XP/dia = fraco
        # 50-100 XP/dia = lento
        # 100-200 XP/dia = balanceado
        # 200-300 XP/dia = rápido
        # > 300 XP/dia = muito rápido

        if velocity < 50:
            return "poor"
        elif velocity < 100:
            return "slow"
        elif velocity < 200:
            return "balanced"
        elif velocity < 300:
            return "fast"
        else:
            return "very_fast"

    def get_difficulty_adjustment(self) -> dict:
        """
        Retorna ajustes de dificuldade baseado em performance.

        Returns:
            {
                "mission_difficulty_multiplier": 0.8-1.2,
                "xp_required_multiplier": 0.8-1.2,
                "mission_count_adjustment": -1 to +1,
                "xp_reward_multiplier": 0.8-1.2,
                "reason": "string explicativo"
            }
        """
        rating = self.calculate_performance_rating()
        consistency = self.calculate_consistency_score()

        # Ajustes baseados em performance
        if rating == "very_fast":
            return {
                "mission_difficulty_multiplier": 1.2,
                "xp_required_multiplier": 1.2,
                "mission_count_adjustment": 0,
                "xp_reward_multiplier": 0.9,
                "reason": "Evolução muito rápida! Aumentando desafio."
            }
        elif rating == "fast":
            return {
                "mission_difficulty_multiplier": 1.15,
                "xp_required_multiplier": 1.1,
                "mission_count_adjustment": 0,
                "xp_reward_multiplier": 0.95,
                "reason": "Bom progresso! Aumentando um pouco o desafio."
            }
        elif rating == "balanced":
            return {
                "mission_difficulty_multiplier": 1.0,
                "xp_required_multiplier": 1.0,
                "mission_count_adjustment": 0,
                "xp_reward_multiplier": 1.0,
                "reason": "Perfeito! Mantendo ritmo balanceado."
            }
        elif rating == "slow":
            return {
                "mission_difficulty_multiplier": 0.85,
                "xp_required_multiplier": 0.9,
                "mission_count_adjustment": -1,
                "xp_reward_multiplier": 1.1,
                "reason": "Progresso lento. Simplificando um pouco."
            }
        else:  # poor
            return {
                "mission_difficulty_multiplier": 0.8,
                "xp_required_multiplier": 0.8,
                "mission_count_adjustment": -2,
                "xp_reward_multiplier": 1.2,
                "reason": "Progresso muito fraco. Reduzindo dificuldade significativamente."
            }

    def get_feedback_message(self) -> str:
        """
        Retorna mensagem motivacional baseada em performance.

        Returns:
            String com feedback personalizado
        """
        rating = self.calculate_performance_rating()
        consistency = self.calculate_consistency_score()

        if rating == "very_fast":
            return "🚀 Você está em fogo! Sua evolução é impressionante. Aumentei o desafio para te manter engajado!"
        elif rating == "fast":
            return "⚡ Excelente progresso! Você está no caminho certo. Aumentei levemente o desafio."
        elif rating == "balanced":
            return "✅ Você está no ritmo perfeito! Continue assim."
        elif rating == "slow":
            return "💪 Você está melhorando! Simplifiquei um pouco as missões para você ganhar confiança."
        else:  # poor
            return "🤝 Sem pressa! Vou tornar as coisas mais fáceis para você ganhar momentum. Você consegue!"

    def should_trigger_boost(self) -> bool:
        """
        Verifica se usuário mereceria um 'boost' de motivação.

        Returns:
            True se streak >= 7, False senão
        """
        return self.streak_current >= 7

    def get_boost_multiplier(self) -> float:
        """
        Retorna multiplicador de boost para usuário consistente.

        Streak de 7+ dias = +10% XP
        Streak de 14+ dias = +15% XP
        Streak de 30+ dias = +20% XP

        Returns:
            Multiplicador (1.0 - 1.2)
        """
        if self.streak_current >= 30:
            return 1.2
        elif self.streak_current >= 14:
            return 1.15
        elif self.streak_current >= 7:
            return 1.1
        else:
            return 1.0


def get_adaptive_difficulty(db: Session, user_id: int, progress: UserProgress) -> dict:
    """
    Função helper que retorna ajustes de dificuldade para um usuário.

    Args:
        db: Session do banco
        user_id: ID do usuário
        progress: Objeto UserProgress

    Returns:
        Dict com todos os ajustes e feedback
    """
    adapter = DifficultyAdapter(progress)

    adjustment = adapter.get_difficulty_adjustment()
    feedback = adapter.get_feedback_message()
    boost_multiplier = adapter.get_boost_multiplier()

    return {
        "difficulty_adjustment": adjustment,
        "feedback": feedback,
        "boost_multiplier": boost_multiplier,
        "performance_rating": adapter.calculate_performance_rating(),
        "consistency_score": adapter.calculate_consistency_score(),
        "xp_velocity": adapter.calculate_xp_velocity(7)
    }


# Funções standalone para uso direto

def analyze_user_performance(db: Session, user_id: int) -> dict:
    """
    Analisa performance do usuário nos últimos 7 dias

    Retorna:
    - completion_rate: % de missões completadas
    - average_difficulty: dificuldade média das missões
    - streak: dias consecutivos
    - xp_velocity: XP ganho por dia (média)
    - recommendation: "increase", "maintain", "decrease"
    """
    from app.models.daily_mission import DailyMission
    from app.models.user_progress import UserProgress
    from datetime import datetime, timedelta

    # Buscar missões dos últimos 7 dias
    seven_days_ago = datetime.now() - timedelta(days=7)

    missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date >= seven_days_ago.date()
    ).all()

    if not missions:
        return {
            "completion_rate": 0,
            "average_difficulty": 1,
            "streak": 0,
            "xp_velocity": 0,
            "recommendation": "maintain",
            "level": "beginner"
        }

    # Calcular métricas
    total_missions = len(missions)
    completed_missions = sum(1 for m in missions if m.completed)
    completion_rate = (completed_missions / total_missions) * 100 if total_missions > 0 else 0

    difficulties = [m.difficulty or 1 for m in missions]
    average_difficulty = sum(difficulties) / len(difficulties) if difficulties else 1

    total_xp = sum(m.xp_reward for m in missions if m.completed)
    xp_velocity = total_xp / 7  # XP por dia

    # Buscar streak do usuário
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    streak = progress.streak if progress else 0

    # Determinar recomendação
    recommendation = "maintain"
    level = "intermediate"

    if completion_rate >= 85 and average_difficulty >= 2:
        recommendation = "increase"
        level = "advanced"
    elif completion_rate >= 90 and xp_velocity > 150:
        recommendation = "increase"
        level = "expert"
    elif completion_rate < 50:
        recommendation = "decrease"
        level = "beginner"
    elif completion_rate < 70 and average_difficulty > 2:
        recommendation = "decrease"
        level = "struggling"

    return {
        "completion_rate": round(completion_rate, 2),
        "average_difficulty": round(average_difficulty, 2),
        "streak": streak,
        "xp_velocity": round(xp_velocity, 2),
        "total_missions": total_missions,
        "completed_missions": completed_missions,
        "recommendation": recommendation,
        "level": level
    }


def calculate_adaptive_difficulty(db: Session, user_id: int, base_difficulty: int = 2) -> int:
    """
    Calcula dificuldade adaptativa baseada no desempenho

    Args:
        base_difficulty: dificuldade base (1-5)

    Returns:
        Dificuldade ajustada (1-5)
    """
    performance = analyze_user_performance(db, user_id)

    # Ajustar baseado na recomendação
    if performance["recommendation"] == "increase":
        return min(base_difficulty + 1, 5)
    elif performance["recommendation"] == "decrease":
        return max(base_difficulty - 1, 1)
    else:
        return base_difficulty


def calculate_adaptive_xp(db: Session, user_id: int, base_xp: int, difficulty: int) -> int:
    """
    Calcula XP adaptativo baseado no desempenho
    """
    performance = analyze_user_performance(db, user_id)

    # XP base por dificuldade
    xp = base_xp * difficulty

    # Bônus se streak alto
    if performance["streak"] >= 7:
        xp = int(xp * 1.2)
    elif performance["streak"] >= 30:
        xp = int(xp * 1.5)

    # Se usuário está com completion rate baixo, dar mais XP para motivar
    if performance["completion_rate"] < 50:
        xp = int(xp * 1.3)

    return xp


def get_performance_insights(db: Session, user_id: int) -> dict:
    """
    Retorna insights sobre performance do usuário
    """
    performance = analyze_user_performance(db, user_id)

    insights = []

    # Insight sobre completion rate
    if performance["completion_rate"] >= 90:
        insights.append({
            "type": "success",
            "icon": "🎉",
            "message": "Você está arrasando! Taxa de conclusão excepcional.",
            "action": "Experimente desafios maiores!"
        })
    elif performance["completion_rate"] >= 70:
        insights.append({
            "type": "info",
            "icon": "👍",
            "message": "Bom trabalho! Você está progredindo consistentemente.",
            "action": "Continue assim!"
        })
    elif performance["completion_rate"] < 50:
        insights.append({
            "type": "warning",
            "icon": "💪",
            "message": "Parece que as missões estão desafiadoras.",
            "action": "Vamos ajustar a dificuldade para você!"
        })

    # Insight sobre streak
    if performance["streak"] >= 30:
        insights.append({
            "type": "success",
            "icon": "🔥",
            "message": f"Sequência incrível de {performance['streak']} dias!",
            "action": "Você é imparável!"
        })
    elif performance["streak"] >= 7:
        insights.append({
            "type": "info",
            "icon": "⭐",
            "message": f"{performance['streak']} dias de sequência! Não pare agora.",
            "action": "Mantenha o ritmo!"
        })

    # Insight sobre XP velocity
    if performance["xp_velocity"] > 200:
        insights.append({
            "type": "success",
            "icon": "🚀",
            "message": f"Velocidade de {performance['xp_velocity']:.0f} XP/dia! Você está voando!",
            "action": "Continue nesse ritmo!"
        })

    return {
        "performance": performance,
        "insights": insights,
        "next_difficulty_recommendation": calculate_adaptive_difficulty(db, user_id)
    }
