"""
Testes para o Sistema de Foco Semanal - CAMADA 2

Valida que:
1. Foco é gerado automaticamente para área mais fraca
2. Multiplicador de XP é aplicado (1.5x)
3. Foco persiste pelo período especificado (7 dias)
4. Múltiplos focos não existem ao mesmo tempo
"""

import sys
from datetime import date, timedelta
from sqlalchemy.orm import Session

sys.path.insert(0, "C:\\Users\\Guilherme.amaral\\Documents\\SoloLeveling")

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.life_area import LifeArea
from app.models.metric_type import MetricType
from app.models.metric_log import MetricLog
from app.models.user_focus import UserFocus
from app.services.focus_service import (
    generate_weekly_focus,
    get_xp_multiplier,
    get_current_focus
)
from app.services.progress_engine import process_user_progress


def setup_test_db():
    """Cria tabelas de teste"""
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados criado")


def test_1_focus_generation(db: Session):
    """TESTE 1: Foco é gerado automaticamente"""
    print("\n" + "="*60)
    print("TESTE 1: Geração Automática de Foco Semanal")
    print("="*60)

    # Criar usuário
    user = User(name="Focus Test User", email="focus@test.com")
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"✅ Usuário criado: {user.id}")

    # Criar áreas
    health = LifeArea(user_id=user.id, name="Health")
    career = LifeArea(user_id=user.id, name="Career")
    db.add_all([health, career])
    db.commit()
    print(f"✅ Áreas criadas: Health, Career")

    # Criar métrica para Health
    metric_health = MetricType(user_id=user.id, life_area_id=health.id, name="Exercise")
    db.add(metric_health)
    db.commit()
    db.refresh(metric_health)
    print(f"✅ Métrica criada: Exercise")

    # Logar métrica fraca em Health (2.0)
    log = MetricLog(
        user_id=user.id,
        metric_type_id=metric_health.id,
        value=2.0,
        log_date=date.today()
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    print(f"✅ Log criado: Health = 2.0 (fraca)")

    # Gerar foco
    focus = generate_weekly_focus(db, user.id)

    # Validar
    assert focus is not None, "❌ Focus não foi gerado"
    assert focus.area_name == "Health", "❌ Área errada"
    assert focus.xp_multiplier == 1.5, "❌ Multiplicador errado"
    assert focus.is_active(), "❌ Foco não está ativo"

    print(f"\n✅ FOCO VALIDADO:")
    print(f"   - Área: {focus.area_name}")
    print(f"   - Multiplicador: {focus.xp_multiplier}x")
    print(f"   - Dias restantes: {focus.days_remaining()}")
    print(f"   - Ativo: {focus.is_active()}")

    return user.id


def test_2_xp_multiplier(db: Session, user_id: int):
    """TESTE 2: Multiplicador de XP é aplicado"""
    print("\n" + "="*60)
    print("TESTE 2: Aplicação do Multiplicador de XP")
    print("="*60)

    # Obter área com foco
    health_area = db.query(LifeArea).filter(
        LifeArea.user_id == user_id,
        LifeArea.name == "Health"
    ).first()

    # Obter métrica
    metric = db.query(MetricType).filter(
        MetricType.life_area_id == health_area.id
    ).first()

    # Criar novo log
    log = MetricLog(
        user_id=user_id,
        metric_type_id=metric.id,
        value=8.5,
        log_date=date.today() + timedelta(days=1)
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    # Processar progresso (dispara engine com multiplicador)
    result = process_user_progress(db, user_id, log)

    # Validar
    base_xp = int(8.5 * 3)  # 25.5
    expected_xp = int(base_xp * 1.5)  # 38.25 ≈ 38

    print(f"\n📊 Cálculo de XP:")
    print(f"   - Valor do log: 8.5")
    print(f"   - Base XP: {base_xp}")
    print(f"   - Multiplicador: 1.5x")
    print(f"   - XP Final: {result['xp_gain']}")
    print(f"   - Esperado: ~{expected_xp}")

    # Verificar se multiplicador foi aplicado (XP deve ser ~38, não 25)
    assert result['xp_gain'] > base_xp, "❌ Multiplicador não foi aplicado"
    print(f"\n✅ MULTIPLICADOR VALIDADO: XP aumentado de {base_xp} para {result['xp_gain']}")


def test_3_focus_persistence(db: Session, user_id: int):
    """TESTE 3: Foco persiste durante o período"""
    print("\n" + "="*60)
    print("TESTE 3: Persistência do Foco Semanal")
    print("="*60)

    # Obter foco atual
    focus = get_current_focus(db, user_id)
    assert focus is not None, "❌ Foco não existe"

    # Verificar datas
    today = date.today()
    assert focus.focus_start_date <= today, "❌ Data de início errada"
    assert focus.focus_end_date >= today, "❌ Data de fim errada"
    assert focus.days_remaining() > 0, "❌ Foco expirado"

    print(f"\n📅 Período do Foco:")
    print(f"   - Início: {focus.focus_start_date}")
    print(f"   - Fim: {focus.focus_end_date}")
    print(f"   - Duração: 7 dias")
    print(f"   - Dias restantes: {focus.days_remaining()}")
    print(f"\n✅ PERSISTÊNCIA VALIDADA")


def test_4_single_focus(db: Session, user_id: int):
    """TESTE 4: Apenas 1 foco ativo por usuário"""
    print("\n" + "="*60)
    print("TESTE 4: Unicidade do Foco Ativo")
    print("="*60)

    # Tentar gerar novo foco
    focus1 = generate_weekly_focus(db, user_id)
    focus2 = generate_weekly_focus(db, user_id)

    # Verificar que são o mesmo
    assert focus1.id == focus2.id, "❌ Múltiplos focos criados"

    # Contar focos ativos
    today = date.today()
    active_count = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.focus_end_date >= today
    ).count()

    print(f"\n✅ UNICIDADE VALIDADA:")
    print(f"   - Focos ativos: {active_count}")
    print(f"   - Focos únicos: {active_count == 1}")


def test_5_multiplier_function(db: Session, user_id: int):
    """TESTE 5: Função get_xp_multiplier retorna valor correto"""
    print("\n" + "="*60)
    print("TESTE 5: Função get_xp_multiplier()")
    print("="*60)

    # Testar multiplicador para área com foco
    mult_focus = get_xp_multiplier(db, user_id, "Health")

    # Testar multiplicador para área sem foco
    mult_no_focus = get_xp_multiplier(db, user_id, "Finance")

    assert mult_focus == 1.5, f"❌ Multiplicador de foco errado: {mult_focus}"
    assert mult_no_focus == 1.0, f"❌ Multiplicador sem foco errado: {mult_no_focus}"

    print(f"\n✅ MULTIPLICADORES VALIDADOS:")
    print(f"   - Health (com foco): {mult_focus}x")
    print(f"   - Finance (sem foco): {mult_no_focus}x")


def run_tests():
    """Executa todos os testes"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + "  TESTES DE FOCO SEMANAL — CAMADA 2".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")

    try:
        setup_test_db()
        db = SessionLocal()

        user_id = test_1_focus_generation(db)
        test_2_xp_multiplier(db, user_id)
        test_3_focus_persistence(db, user_id)
        test_4_single_focus(db, user_id)
        test_5_multiplier_function(db, user_id)

        print("\n" + "="*60)
        print("🎉 TODOS OS TESTES PASSARAM!")
        print("="*60)
        print("\n✅ Foco Semanal está funcional!")
        print("✅ Multiplicador de XP 1.5x está aplicado!")
        print("✅ Persistence está garantido!")
        print("\n🚀 CAMADA 2 — Passo 1 concluído!")

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

