"""
Teste rápido de autenticação
"""
import sys
sys.path.insert(0, "C:\\Users\\Guilherme.amaral\\Documents\\SoloLeveling")

from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

def test_security():
    print("🔐 Testando Sistema de Segurança\n")

    # Teste 1: Hash de senha
    print("1️⃣ Testando hash de senha...")
    password = "minha_senha_123"
    hashed = hash_password(password)
    print(f"   ✅ Hash gerado: {hashed[:50]}...")

    # Teste 2: Verificação de senha
    print("\n2️⃣ Testando verificação de senha...")
    is_valid = verify_password(password, hashed)
    print(f"   ✅ Senha válida: {is_valid}")

    is_invalid = verify_password("senha_errada", hashed)
    print(f"   ✅ Senha inválida rejeitada: {not is_invalid}")

    # Teste 3: Criação de token JWT
    print("\n3️⃣ Testando criação de token JWT...")
    token = create_access_token(data={"sub": "1"})  # JWT spec requer string
    print(f"   ✅ Token gerado: {token[:50]}...")

    # Teste 4: Decodificação de token
    print("\n4️⃣ Testando decodificação de token...")
    payload = decode_access_token(token)
    if payload is None:
        print(f"   ❌ Falha ao decodificar token")
        print(f"   Token: {token}")
        return False
    print(f"   ✅ Payload decodificado: {payload}")
    print(f"   ✅ User ID: {payload.get('sub')}")

    # Teste 5: Token inválido
    print("\n5️⃣ Testando token inválido...")
    invalid_payload = decode_access_token("token_invalido_123")
    print(f"   ✅ Token inválido rejeitado: {invalid_payload is None}")

    print("\n✅ Todos os testes de segurança passaram!")
    return True

if __name__ == "__main__":
    try:
        success = test_security()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)



