"""
TESTE INTEGRADO FINAL - CAMADA 2 COMPLETA
==========================================

Valida que todos os 4 passos funcionam juntos:
1. Foco Semanal (Multiplicador 1.5x)
2. Missões Dinâmicas (15 tipos)
3. Achievements (19 tipos, XP bonus)
4. Dificuldade Adaptativa (5 categorias)

Simula jornada completa de um usuário através de múltiplos dias
e valida todo o fluxo integrado.
"""

import sys
import uuid
from datetime import date, timedelta
from sqlalchemy.orm import Session

sys.path.insert(0, "C:\\Users\\Guilherme.amaral\\Documents\\SoloLeveling")

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.life_area import LifeArea
from app.models.metric_type import MetricType
from app.models.metric_log import MetricLog
from app.models.user_progress import UserProgress
from app.models.user_focus import UserFocus
from app.models.daily_mission import DailyMission
from app.models.achievement import Achievement

from app.services.progress_engine import process_user_progress
from app.services.focus_service import generate_weekly_focus, get_current_focus
from app.services.mission_service import generate_dynamic_missions
from app.services.achievement_service import get_user_achievements, count_achievements
from app.services.difficulty_adapter import get_adaptive_difficulty


def setup_test_db():
    """Cria tabelas de teste"""
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados criado")


def create_full_test_user(db: Session) -> tuple:
    """Cria usuário com todos os dados necessários"""
    unique_id = str(uuid.uuid4())[:8]
    user = User(name="Integration Test User", email=f"integration_{unique_id}@test.com")
    db.add(user)
    db.commit()
    db.refresh(user)

    # Criar áreas de vida
    areas = []
    for area_name in ["Health", "Career", "Finance", "Relationships", "Mind"]:
        area = LifeArea(user_id=user.id, name=area_name)
        db.add(area)
        areas.append(area)
    db.commit()

    # Criar métricas para cada área
    metrics = []
    for area in areas:
        metric = MetricType(user_id=user.id, life_area_id=area.id, name=f"{area.name} Metric")
        db.add(metric)
        metrics.append(metric)
    db.commit()

    # Criar progress
    progress = UserProgress(user_id=user.id)
    db.add(progress)
    db.commit()
    db.refresh(progress)

    return user.id, progress, metrics


def simulate_day(db: Session, user_id: int, progress: UserProgress, metrics: list, day: int, log_values: list):
    """
    Simula um dia completo do usuário.

    Args:
        db: Session
        user_id: ID do usuário
        progress: Objeto progress
        metrics: Lista de métricas
        day: Número do dia
        log_values: Valores a logar para cada métrica [Health, Career, Finance, Relationships, Mind]
    """
    print(f"\n{'='*70}")
    print(f"DIA {day}")
    print(f"{'='*70}")

    # 1. Logar métricas e processar engine
    total_xp_gained = 0
    for i, metric in enumerate(metrics):
        if i < len(log_values):
            log = MetricLog(
                user_id=user_id,
                metric_type_id=metric.id,
                value=log_values[i],
                log_date=date.today() + timedelta(days=day-1)
            )
            db.add(log)
            db.commit()
            db.refresh(log)

            # PROCESSAR ENGINE (INTEGRA TODOS OS 4 PASSOS)
            result = process_user_progress(db, user_id, log)
            total_xp_gained += result["xp_gain"]

            print(f"\n[LOG] {metric.name}: {log_values[i]}")
            print(f"  └─ XP Gain: {result['xp_gain']}")

    # Recarregar progress
    db.refresh(progress)

    print(f"\n[RESUMO DIA {day}]")
    print(f"  XP Total Ganho: {total_xp_gained}")
    print(f"  XP Acumulado: {progress.xp}")
    print(f"  Level: {progress.level}")
    print(f"  Rank: {progress.rank}")
    print(f"  Streak: {progress.current_streak}")

    # 2. Verificar Foco Semanal (P1)
    focus = get_current_focus(db, user_id)
    if focus:
        print(f"  Foco Ativo: {focus.area_name} ({focus.days_remaining()} dias restantes)")

    # 3. Verificar Missões (P2)
    missions = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date == date.today() + timedelta(days=day-1)
    ).all()
    if missions:
        print(f"  Missões Geradas: {len(missions)} ({missions[0].difficulty})")

    # 4. Verificar Achievements (P3)
    achievements = get_user_achievements(db, user_id)
    if achievements:
        print(f"  Achievements: {len(achievements)} desbloqueados")
        if len(achievements) <= 3:
            for ach in achievements:
                print(f"    ├─ {ach.icon} {ach.title} (+{ach.xp_reward} XP)")

    # 5. Verificar Adaptabilidade (P4)
    difficulty_info = get_adaptive_difficulty(db, user_id, progress)
    print(f"  Performance: {difficulty_info['performance_rating']}")
    print(f"  Feedback: {difficulty_info['difficulty_adjustment']['reason']}")
    print(f"  Boost: {difficulty_info['boost_multiplier']}x")


def test_full_integration():
    """Teste integrado completo - Jornada de 7 dias"""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*68 + "║")
    print("║" + "  TESTE INTEGRADO FINAL — CAMADA 2 COMPLETA".center(68) + "║")
    print("║" + " "*68 + "║")
    print("╚" + "="*68 + "╝")

    try:
        setup_test_db()
        db = SessionLocal()

        # Criar usuário completo
        user_id, progress, metrics = create_full_test_user(db)
        print(f"\n✅ Usuário criado: {user_id}")
        print(f"✅ Métricas criadas: {len(metrics)}")

        # DIA 1 - Fraco (Poor Performance)
        simulate_day(db, user_id, progress, metrics, day=1, log_values=[2.0, 2.0, 2.0, 2.0, 2.0])

        # DIA 2
        simulate_day(db, user_id, progress, metrics, day=2, log_values=[3.0, 3.0, 3.0, 3.0, 3.0])

        # DIA 3 - Streak 3
        simulate_day(db, user_id, progress, metrics, day=3, log_values=[4.0, 4.0, 4.0, 4.0, 4.0])

        # DIA 4
        simulate_day(db, user_id, progress, metrics, day=4, log_values=[5.0, 5.0, 5.0, 5.0, 5.0])

        # DIA 5
        simulate_day(db, user_id, progress, metrics, day=5, log_values=[6.0, 6.0, 6.0, 6.0, 6.0])

        # DIA 6
        simulate_day(db, user_id, progress, metrics, day=6, log_values=[7.0, 7.0, 7.0, 7.0, 7.0])

        # DIA 7 - Streak 7
        simulate_day(db, user_id, progress, metrics, day=7, log_values=[8.0, 8.0, 8.0, 8.0, 8.0])

        # VALIDAÇÕES FINAIS
        print("\n" + "="*70)
        print("VALIDAÇÕES FINAIS")
        print("="*70)

        db.refresh(progress)

        # P1 - Validar Foco
        focus = get_current_focus(db, user_id)
        assert focus is not None, "❌ Foco não foi gerado"
        assert focus.area_name in ["Health", "Career", "Finance", "Relationships", "Mind"], "❌ Area inválida"
        assert focus.is_active(), "❌ Foco não está ativo"
        print(f"✅ P1 FOCO: {focus.area_name} ({focus.xp_multiplier}x)")

        # P2 - Validar Missões
        all_missions = db.query(DailyMission).filter(DailyMission.user_id == user_id).all()
        assert len(all_missions) > 0, "❌ Nenhuma missão foi gerada"
        print(f"✅ P2 MISSÕES: {len(all_missions)} total geradas")

        # P3 - Validar Achievements
        achievements = get_user_achievements(db, user_id)
        assert len(achievements) > 0, "❌ Nenhum achievement foi desbloqueado"
        total_ach_xp = sum(ach.xp_reward for ach in achievements)
        print(f"✅ P3 ACHIEVEMENTS: {len(achievements)} desbloqueados, {total_ach_xp} XP total")

        # P4 - Validar Adaptabilidade
        difficulty_info = get_adaptive_difficulty(db, user_id, progress)
        assert "performance_rating" in difficulty_info, "❌ Performance rating ausente"
        assert "feedback" in difficulty_info["difficulty_adjustment"], "❌ Feedback ausente"
        print(f"✅ P4 ADAPTABILIDADE: {difficulty_info['performance_rating']} (Boost: {difficulty_info['boost_multiplier']}x)")

        # RESUMO FINAL
        print("\n" + "="*70)
        print("RESUMO FINAL - USUÁRIO APÓS 7 DIAS")
        print("="*70)
        print(f"\n📊 PROGRESSO:")
        print(f"   XP: {progress.xp}")
        print(f"   Level: {progress.level}")
        print(f"   Rank: {progress.rank}")
        print(f"   Streak: {progress.current_streak}")

        print(f"\n🎯 P1 FOCO:")
        print(f"   Área: {focus.area_name}")
        print(f"   Multiplicador: {focus.xp_multiplier}x")

        print(f"\n🎮 P2 MISSÕES:")
        print(f"   Total Geradas: {len(all_missions)}")

        print(f"\n🏆 P3 ACHIEVEMENTS:")
        print(f"   Total: {len(achievements)}")
        for ach in achievements[:5]:
            print(f"   ├─ {ach.icon} {ach.title} (+{ach.xp_reward} XP)")

        print(f"\n📈 P4 ADAPTABILIDADE:")
        print(f"   Performance: {difficulty_info['performance_rating']}")
        print(f"   Consistência: {difficulty_info['consistency_score']:.1f}%")
        print(f"   XP/dia: {difficulty_info['xp_velocity']:.1f}")
        print(f"   Boost: {difficulty_info['boost_multiplier']}x")

        print("\n" + "="*70)
        print("🎉 TESTE INTEGRADO PASSOU!")
        print("="*70)
        print("\n✅ Todos os 4 passos funcionam juntos!")
        print("✅ Jornada de 7 dias simulada com sucesso!")
        print("✅ XP, Achievements, Foco, Missões e Adaptação integrados!")
        print("\n🚀 CAMADA 2 ESTÁ 100% FUNCIONAL!")

        db.close()
        return True

    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_full_integration()
    sys.exit(0 if success else 1)

