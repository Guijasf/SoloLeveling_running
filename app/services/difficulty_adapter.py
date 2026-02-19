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

