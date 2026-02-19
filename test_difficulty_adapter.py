"""
Testes para o Sistema de Dificuldade Adaptativa - CAMADA 2, Passo 4

Valida que:
1. Performance é calculada corretamente
2. Ajustes de dificuldade são apropriados
3. Feedback é personalizado
4. Boost é aplicado corretamente
5. Todos os cenários funcionam
"""

import sys
import uuid
from sqlalchemy.orm import Session

sys.path.insert(0, "C:\\Users\\Guilherme.amaral\\Documents\\SoloLeveling")

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.user_progress import UserProgress
from app.services.difficulty_adapter import DifficultyAdapter, get_adaptive_difficulty


def setup_test_db():
    """Cria tabelas de teste"""
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados criado")


def create_test_progress(db: Session, xp: int, streak: int, level: int = 1) -> tuple:
    """Helper para criar user com progress específico"""
    unique_id = str(uuid.uuid4())[:8]
    user = User(name="Difficulty Test User", email=f"diff_{unique_id}@test.com")
    db.add(user)
    db.commit()
    db.refresh(user)

    progress = UserProgress(user_id=user.id, xp=xp, level=level)
    progress.current_streak = streak
    db.add(progress)
    db.commit()
    db.refresh(progress)

    return user.id, progress


def test_1_poor_performance(db: Session):
    """TESTE 1: Detecção de performance fraca"""
    print("\n" + "="*60)
    print("TESTE 1: Performance Fraca (<50 XP/dia)")
    print("="*60)

    user_id, progress = create_test_progress(db, xp=30, streak=1)

    adapter = DifficultyAdapter(progress)
    rating = adapter.calculate_performance_rating()
    adjustment = adapter.get_difficulty_adjustment()
    feedback = adapter.get_feedback_message()

    assert rating == "poor", f"❌ Rating deveria ser 'poor', got {rating}"
    assert adjustment["mission_difficulty_multiplier"] == 0.8, "❌ Multiplicador errado"
    assert adjustment["xp_reward_multiplier"] == 1.2, "❌ Reward multiplier errado"

    print(f"✅ Performance Rating: {rating}")
    print(f"✅ Difficulty Adjustment: {adjustment['mission_difficulty_multiplier']}x")
    print(f"✅ XP Reward: {adjustment['xp_reward_multiplier']}x")
    print(f"✅ Feedback: {feedback}")


def test_2_slow_performance(db: Session):
    """TESTE 2: Detecção de performance lenta"""
    print("\n" + "="*60)
    print("TESTE 2: Performance Lenta (50-100 XP/dia)")
    print("="*60)

    user_id, progress = create_test_progress(db, xp=500, streak=5)

    adapter = DifficultyAdapter(progress)
    rating = adapter.calculate_performance_rating()
    adjustment = adapter.get_difficulty_adjustment()

    assert rating == "slow", f"❌ Rating deveria ser 'slow', got {rating}"
    assert adjustment["mission_difficulty_multiplier"] == 0.85, "❌ Multiplicador errado"
    assert adjustment["mission_count_adjustment"] == -1, "❌ Count adjustment errado"

    print(f"✅ Performance Rating: {rating}")
    print(f"✅ Difficulty: {adjustment['mission_difficulty_multiplier']}x")
    print(f"✅ Mission Count: {adjustment['mission_count_adjustment']} a menos")


def test_3_balanced_performance(db: Session):
    """TESTE 3: Detecção de performance balanceada"""
    print("\n" + "="*60)
    print("TESTE 3: Performance Balanceada (100-200 XP/dia)")
    print("="*60)

    user_id, progress = create_test_progress(db, xp=1000, streak=10)

    adapter = DifficultyAdapter(progress)
    rating = adapter.calculate_performance_rating()
    adjustment = adapter.get_difficulty_adjustment()
    feedback = adapter.get_feedback_message()

    assert rating == "balanced", f"❌ Rating deveria ser 'balanced', got {rating}"
    assert adjustment["mission_difficulty_multiplier"] == 1.0, "❌ Multiplicador errado"
    assert adjustment["xp_reward_multiplier"] == 1.0, "❌ Reward multiplier errado"

    print(f"✅ Performance Rating: {rating}")
    print(f"✅ Difficulty: {adjustment['mission_difficulty_multiplier']}x (mantém)")
    print(f"✅ XP Reward: {adjustment['xp_reward_multiplier']}x (mantém)")
    print(f"✅ Feedback: {feedback}")


def test_4_fast_performance(db: Session):
    """TESTE 4: Detecção de performance rápida"""
    print("\n" + "="*60)
    print("TESTE 4: Performance Rápida (200-300 XP/dia)")
    print("="*60)

    user_id, progress = create_test_progress(db, xp=2000, streak=10)

    adapter = DifficultyAdapter(progress)
    rating = adapter.calculate_performance_rating()
    adjustment = adapter.get_difficulty_adjustment()

    assert rating == "fast", f"❌ Rating deveria ser 'fast', got {rating}"
    assert adjustment["mission_difficulty_multiplier"] == 1.15, "❌ Multiplicador errado"
    assert adjustment["xp_required_multiplier"] == 1.1, "❌ XP required errado"

    print(f"✅ Performance Rating: {rating}")
    print(f"✅ Difficulty: {adjustment['mission_difficulty_multiplier']}x (+15%)")
    print(f"✅ XP Required: {adjustment['xp_required_multiplier']}x (+10%)")


def test_5_very_fast_performance(db: Session):
    """TESTE 5: Detecção de performance muito rápida"""
    print("\n" + "="*60)
    print("TESTE 5: Performance Muito Rápida (>300 XP/dia)")
    print("="*60)

    user_id, progress = create_test_progress(db, xp=3500, streak=10)

    adapter = DifficultyAdapter(progress)
    rating = adapter.calculate_performance_rating()
    adjustment = adapter.get_difficulty_adjustment()

    assert rating == "very_fast", f"❌ Rating deveria ser 'very_fast', got {rating}"
    assert adjustment["mission_difficulty_multiplier"] == 1.2, "❌ Multiplicador errado"
    assert adjustment["xp_required_multiplier"] == 1.2, "❌ XP required errado"

    print(f"✅ Performance Rating: {rating}")
    print(f"✅ Difficulty: {adjustment['mission_difficulty_multiplier']}x (+20%)")
    print(f"✅ XP Required: {adjustment['xp_required_multiplier']}x (+20%)")


def test_6_consistency_boost(db: Session):
    """TESTE 6: Boost por consistência"""
    print("\n" + "="*60)
    print("TESTE 6: Boost de Streak/Consistência")
    print("="*60)

    # Sem streak
    user_id1, progress1 = create_test_progress(db, xp=1000, streak=5)
    adapter1 = DifficultyAdapter(progress1)
    boost1 = adapter1.get_boost_multiplier()
    assert boost1 == 1.0, "❌ Sem streak deve retornar 1.0x"
    print(f"✅ Streak 5 dias: {boost1}x (sem boost)")

    # Streak 7 dias
    user_id2, progress2 = create_test_progress(db, xp=1000, streak=7)
    adapter2 = DifficultyAdapter(progress2)
    boost2 = adapter2.get_boost_multiplier()
    assert boost2 == 1.1, "❌ Streak 7 deve retornar 1.1x"
    print(f"✅ Streak 7 dias: {boost2}x (+10% XP)")

    # Streak 14 dias
    user_id3, progress3 = create_test_progress(db, xp=1000, streak=14)
    adapter3 = DifficultyAdapter(progress3)
    boost3 = adapter3.get_boost_multiplier()
    assert boost3 == 1.15, "❌ Streak 14 deve retornar 1.15x"
    print(f"✅ Streak 14 dias: {boost3}x (+15% XP)")

    # Streak 30 dias
    user_id4, progress4 = create_test_progress(db, xp=1000, streak=30)
    adapter4 = DifficultyAdapter(progress4)
    boost4 = adapter4.get_boost_multiplier()
    assert boost4 == 1.2, "❌ Streak 30 deve retornar 1.2x"
    print(f"✅ Streak 30 dias: {boost4}x (+20% XP)")


def test_7_consistency_score(db: Session):
    """TESTE 7: Score de consistência"""
    print("\n" + "="*60)
    print("TESTE 7: Score de Consistência")
    print("="*60)

    # Sem streak
    user_id1, progress1 = create_test_progress(db, xp=1000, streak=0)
    adapter1 = DifficultyAdapter(progress1)
    score1 = adapter1.calculate_consistency_score()
    assert score1 == 0, "❌ Sem streak deve ser 0"
    print(f"✅ Streak 0: {score1}% consistência")

    # Streak 7
    user_id2, progress2 = create_test_progress(db, xp=1000, streak=7)
    adapter2 = DifficultyAdapter(progress2)
    score2 = adapter2.calculate_consistency_score()
    expected2 = (7 / 30.0) * 100
    assert abs(score2 - expected2) < 0.1, "❌ Cálculo de streak 7 errado"
    print(f"✅ Streak 7: {score2:.1f}% consistência")

    # Streak 30 (máximo)
    user_id3, progress3 = create_test_progress(db, xp=1000, streak=30)
    adapter3 = DifficultyAdapter(progress3)
    score3 = adapter3.calculate_consistency_score()
    assert score3 == 100, "❌ Streak 30 deve ser 100%"
    print(f"✅ Streak 30: {score3}% consistência (máximo)")


def test_8_get_adaptive_difficulty_helper(db: Session):
    """TESTE 8: Função helper get_adaptive_difficulty"""
    print("\n" + "="*60)
    print("TESTE 8: Função Helper get_adaptive_difficulty()")
    print("="*60)

    user_id, progress = create_test_progress(db, xp=1500, streak=10)

    result = get_adaptive_difficulty(db, user_id, progress)

    # Verificar estrutura
    assert "difficulty_adjustment" in result, "❌ difficulty_adjustment ausente"
    assert "feedback" in result, "❌ feedback ausente"
    assert "boost_multiplier" in result, "❌ boost_multiplier ausente"
    assert "performance_rating" in result, "❌ performance_rating ausente"
    assert "consistency_score" in result, "❌ consistency_score ausente"
    assert "xp_velocity" in result, "❌ xp_velocity ausente"

    print(f"✅ Estrutura completa retornada")
    print(f"   - Performance: {result['performance_rating']}")
    print(f"   - Consistência: {result['consistency_score']:.1f}%")
    print(f"   - XP/dia: {result['xp_velocity']:.1f}")
    print(f"   - Boost: {result['boost_multiplier']}x")
    print(f"   - Feedback: {result['difficulty_adjustment']['reason']}")


def run_tests():
    """Executa todos os testes"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + "  TESTES DE DIFICULDADE ADAPTATIVA — CAMADA 2".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")

    try:
        setup_test_db()
        db = SessionLocal()

        test_1_poor_performance(db)
        test_2_slow_performance(db)
        test_3_balanced_performance(db)
        test_4_fast_performance(db)
        test_5_very_fast_performance(db)
        test_6_consistency_boost(db)
        test_7_consistency_score(db)
        test_8_get_adaptive_difficulty_helper(db)

        print("\n" + "="*60)
        print("🎉 TODOS OS TESTES PASSARAM!")
        print("="*60)
        print("\n✅ Detecção de performance funciona!")
        print("✅ Ajustes de dificuldade automáticos!")
        print("✅ Boost de consistência aplicado!")
        print("✅ Feedback personalizado!")
        print("\n🚀 CAMADA 2 — Passo 4 concluído!")

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

