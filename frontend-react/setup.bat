@echo off
REM SoloLeveling React Frontend - Script de Inicialização

echo.
echo 🎮 ========================================
echo    SOLOLEVELING - REACT FRONTEND
echo ========================================
echo.

echo 📁 Entrando na pasta frontend-react...
cd frontend-react

echo.
echo 📦 Instalando dependências...
echo    (isso pode levar alguns minutos)
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erro na instalação!
    echo    Verifique se Node.js está instalado
    echo    https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Dependências instaladas com sucesso!
echo.

if not exist .env (
    echo 📝 Criando arquivo .env...
    (
        echo REACT_APP_API_URL=http://localhost:8000
    ) > .env
    echo ✅ .env criado!
)

echo.
echo 🚀 Iniciando servidor React...
echo    O navegador vai abrir em http://localhost:3000
echo.
echo ⚠️  Certifique-se que o backend está rodando:
echo    python -m uvicorn app.main:app --reload
echo.

npm start

