"""
Testes para o Sistema de Missões Dinâmicas - CAMADA 2, Passo 2

Valida que:
1. Missões são geradas automaticamente
2. Dificuldade varia baseada em score
3. Contagem de missões varia (mais para área em foco)
4. XP reward varia por dificuldade
5. Contexto é capturado (score, tendência, foco, rank)
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
from app.services.mission_service import (
    generate_dynamic_missions,
    get_mission_difficulty,
    get_mission_count,
    MISSION_TEMPLATES
)
from app.services.scoring_service import calculate_area_scores, find_weakest_area
from datetime import date


def setup_test_db():
    """Cria tabelas de teste"""
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados criado")


def create_test_user_with_data(db: Session, weak_score: float = 2.0) -> tuple:
    """Helper para criar usuário com dados para testes"""
    # Usuário com email único
    unique_id = str(uuid.uuid4())[:8]
    user = User(name="Mission Test User", email=f"missions_{unique_id}@test.com")
    db.add(user)
    db.commit()
    db.refresh(user)

    # Área
    area = LifeArea(user_id=user.id, name="Health")
    db.add(area)
    db.commit()
    db.refresh(area)

    # Métrica
    metric = MetricType(user_id=user.id, life_area_id=area.id, name="Exercise")
    db.add(metric)
    db.commit()
    db.refresh(metric)

    # Log com score fraco
    log = MetricLog(
        user_id=user.id,
        metric_type_id=metric.id,
        value=weak_score,
        log_date=date.today()
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    # UserProgress
    progress = UserProgress(user_id=user.id)
    db.add(progress)
    db.commit()
    db.refresh(progress)

    return user.id, area.id, metric.id


def test_1_difficulty_calculation(db: Session):
    """TESTE 1: Cálculo dinâmico de dificuldade"""
    print("\n" + "="*60)
    print("TESTE 1: Cálculo de Dificuldade Dinâmica")
    print("="*60)

    # Score muito baixo
    diff_very_low = get_mission_difficulty(1.0, "stable", "E")
    assert diff_very_low == "easy", f"❌ Score 1.0 deveria ser easy, got {diff_very_low}"
    print(f"✅ Score 1.0 + stable = {diff_very_low} ✓")

    # Score baixo + growing
    diff_low_growing = get_mission_difficulty(4.0, "growing", "C")
    assert diff_low_growing == "medium", f"❌ Score 4.0 + growing deveria ser medium"
    print(f"✅ Score 4.0 + growing = {diff_low_growing} ✓")

    # Score médio-alto + stable
    diff_medium_stable = get_mission_difficulty(7.0, "stable", "B")
    assert diff_medium_stable == "hard", f"❌ Score 7.0 + stable deveria ser hard"
    print(f"✅ Score 7.0 + stable = {diff_medium_stable} ✓")

    # Score alto + declining (ainda hard para desafiar)
    diff_high = get_mission_difficulty(8.5, "declining", "A")
    assert diff_high == "hard", f"❌ Score 8.5 deveria ser hard"
    print(f"✅ Score 8.5 + declining = {diff_high} ✓")

    print(f"\n✅ DIFICULDADE VALIDADA")


def test_2_mission_count(db: Session):
    """TESTE 2: Contagem de missões varia"""
    print("\n" + "="*60)
    print("TESTE 2: Contagem Dinâmica de Missões")
    print("="*60)

    # Sem foco, score baixo
    count_weak_no_focus = get_mission_count(False, 2.0)
    assert count_weak_no_focus == 2, f"❌ Fraco sem foco deveria ser 2"
    print(f"✅ Score 2.0 + sem foco = {count_weak_no_focus} missões")

    # Sem foco, score normal
    count_normal_no_focus = get_mission_count(False, 5.0)
    assert count_normal_no_focus == 3, f"❌ Normal sem foco deveria ser 3"
    print(f"✅ Score 5.0 + sem foco = {count_normal_no_focus} missões")

    # Com foco, score normal
    count_focused = get_mission_count(True, 5.0)
    assert count_focused == 5, f"❌ Com foco deveria ser 5"
    print(f"✅ Score 5.0 + COM FOCO = {count_focused} missões ⭐")

    print(f"\n✅ CONTAGEM VALIDADA: Mais missões quando focando!")


def test_3_mission_generation(db: Session):
    """TESTE 3: Geração de missões dinâmicas"""
    print("\n" + "="*60)
    print("TESTE 3: Geração de Missões Dinâmicas")
    print("="*60)

    user_id, area_id, metric_id = create_test_user_with_data(db, weak_score=3.0)

    context = {
        "area": "Health",
        "score": 3.0,
        "trend": "stable",
        "rank": "D",
        "streak": 1,
        "is_focused": False,
        "reason": "weak"
    }

    # Gerar missões
    missions = generate_dynamic_missions(db, user_id, context)

    assert len(missions) > 0, "❌ Nenhuma missão foi gerada"
    print(f"✅ Missões geradas: {len(missions)}")

    for i, mission in enumerate(missions, 1):
        print(f"   {i}. [{mission.difficulty}] {mission.title}")
        print(f"      └─ XP: {mission.xp_reward}, Area: {mission.area_name}, Reason: {mission.reason}")

        assert mission.user_id == user_id, "❌ user_id errado"
        assert mission.area_name == "Health", "❌ area_name errado"
        assert mission.mission_date == date.today(), "❌ mission_date errado"
        assert mission.reason == "weak", "❌ reason errado"

    print(f"\n✅ MISSÕES VALIDADAS")


def test_4_difficulty_affects_xp(db: Session):
    """TESTE 4: Dificuldade afeta XP reward"""
    print("\n" + "="*60)
    print("TESTE 4: XP Reward Varia por Dificuldade")
    print("="*60)

    user_id, _, _ = create_test_user_with_data(db, weak_score=2.0)

    # Missões easy
    context_easy = {
        "area": "Health",
        "score": 2.0,  # Fraco = easy
        "trend": "stable",
        "rank": "E",
        "streak": 0,
        "is_focused": False,
        "reason": "weak"
    }
    missions_easy = generate_dynamic_missions(db, user_id, context_easy)
    xp_easy = missions_easy[0].xp_reward if missions_easy else 0

    # Limpar e criar novo user para testes hard
    db.query(DailyMission).filter(DailyMission.user_id == user_id).delete()
    db.commit()

    user_id2, _, _ = create_test_user_with_data(db, weak_score=8.0)

    # Missões hard
    context_hard = {
        "area": "Health",
        "score": 8.0,  # Alto = hard
        "trend": "growing",
        "rank": "B",
        "streak": 5,
        "is_focused": True,  # Com foco também
        "reason": "focus"
    }
    missions_hard = generate_dynamic_missions(db, user_id2, context_hard)
    xp_hard = missions_hard[0].xp_reward if missions_hard else 0

    print(f"\n📊 XP Rewards:")
    print(f"   Easy missions: {xp_easy} XP")
    print(f"   Hard missions: {xp_hard} XP")
    print(f"   Diferença: {xp_hard - xp_easy} XP ({int((xp_hard/xp_easy - 1)*100)}% mais)")

    assert xp_hard > xp_easy, "❌ Hard deveria ter mais XP que easy"
    print(f"\n✅ XP REWARD VALIDADO: Hard > Easy")


def test_5_focused_area_missions(db: Session):
    """TESTE 5: Área em foco gera mais missões"""
    print("\n" + "="*60)
    print("TESTE 5: Área em Foco Gera Mais Missões")
    print("="*60)

    user_id, area_id, _ = create_test_user_with_data(db, weak_score=5.0)

    # Criar foco para Health
    focus = UserFocus(
        user_id=user_id,
        area_name="Health",
        focus_start_date=date.today(),
        focus_end_date=date.today() + timedelta(days=7),
        xp_multiplier=1.5
    )
    db.add(focus)
    db.commit()

    # Gerar com foco (Health, score 5.0, com foco)
    context_focused = {
        "area": "Health",
        "score": 5.0,
        "trend": "stable",
        "rank": "D",
        "streak": 1,
        "is_focused": True,
        "reason": "focus"
    }
    missions_focused = generate_dynamic_missions(db, user_id, context_focused)

    # Gerar sem foco (Career, score 2.0, sem foco = weak)
    user_id2, _, _ = create_test_user_with_data(db, weak_score=2.0)
    context_unfocused = {
        "area": "Career",
        "score": 2.0,  # Score fraco
        "trend": "stable",
        "rank": "E",
        "streak": 0,
        "is_focused": False,
        "reason": "weak"
    }
    missions_unfocused = generate_dynamic_missions(db, user_id2, context_unfocused)

    print(f"\n📊 Contagem de Missões:")
    print(f"   Com foco (Health, score 5.0): {len(missions_focused)} missões")
    print(f"   Sem foco (Career, score 2.0): {len(missions_unfocused)} missões")
    print(f"   Diferença: {len(missions_focused) - len(missions_unfocused)} a mais")

    assert len(missions_focused) > len(missions_unfocused), f"❌ Foco deveria gerar mais ({len(missions_focused)} vs {len(missions_unfocused)})"
    print(f"\n✅ FOCO VALIDADO: Mais missões quando focando!")


def run_tests():
    """Executa todos os testes"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + "  TESTES DE MISSÕES DINÂMICAS — CAMADA 2".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")

    try:
        setup_test_db()
        db = SessionLocal()

        test_1_difficulty_calculation(db)
        test_2_mission_count(db)
        test_3_mission_generation(db)
        test_4_difficulty_affects_xp(db)
        test_5_focused_area_missions(db)

        print("\n" + "="*60)
        print("🎉 TODOS OS TESTES PASSARAM!")
        print("="*60)
        print("\n✅ Missões Dinâmicas estão funcionais!")
        print("✅ Dificuldade varia por contexto!")
        print("✅ Contagem de missões é dinâmica!")
        print("✅ Foco gera mais missões!")
        print("\n🚀 CAMADA 2 — Passo 2 concluído!")

        db.close()
        return True

    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)




