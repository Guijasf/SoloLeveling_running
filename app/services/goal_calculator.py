"""
Serviços de calculadores para diferentes tipos de metas
Implementa o padrão Strategy para extensibilidade
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any
from datetime import datetime, date, timedelta
from app.models.goal_adaptive import GoalRegistry, GoalType


class GoalCalculator(ABC):
    """Interface base para calculadores de metas"""
    
    @abstractmethod
    def calculate_progress(self, goal, registries: List[GoalRegistry]) -> Dict[str, Any]:
        """Calcula progresso da meta"""
        pass


class DailyCalculator(GoalCalculator):
    """Calculador para metas diárias"""
    
    def calculate_progress(self, goal, registries: List[GoalRegistry]) -> Dict[str, Any]:
        """
        Calcula progresso de meta diária
        Exemplo: Ler 15 páginas por dia
        """
        target_days = self._get_target_days(goal)
        completed_days = sum(1 for r in registries if r.value >= goal.target_value)
        
        return {
            'progress': min((completed_days / target_days) * 100, 100) if target_days > 0 else 0,
            'completed_days': completed_days,
            'total_days': target_days,
            'current_streak': self._get_current_streak(registries, goal.target_value),
            'longest_streak': self._get_longest_streak(registries, goal.target_value),
            'total_value': sum(r.value for r in registries),
            'avg_daily': sum(r.value for r in registries) / len(registries) if registries else 0,
            'consistency': (completed_days / len(registries)) * 100 if registries else 0,
            'type_specific': {
                'days_remaining': max(0, target_days - len(registries)),
                'target_daily': goal.target_value
            }
        }
    
    def _get_target_days(self, goal) -> int:
        """Calcula número de dias da meta"""
        delta = goal.end_date - goal.start_date
        return delta.days + 1
    
    def _get_current_streak(self, registries: List[GoalRegistry], target_value: float) -> int:
        """Calcula streak atual"""
        registries_sorted = sorted(registries, key=lambda r: r.date)
        streak = 0
        today = date.today()
        
        for i in range(365):
            check_date = today - timedelta(days=i)
            day_registry = next((r for r in registries_sorted if r.date == check_date), None)
            
            if day_registry and day_registry.value >= target_value:
                streak += 1
            elif i == 0:
                return 0
            else:
                break
        
        return streak
    
    def _get_longest_streak(self, registries: List[GoalRegistry], target_value: float) -> int:
        """Calcula maior streak da história"""
        registries_sorted = sorted(registries, key=lambda r: r.date)
        max_streak = 0
        current_streak = 0
        
        for record in registries_sorted:
            if record.value >= target_value:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 0
        
        return max_streak


class FrequencyCalculator(GoalCalculator):
    """Calculador para metas por frequência"""
    
    def calculate_progress(self, goal, registries: List[GoalRegistry]) -> Dict[str, Any]:
        """
        Calcula progresso de meta por frequência
        Exemplo: Treinar 4 vezes por semana
        """
        period_start = self._get_period_start(goal.period)
        this_period_count = sum(1 for r in registries if r.date >= period_start)
        total_periods = self._count_periods(goal)
        
        return {
            'progress': min((this_period_count / goal.target_value) * 100, 100),
            'this_period_count': this_period_count,
            'target_per_period': goal.target_value,
            'total_registries': len(registries),
            'next_target': max(0, goal.target_value - this_period_count),
            'days_until_reset': self._days_until_period_reset(goal.period),
            'on_track': this_period_count >= goal.target_value,
            'type_specific': {
                'period': goal.period.value,
                'completed_periods': len(registries) // goal.target_value if goal.target_value > 0 else 0
            }
        }
    
    def _get_period_start(self, period) -> date:
        """Retorna o início do período atual"""
        today = date.today()
        
        if period.value == 'week':
            day_of_week = today.weekday()
            return today - timedelta(days=day_of_week)
        elif period.value == 'month':
            return date(today.year, today.month, 1)
        
        return today
    
    def _days_until_period_reset(self, period) -> int:
        """Calcula dias até reset do período"""
        today = date.today()
        
        if period.value == 'week':
            return (6 - today.weekday()) % 7 + 1
        elif period.value == 'month':
            next_month = (today.replace(day=1) + timedelta(days=32)).replace(day=1)
            return (next_month - today).days
        
        return 0
    
    def _count_periods(self, goal) -> int:
        """Conta quantos períodos tem a meta"""
        delta = goal.end_date - goal.start_date
        
        if goal.period.value == 'week':
            return delta.days // 7 + 1
        elif goal.period.value == 'month':
            return delta.days // 30 + 1
        
        return 1


class CumulativeCalculator(GoalCalculator):
    """Calculador para metas acumulativas"""
    
    def calculate_progress(self, goal, registries: List[GoalRegistry]) -> Dict[str, Any]:
        """
        Calcula progresso de meta acumulativa
        Exemplo: Correr 50km no mês
        """
        total_accumulated = sum(r.value for r in registries)
        days_elapsed = self._days_elapsed(goal)
        total_days = self._get_total_days(goal)
        expected_at_this_point = (goal.target_value / total_days) * days_elapsed if total_days > 0 else 0
        
        return {
            'progress': min((total_accumulated / goal.target_value) * 100, 100) if goal.target_value > 0 else 0,
            'total_accumulated': total_accumulated,
            'target_value': goal.target_value,
            'remaining': max(0, goal.target_value - total_accumulated),
            'avg_daily': total_accumulated / len(registries) if registries else 0,
            'on_track': total_accumulated >= expected_at_this_point,
            'projected_end': self._project_completion(goal, registries),
            'days_remaining': max(0, total_days - days_elapsed),
            'type_specific': {
                'expected_at_this_point': expected_at_this_point,
                'days_elapsed': days_elapsed
            }
        }
    
    def _days_elapsed(self, goal) -> int:
        """Calcula dias decorridos"""
        delta = date.today() - goal.start_date
        return max(0, delta.days)
    
    def _get_total_days(self, goal) -> int:
        """Calcula total de dias da meta"""
        delta = goal.end_date - goal.start_date
        return delta.days + 1
    
    def _project_completion(self, goal, registries: List[GoalRegistry]) -> Dict[str, Any]:
        """Projeta data de conclusão"""
        if len(registries) < 2:
            return None
        
        total_accumulated = sum(r.value for r in registries)
        avg_daily = total_accumulated / len(registries)
        remaining = goal.target_value - total_accumulated
        
        if avg_daily <= 0:
            return None
        
        days_needed = int(remaining / avg_daily) + 1
        projection_date = date.today() + timedelta(days=days_needed)
        
        return {
            'date': projection_date.isoformat(),
            'days_needed': days_needed,
            'on_time': projection_date <= goal.end_date
        }


class MilestoneCalculator(GoalCalculator):
    """Calculador para metas milestone (final objective)"""
    
    def calculate_progress(self, goal, registries: List[GoalRegistry]) -> Dict[str, Any]:
        """
        Calcula progresso de meta milestone
        Exemplo: Levantar 150kg no supino
        """
        current_value = max((r.value for r in registries), default=0)
        previous_best = max((r.value for r in registries[:-1]), default=0) if len(registries) > 1 else 0
        
        return {
            'progress': (current_value / goal.target_value) * 100 if goal.target_value > 0 else 0,
            'current_value': current_value,
            'target_value': goal.target_value,
            'remaining': max(0, goal.target_value - current_value),
            'improved': current_value > previous_best,
            'improvement': current_value - previous_best,
            'last_record': self._serialize_registry(registries[-1]) if registries else None,
            'best_record': max((r.value for r in registries), default=0),
            'total_attempts': len(registries),
            'type_specific': {
                'percentage_to_goal': (current_value / goal.target_value) * 100 if goal.target_value > 0 else 0
            }
        }
    
    @staticmethod
    def _serialize_registry(registry: GoalRegistry) -> Dict[str, Any]:
        """Serializa um registro"""
        return {
            'date': registry.date.isoformat(),
            'value': registry.value,
            'note': registry.note
        }


class CalculatorFactory:
    """Factory para obter o calculador correto"""
    
    _calculators = {
        GoalType.DAILY: DailyCalculator(),
        GoalType.FREQUENCY: FrequencyCalculator(),
        GoalType.CUMULATIVE: CumulativeCalculator(),
        GoalType.MILESTONE: MilestoneCalculator()
    }
    
    @classmethod
    def get_calculator(cls, goal_type: GoalType) -> GoalCalculator:
        """Retorna o calculador apropriado para o tipo de meta"""
        return cls._calculators.get(goal_type, cls._calculators[GoalType.DAILY])
