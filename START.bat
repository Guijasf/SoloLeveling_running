@echo off
echo.
echo ===============================================
echo 🚀 INICIANDO SOLOLEVELING
echo ===============================================
echo.
echo 📊 BACKEND: http://localhost:8000
echo 📚 API DOCS: http://localhost:8000/docs
echo 📱 FRONTEND: http://localhost:3000
echo.
echo ===============================================
echo.

REM Abrir Backend em Nova Janela
start "SoloLeveling - BACKEND" cmd /k "cd /d C:\Users\Guilherme.amaral\Documents\SoloLeveling && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Aguardar um pouco antes de iniciar o frontend
timeout /t 3 /nobreak

REM Abrir Frontend em Nova Janela
start "SoloLeveling - FRONTEND (React)" cmd /k "cd /d C:\Users\Guilherme.amaral\Documents\SoloLeveling\frontend-react && npm start"

echo.
echo ✅ Ambos os servidores foram iniciados!
echo.
echo 📌 ACESSE:
echo   - Frontend: http://localhost:3000
echo   - Backend: http://localhost:8000
echo   - Swagger: http://localhost:8000/docs
echo.
echo 💡 Dica: Deixe ambas as janelas abertas para ver os logs.
echo.
pause

