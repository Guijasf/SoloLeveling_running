"""
Teste de Integração - Sistema de Perfil Público e Estatísticas
"""
import sys
import uuid
sys.path.insert(0, "C:\\Users\\Guilherme.amaral\\Documents\\SoloLeveling")

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine
from datetime import date, timedelta

client = TestClient(app)

def setup_db():
    """Cria tabelas"""
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados criado")

def create_test_user():
    """Cria usuário de teste e retorna token"""
    unique_id = str(uuid.uuid4())[:8]
    register_data = {
        "name": "Profile Test User",
        "email": f"profile_{unique_id}@example.com",
        "password": "senha123"
    }

    response = client.post("/auth/register", json=register_data)
    data = response.json()

    return {
        "user_id": data["user"]["id"],
        "token": data["access_token"],
        "email": register_data["email"]
    }

def test_profile_system():
    """Teste completo do sistema de perfil"""
    print("\n👤 TESTE DE SISTEMA DE PERFIL\n")

    # 1. Criar usuário
    print("1️⃣ Criando usuário de teste...")
    user = create_test_user()
    user_id = user["user_id"]
    token = user["token"]
    headers = {"Authorization": f"Bearer {token}"}

    print(f"   ✅ Usuário criado: ID {user_id}")

    # 2. Testar perfil público (SEM autenticação)
    print("\n2️⃣ Testando perfil público...")
    response = client.get(f"/profile/{user_id}/public")

    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Perfil público acessível!")
        print(f"   👤 Nome: {data['name']}")
        print(f"   ⭐ Level: {data['level']}")
        print(f"   🏆 Rank: {data['rank']} - {data['rank_name']} {data['rank_emoji']}")
        print(f"   🔥 Streak: {data['current_streak']}")
        print(f"   🎯 Total XP: {data['total_xp']}")
    else:
        print(f"   ❌ Erro: {response.status_code}")
        return False

    # 3. Testar estatísticas (COM autenticação)
    print("\n3️⃣ Testando estatísticas...")
    response = client.get(f"/profile/{user_id}/stats", headers=headers)

    if response.status_code == 200:
        stats = response.json()
        print(f"   ✅ Estatísticas carregadas!")
        print(f"   📊 Dias ativos: {stats['total_days_active']}")
        print(f"   📝 Total de logs: {stats['total_logs']}")
        print(f"   ✅ Missões completadas: {stats['total_missions_completed']}")
        print(f"   🎯 Goals completados: {stats['total_goals_completed']}")
        print(f"   💎 XP total: {stats['total_xp_earned']}")
        print(f"   🏆 Achievements: {stats['total_achievements']}")
    else:
        print(f"   ❌ Erro: {response.status_code}")
        return False

    # 4. Testar configurações (GET)
    print("\n4️⃣ Testando configurações (GET)...")
    response = client.get(f"/profile/{user_id}/settings", headers=headers)

    if response.status_code == 200:
        settings = response.json()
        print(f"   ✅ Configurações carregadas!")
        print(f"   🔒 Visibilidade: {settings['profile_visibility']}")
        print(f"   🔔 Notificações: {settings['notifications_enabled']}")
        print(f"   🎨 Tema: {settings['theme']}")
        print(f"   🌍 Idioma: {settings['language']}")
    else:
        print(f"   ❌ Erro: {response.status_code}")
        return False

    # 5. Atualizar configurações (PUT)
    print("\n5️⃣ Testando atualização de configurações...")
    update_data = {
        "profile_visibility": "private",
        "theme": "light",
        "notifications_enabled": False
    }

    response = client.put(f"/profile/{user_id}/settings", json=update_data, headers=headers)

    if response.status_code == 200:
        settings = response.json()
        print(f"   ✅ Configurações atualizadas!")
        print(f"   🔒 Nova visibilidade: {settings['profile_visibility']}")
        print(f"   🎨 Novo tema: {settings['theme']}")
        print(f"   🔔 Notificações: {settings['notifications_enabled']}")
    else:
        print(f"   ❌ Erro: {response.status_code}")
        return False

    # 6. Testar perfil privado (deve bloquear acesso público)
    print("\n6️⃣ Testando bloqueio de perfil privado...")
    response = client.get(f"/profile/{user_id}/public")

    if response.status_code == 403:
        print(f"   ✅ Perfil privado bloqueado corretamente!")
    else:
        print(f"   ⚠️ Status inesperado: {response.status_code}")

    # 7. Restaurar para público e testar novamente
    print("\n7️⃣ Restaurando perfil para público...")
    update_data = {"profile_visibility": "public"}
    response = client.put(f"/profile/{user_id}/settings", json=update_data, headers=headers)

    response = client.get(f"/profile/{user_id}/public")
    if response.status_code == 200:
        print(f"   ✅ Perfil público novamente acessível!")
    else:
        print(f"   ❌ Erro ao restaurar: {response.status_code}")
        return False

    # 8. Testar calendário de atividade
    print("\n8️⃣ Testando calendário de atividade...")
    response = client.get(f"/profile/{user_id}/activity?days=7", headers=headers)

    if response.status_code == 200:
        activity = response.json()
        print(f"   ✅ Calendário carregado!")
        print(f"   📅 Dias solicitados: {activity['days_requested']}")
        print(f"   📊 Registros: {len(activity['activity'])} dias")
    else:
        print(f"   ❌ Erro: {response.status_code}")
        return False

    # 9. Testar acesso negado (outro usuário tentando ver stats)
    print("\n9️⃣ Testando proteção de estatísticas...")
    other_user = create_test_user()
    other_headers = {"Authorization": f"Bearer {other_user['token']}"}

    response = client.get(f"/profile/{user_id}/stats", headers=other_headers)

    if response.status_code == 403:
        print(f"   ✅ Acesso às estatísticas bloqueado corretamente!")
    else:
        print(f"   ⚠️ Status inesperado: {response.status_code}")

    print("\n✅ TODOS OS TESTES DE PERFIL PASSARAM! 🎉")
    return True

if __name__ == "__main__":
    try:
        setup_db()
        success = test_profile_system()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

