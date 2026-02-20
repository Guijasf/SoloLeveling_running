#!/bin/bash

# SoloLeveling React Frontend - Script de Inicialização

echo ""
echo "🎮 ========================================"
echo "   SOLOLEVELING - REACT FRONTEND"
echo "=========================================="
echo ""

echo "📁 Entrando na pasta frontend-react..."
cd frontend-react

echo ""
echo "📦 Instalando dependências..."
echo "   (isso pode levar alguns minutos)"
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro na instalação!"
    echo "   Verifique se Node.js está instalado"
    echo "   https://nodejs.org/"
    echo ""
    exit 1
fi

echo ""
echo "✅ Dependências instaladas com sucesso!"
echo ""

if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000
EOF
    echo "✅ .env criado!"
fi

echo ""
echo "🚀 Iniciando servidor React..."
echo "   O navegador vai abrir em http://localhost:3000"
echo ""
echo "⚠️  Certifique-se que o backend está rodando:"
echo "   python -m uvicorn app.main:app --reload"
echo ""

npm start

