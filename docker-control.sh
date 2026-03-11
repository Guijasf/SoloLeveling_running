#!/bin/bash

# ===== SoloLeveling - Docker Control Script =====
# Uso: ./docker-control.sh [command] [service]
# Comandos: up, down, build, logs, shell, clean, status, test

set -e

COMMAND=${1:-up}
SERVICE=${2:-backend}

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções
show_help() {
    cat << EOF

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

  ./docker-control.sh up
  ./docker-control.sh logs backend
  ./docker-control.sh shell backend
  ./docker-control.sh test
  ./docker-control.sh clean

EOF
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker não encontrado!${NC}"
        echo "Instale em https://www.docker.com/"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker encontrado${NC}"
}

start_containers() {
    echo -e "\n${CYAN}▶ Iniciando containers...${NC}"
    docker-compose up -d --build
    sleep 3
    echo -e "\n${GREEN}🟢 Backend API: http://localhost:8000${NC}"
    echo -e "${GREEN}📚 Swagger UI:  http://localhost:8000/docs${NC}"
    echo -e "${GREEN}🎯 Goals Page:  http://localhost:8000/frontend/goals.html${NC}"
    echo -e "${GREEN}⚛️  Frontend:    http://localhost:3000 (optional)${NC}\n"
}

stop_containers() {
    echo -e "\n${CYAN}▶ Parando containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Containers parados${NC}\n"
}

build_image() {
    echo -e "\n${CYAN}▶ Construindo imagem...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Imagem construída${NC}\n"
}

show_logs() {
    echo -e "\n${CYAN}▶ Mostrando logs de $SERVICE...${NC}"
    echo -e "${YELLOW}(Use Ctrl+C para sair)${NC}\n"
    if [ "$SERVICE" = "all" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f $SERVICE
    fi
}

access_shell() {
    echo -e "\n${CYAN}▶ Acessando shell de $SERVICE...${NC}"
    echo -e "${YELLOW}(Digite 'exit' para sair)${NC}\n"
    docker-compose exec $SERVICE bash
}

clean_everything() {
    echo -e "\n${YELLOW}⚠️  AVISO: Isso remove todos os containers, volumes e dados!${NC}"
    read -p "Tem certeza? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${CYAN}▶ Limpando sistema Docker...${NC}"
        docker-compose down -v
        docker system prune -f
        echo -e "${GREEN}✨ Sistema limpo!${NC}\n"
    else
        echo -e "${YELLOW}Cancelado.${NC}"
    fi
}

show_status() {
    echo -e "\n${CYAN}📊 Status dos Containers:${NC}\n"
    docker-compose ps --all
    echo ""
}

run_tests() {
    echo -e "\n${CYAN}▶ Executando testes...${NC}\n"
    docker-compose exec backend python test_adaptive_goals.py
}

# Main
check_docker

case $COMMAND in
    up)     start_containers ;;
    down)   stop_containers ;;
    build)  build_image ;;
    logs)   show_logs ;;
    shell)  access_shell ;;
    clean)  clean_everything ;;
    status) show_status ;;
    test)   run_tests ;;
    *)      show_help ;;
esac
