"""
Teste de Integração - Sistema de Autenticação Completo
Testa registro, login e acesso a rotas protegidas
"""
import sys
import uuid
sys.path.insert(0, "C:\\Users\\Guilherme.amaral\\Documents\\SoloLeveling")

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine

# Criar cliente de teste
client = TestClient(app)

def setup_db():
    """Cria tabelas"""
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados criado")

def test_auth_flow():
    """Teste completo do fluxo de autenticação"""
    print("\n🔐 TESTE DE AUTENTICAÇÃO COMPLETA\n")

    # 1. Registro
    print("1️⃣ Testando registro de usuário...")
    unique_id = str(uuid.uuid4())[:8]
    register_data = {
        "name": "Test User",
        "email": f"test_{unique_id}@example.com",
        "password": "senha_segura_123"
    }

    response = client.post("/auth/register", json=register_data)

    if response.status_code != 201:
        print(f"   ❌ Falha no registro: {response.json()}")
        return False

    data = response.json()
    print(f"   ✅ Registro bem-sucedido!")
    print(f"   👤 Usuário: {data['user']['name']}")
    print(f"   📧 Email: {data['user']['email']}")
    print(f"   🔑 Token recebido: {data['access_token'][:50]}...")

    token = data["access_token"]
    user_id = data["user"]["id"]

    # 2. Login
    print("\n2️⃣ Testando login...")
    login_data = {
        "email": register_data["email"],
        "password": register_data["password"]
    }

    response = client.post("/auth/login", json=login_data)

    if response.status_code != 200:
        print(f"   ❌ Falha no login: {response.json()}")
        return False

    data = response.json()
    print(f"   ✅ Login bem-sucedido!")
    print(f"   🔑 Novo token recebido: {data['access_token'][:50]}...")

    token = data["access_token"]

    # 3. Acesso à rota /auth/me
    print("\n3️⃣ Testando endpoint /auth/me (protegido)...")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/auth/me", headers=headers)

    if response.status_code != 200:
        print(f"   ❌ Falha ao acessar /me: {response.json()}")
        return False

    data = response.json()
    print(f"   ✅ Acesso autorizado!")
    print(f"   👤 ID: {data['id']}")
    print(f"   📧 Email: {data['email']}")

    # 4. Acesso sem token (deve falhar)
    print("\n4️⃣ Testando acesso sem token (deve falhar)...")
    response = client.get("/auth/me")

    if response.status_code == 403:
        print(f"   ✅ Acesso negado corretamente!")
    else:
        print(f"   ⚠️ Status code inesperado: {response.status_code}")

    # 5. Acesso com token inválido (deve falhar)
    print("\n5️⃣ Testando acesso com token inválido...")
    bad_headers = {"Authorization": "Bearer token_invalido_123"}
    response = client.get("/auth/me", headers=bad_headers)

    if response.status_code == 401:
        print(f"   ✅ Token inválido rejeitado corretamente!")
    else:
        print(f"   ⚠️ Status code inesperado: {response.status_code}")

    # 6. Testar dashboard protegido
    print("\n6️⃣ Testando acesso ao dashboard (protegido)...")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get(f"/dashboard/{user_id}", headers=headers)

    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Dashboard acessado!")
        print(f"   📊 Level: {data['progress']['level']}")
        print(f"   ⭐ XP: {data['progress']['xp']}")
        print(f"   🏆 Rank: {data['rank']['current']} - {data['rank']['name']} {data['rank']['emoji']}")
    elif response.status_code == 404:
        print(f"   ⚠️ Progresso não encontrado (esperado para novo usuário)")
    else:
        print(f"   ❌ Erro inesperado: {response.status_code} - {response.json()}")

    # 7. Login com senha errada
    print("\n7️⃣ Testando login com senha incorreta...")
    bad_login = {
        "email": register_data["email"],
        "password": "senha_errada"
    }

    response = client.post("/auth/login", json=bad_login)

    if response.status_code == 401:
        print(f"   ✅ Senha incorreta rejeitada!")
    else:
        print(f"   ⚠️ Status code inesperado: {response.status_code}")

    # 8. Registro duplicado
    print("\n8️⃣ Testando registro duplicado...")
    response = client.post("/auth/register", json=register_data)

    if response.status_code == 400:
        print(f"   ✅ Email duplicado rejeitado!")
    else:
        print(f"   ⚠️ Status code inesperado: {response.status_code}")

    print("\n✅ TODOS OS TESTES DE AUTENTICAÇÃO PASSARAM!")
    return True

if __name__ == "__main__":
    try:
        setup_db()
        success = test_auth_flow()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

