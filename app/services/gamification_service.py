"""
Serviço de gamificação para metas
Calcula XP, achievements e tracking de progresso
"""

from typing import List, Dict, Any
from app.models.goal_adaptive import GoalRegistry, GoalType


class GamificationService:
    """Serviço para gerenciar XP, achievements e gamificação"""
    
    # Tabela de XP base por tipo
    XP_BASE = {
        GoalType.DAILY.value: 15,
        GoalType.FREQUENCY.value: 20,
        GoalType.CUMULATIVE.value: 25,
        GoalType.MILESTONE.value: 30
    }
    
    # Bônus de streak
    STREAK_BONUSES = {
        7: 10,      # 7 dias seguidos = 10 XP
        30: 25,     # 30 dias seguidos = 25 XP
        100: 50     # 100 dias seguidos = 50 XP
    }
    
    # Bônus de consistência
    CONSISTENCY_BONUSES = {
        50: 5,      # 50% de consistência = 5 XP
        75: 10,     # 75% de consistência = 10 XP
        95: 25      # 95% de consistência (disciplina de ferro) = 25 XP
    }
    
    @classmethod
    def calculate_xp(cls, goal, registry: GoalRegistry, progress: Dict[str, Any]) -> int:
        """
        Calcula XP para um registro de progresso
        
        Inclui:
        - XP base pelo tipo de meta
        - Bônus por exceder alvo
        - Bônus por streak
        - Bônus por consistência
        """
        xp = 10  # Mínimo base
        
        # Bônus por tipo
        xp += cls.XP_BASE.get(goal.type.value, 10)
        
        # Bônus por exceder alvo
        if registry.value > goal.target_value:
            excess = registry.value - goal.target_value
            excess_ratio = excess / goal.target_value if goal.target_value > 0 else 0
            xp += int(excess_ratio * 10)
        
        # Bônus por streak
        current_streak = progress.get('current_streak', 0)
        for threshold, bonus in sorted(cls.STREAK_BONUSES.items(), reverse=True):
            if current_streak >= threshold:
                xp += bonus
                break
        
        # Bônus por consistência
        consistency = progress.get('consistency', 0)
        for threshold, bonus in sorted(cls.CONSISTENCY_BONUSES.items(), reverse=True):
            if consistency >= threshold:
                xp += bonus
                break
        
        return xp
    
    @classmethod
    def get_achievements(cls, goal, progress: Dict[str, Any], registries: List[GoalRegistry]) -> List[Dict[str, Any]]:
        """
        Retorna lista de achievements desbloqueados
        
        Tipos de achievements:
        - Streaks: 7 dias, 30 dias, 100 dias
        - Conclusão: Meta completada
        - Consistência: 95%+ de consistência
        - Progresso: 50%, 75%, 100%
        """
        achievements = []
        
        # Achievement por streak
        current_streak = progress.get('current_streak', 0)
        
        if current_streak >= 7:
            achievements.append({
                'id': f'week_streak_{goal.id}',
                'name': '🔥 Uma Semana!',
                'description': 'Completou 7 dias consecutivos',
                'xp_bonus': 25,
                'type': 'streak'
            })
        
        if current_streak >= 30:
            achievements.append({
                'id': f'month_streak_{goal.id}',
                'name': '🌝 Um Mês!',
                'description': 'Completou 30 dias consecutivos',
                'xp_bonus': 50,
                'type': 'streak'
            })
        
        if current_streak >= 100:
            achievements.append({
                'id': f'century_streak_{goal.id}',
                'name': '💯 Um Século!',
                'description': 'Completou 100 dias consecutivos',
                'xp_bonus': 100,
                'type': 'streak'
            })
        
        # Achievement por conclusão
        if progress.get('progress', 0) >= 100:
            achievements.append({
                'id': f'goal_completed_{goal.id}',
                'name': '🏆 Meta Atingida!',
                'description': f'{goal.title} completada com sucesso',
                'xp_bonus': 200,
                'type': 'completion'
            })
        
        # Achievement por consistência
        consistency = progress.get('consistency', 0)
        
        if consistency >= 95:
            achievements.append({
                'id': f'iron_discipline_{goal.id}',
                'name': '⚡ Disciplina de Ferro',
                'description': '95%+ de consistência',
                'xp_bonus': 75,
                'type': 'consistency'
            })
        
        if consistency >= 75:
            achievements.append({
                'id': f'solid_commitment_{goal.id}',
                'name': '💪 Compromisso Sólido',
                'description': '75%+ de consistência',
                'xp_bonus': 35,
                'type': 'consistency'
            })
        
        # Achievement por progresso acumulado
        progress_value = progress.get('progress', 0)
        
        if progress_value >= 50:
            achievements.append({
                'id': f'halfway_{goal.id}',
                'name': '⛳ Na Metade!',
                'description': '50% de progresso atingido',
                'xp_bonus': 30,
                'type': 'progress'
            })
        
        if progress_value >= 75:
            achievements.append({
                'id': f'almost_there_{goal.id}',
                'name': '🎯 Quase Lá!',
                'description': '75% de progresso atingido',
                'xp_bonus': 50,
                'type': 'progress'
            })
        
        # Achievement por velocidade (para cumulative)
        if hasattr(progress, 'get') and 'days_remaining' in progress:
            days_remaining = progress.get('days_remaining', 0)
            days_used = progress.get('type_specific', {}).get('days_elapsed', 0)
            
            if days_remaining > 0 and days_used > 0:
                efficiency = (days_remaining / (days_used + days_remaining)) * 100
                
                if progress_value >= 100 and efficiency > 50:
                    achievements.append({
                        'id': f'speed_demon_{goal.id}',
                        'name': '⚡ Velocista!',
                        'description': 'Completou rápido demais',
                        'xp_bonus': 75,
                        'type': 'speed'
                    })
        
        # Achievement por melhor recorde (milestone)
        if hasattr(progress, 'get') and progress.get('improved'):
            previous_best = progress.get('improvement', 0)
            if previous_best > 0:
                achievements.append({
                    'id': f'new_personal_record_{goal.id}',
                    'name': '🚀 Novo Recorde Pessoal!',
                    'description': f'Novo melhor: +{previous_best}{goal.unit}',
                    'xp_bonus': 50,
                    'type': 'record'
                })
        
        return achievements
    
    @classmethod
    def calculate_level(cls, total_xp: int) -> Dict[str, Any]:
        """
        Calcula nível do usuário baseado em XP total
        Fórmula: próximo nível requer 1.5x do XP anterior
        """
        xp_per_level = cls._generate_xp_curve()
        
        for i, required_xp in enumerate(xp_per_level):
            if total_xp < required_xp:
                current_level = i
                prev_required = xp_per_level[i - 1] if i > 0 else 0
                current_required = required_xp
                
                xp_in_level = total_xp - prev_required
                xp_for_level = current_required - prev_required
                progress = (xp_in_level / xp_for_level) * 100 if xp_for_level > 0 else 0
                
                return {
                    'level': current_level,
                    'total_xp': total_xp,
                    'xp_progress': xp_in_level,
                    'xp_for_next_level': xp_for_level,
                    'progress_percentage': min(progress, 100)
                }
        
        return {
            'level': len(xp_per_level),
            'total_xp': total_xp,
            'xp_progress': total_xp - xp_per_level[-1],
            'xp_for_next_level': 0,
            'progress_percentage': 100
        }
    
    @staticmethod
    def _generate_xp_curve(levels: int = 50) -> List[int]:
        """Gera curva de XP necessário para cada nível"""
        curve = [100]  # Nível 1: 100 XP
        
        for _ in range(1, levels):
            curve.append(int(curve[-1] * 1.5))
        
        return curve
