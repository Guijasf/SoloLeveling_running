# Script para iniciar SoloLeveling (Backend + Frontend)
# Execução: .\START.ps1

Write-Host @"
╔═══════════════════════════════════════════════════╗
║         🚀 INICIANDO SOLOLEVELING 🚀             ║
╚═══════════════════════════════════════════════════╝

📊 BACKEND:   http://localhost:8000
📚 API DOCS:  http://localhost:8000/docs
📱 FRONTEND:  http://localhost:3000

"@ -ForegroundColor Cyan

# Caminho do projeto
$projectPath = "C:\Users\Guilherme.amaral\Documents\SoloLeveling"
$frontendPath = "$projectPath\frontend-react"

# Função para iniciar backend
function Start-Backend {
    Write-Host "🔄 Iniciando Backend (Uvicorn)..." -ForegroundColor Yellow
    Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal
    Write-Host "✅ Backend iniciado em nova janela" -ForegroundColor Green
}

# Função para iniciar frontend
function Start-Frontend {
    Start-Sleep -Seconds 3
    Write-Host "🔄 Iniciando Frontend (React)..." -ForegroundColor Yellow
    Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start" -WindowStyle Normal
    Write-Host "✅ Frontend iniciado em nova janela" -ForegroundColor Green
}

# Iniciar ambos
Start-Backend
Start-Frontend

Write-Host @"

╔═══════════════════════════════════════════════════╗
║        ✅ SERVIDORES EM INICIALIZAÇÃO            ║
╚═══════════════════════════════════════════════════╝

📌 ACESSE EM SEU NAVEGADOR:
   🌐 Frontend:     http://localhost:3000
   🔧 Backend:      http://localhost:8000
   📚 Documentação: http://localhost:8000/docs

💡 DICA: Deixe ambas as janelas abertas para ver logs em tempo real.

⏳ Aguarde ~20-30 segundos para o frontend estar pronto...

"@ -ForegroundColor Green

