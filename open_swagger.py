"""
Script para iniciar o servidor e abrir o Swagger automaticamente
"""
import webbrowser
import time
import os
import subprocess
import sys

def start_server():
    """Inicia o servidor FastAPI"""
    print("🚀 Iniciando servidor FastAPI...")
    print("📍 URL: http://localhost:8000")
    print("📖 Swagger: http://localhost:8000/docs")
    print("📋 ReDoc: http://localhost:8000/redoc")
    print("\n⚡ Aguardando servidor iniciar...\n")

    # Aguardar 3 segundos
    time.sleep(3)

    # Abrir Swagger no navegador
    print("🌐 Abrindo Swagger no navegador...\n")
    webbrowser.open("http://localhost:8000/docs")

    print("✅ Swagger aberto!")
    print("\n" + "="*60)
    print("📚 GUIA RÁPIDO:")
    print("="*60)
    print("\n1️⃣ Registre um usuário em POST /auth/register")
    print("2️⃣ Copie o 'access_token' da resposta")
    print("3️⃣ Clique no botão 'Authorize' 🔓 no topo")
    print("4️⃣ Cole: Bearer SEU_TOKEN_AQUI")
    print("5️⃣ Teste GET /dashboard/{user_id}")
    print("\n" + "="*60)
    print("\n⌨️  Pressione Ctrl+C para parar o servidor\n")

if __name__ == "__main__":
    start_server()

