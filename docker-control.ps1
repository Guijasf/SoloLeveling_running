#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de controle do SoloLeveling com Docker
.DESCRIPTION
    Facilita iniciar, parar e gerenciar containers Docker
.EXAMPLE
    .\docker-control.ps1 up
    .\docker-control.ps1 logs
    .\docker-control.ps1 shell backend
#>

param(
    [Parameter(Position=0)]
    [ValidateSet('up', 'down', 'build', 'logs', 'shell', 'clean', 'status', 'test')]
    [string]$Command = 'up',
    
    [Parameter(Position=1)]
    [string]$Service = 'backend'
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║         🎮 SoloLeveling - Docker Control Tools                 ║
╚════════════════════════════════════════════════════════════════╝

COMANDOS DISPONÍVEIS:

  up              Iniciar containers (build se necessário)
  down            Parar e remover containers
  build           Construir imagem sem cache
  logs            Ver logs em tempo real (use Ctrl+C para sair)
  shell           Acessar terminal do container
  clean           Remover containers, volumes e dados
  status          Ver status dos containers
  test            Rodar testes no backend

EXEMPLOS:

  .\docker-control.ps1 up
  .\docker-control.ps1 logs backend
  .\docker-control.ps1 shell backend
  .\docker-control.ps1 test
  .\docker-control.ps1 clean

"@
}

function Check-Docker {
    try {
        $null = docker --version
        Write-Host "✅ Docker encontrado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker não encontrado! Instale em https://www.docker.com/" -ForegroundColor Red
        exit 1
    }
}

function Execute-Command {
    param([string]$Name, [scriptblock]$Block)
    
    Write-Host ""
    Write-Host "▶ $Name..." -ForegroundColor Cyan
    try {
        & $Block
        Write-Host "✅ $Name concluído" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro em $Name : $_" -ForegroundColor Red
        exit 1
    }
}

function Start-Containers {
    Execute-Command "Iniciando containers" {
        docker-compose up -d --build
        Start-Sleep -Seconds 3
        Write-Host ""
        Write-Host "🟢 Backend API: http://localhost:8000" -ForegroundColor Green
        Write-Host "📚 Swagger UI:  http://localhost:8000/docs" -ForegroundColor Green
        Write-Host "🎯 Goals Page:  http://localhost:8000/frontend/goals.html" -ForegroundColor Green
        Write-Host "⚛️  Frontend:    http://localhost:3000 (optional)" -ForegroundColor Green
        Write-Host ""
    }
}

function Stop-Containers {
    Execute-Command "Parando containers" {
        docker-compose down
    }
}

function Build-Image {
    Execute-Command "Construindo imagem" {
        docker-compose build --no-cache
    }
}

function Show-Logs {
    if ($Service -eq 'all') {
        Write-Host ""
        Write-Host "▶ Mostrando logs de todos os serviços..." -ForegroundColor Cyan
        Write-Host "(Use Ctrl+C para sair)" -ForegroundColor Yellow
        Write-Host ""
        docker-compose logs -f
    } else {
        Write-Host ""
        Write-Host "▶ Mostrando logs de $Service..." -ForegroundColor Cyan
        Write-Host "(Use Ctrl+C para sair)" -ForegroundColor Yellow
        Write-Host ""
        docker-compose logs -f $Service
    }
}

function Access-Shell {
    Write-Host ""
    Write-Host "▶ Acessando shell de $Service..." -ForegroundColor Cyan
    Write-Host "(Digite 'exit' para sair)" -ForegroundColor Yellow
    Write-Host ""
    docker-compose exec $Service bash
}

function Clean-Everything {
    Write-Host ""
    Write-Host "⚠️  AVISO: Isso remove todos os containers, volumes e dados!" -ForegroundColor Yellow
    $confirm = Read-Host "Tem certeza? (s/n)"
    
    if ($confirm -eq 's' -or $confirm -eq 'S') {
        Execute-Command "Limpando sistema Docker" {
            docker-compose down -v
            docker system prune -f
            Write-Host "✨ Sistema limpo!" -ForegroundColor Green
        }
    } else {
        Write-Host "Cancelado." -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host ""
    Write-Host "📊 Status dos Containers:" -ForegroundColor Cyan
    Write-Host ""
    docker-compose ps --all
    Write-Host ""
}

function Run-Tests {
    Write-Host ""
    Write-Host "▶ Executando testes..." -ForegroundColor Cyan
    docker-compose exec backend python test_adaptive_goals.py
}

# Main
Check-Docker

switch ($Command) {
    'up'     { Start-Containers }
    'down'   { Stop-Containers }
    'build'  { Build-Image }
    'logs'   { Show-Logs }
    'shell'  { Access-Shell }
    'clean'  { Clean-Everything }
    'status' { Show-Status }
    'test'   { Run-Tests }
    default  { Show-Help }
}
