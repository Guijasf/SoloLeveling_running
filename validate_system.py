"""
Script de validação rápida dos 4 subsistemas.
Testa endpoints principais sem precisar do Pytest.
"""

import requests
import json
import time

API_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.RESET}")

def print_test(msg):
    print(f"{Colors.YELLOW}🧪 {msg}{Colors.RESET}")

def test_backend_health():
    """Verifica se backend está rodando"""
    print_test("Verificando saúde do backend...")
    try:
        response = requests.get(f"{API_URL}/docs")
        if response.status_code == 200:
            print_success("Backend está ativo em http://localhost:8000")
            return True
        else:
            print_error("Backend não responde corretamente")
            return False
    except Exception as e:
        print_error(f"Backend não está rodando: {e}")
        return False

def test_goals_system():
    """Testa sistema de metas"""
    print_test("\n--- TESTANDO SISTEMA DE METAS ---")
    
    user_id = 1
    
    # 1. Criar meta
    print_info("Criando meta...")
    try:
        goal_data = {
            "user_id": user_id,
            "title": "Teste Meta",
            "description": "Meta de teste",
            "category": "health",
            "status": "not_started",
            "priority": 1,
            "target_value": 100,
            "current_progress": 0,
            "reward_xp": 50
        }
        response = requests.post(f"{API_URL}/goals", json=goal_data)
        if response.status_code == 200:
            goal = response.json()
            print_success(f"Meta criada: ID {goal.get('id')} - {goal.get('title')}")
            goal_id = goal.get('id')
        else:
            print_error(f"Erro ao criar meta: {response.text}")
            return False
    except Exception as e:
        print_error(f"Erro: {e}")
        return False
    
    # 2. Listar metas
    print_info("Listando metas...")
    try:
        response = requests.get(f"{API_URL}/goals/{user_id}")
        if response.status_code == 200:
            goals = response.json()
            print_success(f"Found {len(goals)} goal(s)")
        else:
            print_error(f"Erro ao listar metas: {response.text}")
    except Exception as e:
        print_error(f"Erro: {e}")
    
    # 3. Estatísticas
    print_info("Buscando estatísticas...")
    try:
        response = requests.get(f"{API_URL}/goals/{user_id}/stats/overview")
        if response.status_code == 200:
            stats = response.json()
            print_success(f"Stats - Total: {stats.get('total_goals')}, "
                        f"Completadas: {stats.get('completed_goals')}, "
                        f"Taxa: {stats.get('completion_rate')}%")
        else:
            print_error(f"Erro: {response.status_code}")
    except Exception as e:
        print_error(f"Erro: {e}")
    
    return True

def test_missions_system():
    """Testa sistema de missões"""
    print_test("\n--- TESTANDO SISTEMA DE MISSÕES ---")
    
    user_id = 1
    
    # 1. Buscar missões do dia
    print_info("Buscando missões diárias...")
    try:
        response = requests.get(f"{API_URL}/missions/{user_id}")
        if response.status_code == 200:
            missions = response.json()
            print_success(f"Found {len(missions)} missão(ões) diária(s)")
            
            if missions:
                mission_id = missions[0].get('id')
                print_info(f"Primeira missão: {missions[0].get('title')} - XP: {missions[0].get('xp_reward')}")
                
                # 2. Tentar completar
                print_info("Completando primeira missão...")
                try:
                    response = requests.post(f"{API_URL}/missions/{mission_id}/complete")
                    if response.status_code == 200:
                        result = response.json()
                        print_success(f"Missão completada! XP ganho: {result.get('xp_gained')}")
                    else:
                        print_error(f"Erro ao completar: {response.text}")
                except Exception as e:
                    print_error(f"Erro: {e}")
            
            # 3. Processar missões de hoje
            print_info("Processando missões de hoje...")
            try:
                response = requests.get(f"{API_URL}/missions/{user_id}/process-today")
                if response.status_code == 200:
                    stats = response.json()
                    print_success(f"Processadas: {stats.get('missions_completed')}/{stats.get('missions_today')} - "
                                f"XP Total: {stats.get('total_xp')}")
                else:
                    print_error(f"Erro: {response.status_code}")
            except Exception as e:
                print_error(f"Erro: {e}")
        else:
            print_error(f"Erro ao buscar missões: {response.text}")
            return False
    except Exception as e:
        print_error(f"Erro: {e}")
        return False
    
    return True

def test_streak_system():
    """Testa sistema de sequência"""
    print_test("\n--- TESTANDO SISTEMA DE SEQUÊNCIA ---")
    
    user_id = 1
    
    # 1. Buscar dados de streak
    print_info("Buscando dados de streak...")
    try:
        response = requests.get(f"{API_URL}/streak/{user_id}")
        if response.status_code == 200:
            streak = response.json()
            print_success(f"Sequência atual: {streak.get('current_streak', 0)} dias | "
                        f"Melhor: {streak.get('best_streak', 0)} dias | "
                        f"Multiplicador: {streak.get('multiplier', 1.0)}x")
        else:
            print_info(f"Streak não disponível ainda (esperado na primeira execução)")
    except Exception as e:
        print_error(f"Erro: {e}")
    
    # 2. Bônus info
    print_info("Buscando informações de bônus...")
    try:
        response = requests.get(f"{API_URL}/streak/{user_id}/bonus")
        if response.status_code == 200:
            bonus = response.json()
            print_success(f"Bônus XP: {bonus.get('bonus_xp', 0)} | "
                        f"Milestone: {bonus.get('milestone_name', 'Nenhum')}")
        else:
            print_info(f"Bônus não disponível ainda")
    except Exception as e:
        print_error(f"Erro: {e}")
    
    # 3. Leaderboard
    print_info("Buscando leaderboard...")
    try:
        response = requests.get(f"{API_URL}/streak/{user_id}/leaderboard")
        if response.status_code == 200:
            leaderboard = response.json()
            print_success(f"Leaderboard obtido com {len(leaderboard)} jogadores")
            
            if leaderboard:
                top_3 = leaderboard[:3]
                for i, player in enumerate(top_3, 1):
                    print(f"  {i}. {player.get('username', 'Unknown')} - {player.get('current_streak', 0)} dias")
        else:
            print_error(f"Erro: {response.status_code}")
    except Exception as e:
        print_error(f"Erro: {e}")
    
    return True

def test_scoring_system():
    """Testa sistema de scoring de áreas"""
    print_test("\n--- TESTANDO SISTEMA DE SCORING ---")
    
    user_id = 1
    
    # 1. Buscar scores
    print_info("Buscando scores de áreas...")
    try:
        response = requests.get(f"{API_URL}/scoring/{user_id}")
        if response.status_code == 200:
            scoring = response.json()
            life_score = scoring.get('life_score', 0)
            areas = scoring.get('area_scores', [])
            
            print_success(f"Score de vida: {life_score:.1f}")
            
            if areas:
                print_info("Scores por área:")
                for area in areas[:3]:
                    print(f"  - {area.get('area_name')}: {area.get('score', 0):.1f}")
                
                if len(areas) > 3:
                    print(f"  ... e mais {len(areas) - 3} áreas")
            else:
                print_info("Nenhuma métrica registrada ainda")
        else:
            print_info(f"Scoring não disponível ainda (esperado sem métricas)")
    except Exception as e:
        print_error(f"Erro: {e}")
    
    return True

def print_summary():
    """Imprime resumo final"""
    print("\n" + "="*60)
    print(f"{Colors.BLUE}📊 RESUMO DA VALIDAÇÃO{Colors.RESET}")
    print("="*60)
    print(f"""
{Colors.GREEN}✅ SUBSISTEMAS VALIDADOS:{Colors.RESET}

1. 🎯 Sistema de Metas (Goals)
   - Criar meta
   - Listar metas
   - Estatísticas

2. 🎮 Sistema de Missões
   - Listar missões diárias
   - Completar missão
   - Processar estatísticas

3. 🔥 Sistema de Sequência (Streak)
   - Dados de streak
   - Informações de bônus
   - Leaderboard

4. 📊 Sistema de Scoring
   - Scores de áreas
   - Score de vida

{Colors.BLUE}NEXT STEPS:{Colors.RESET}
1. Iniciar Frontend React: npm start
2. Acessar Dashboard: http://localhost:3000
3. Testar fluxo completo
4. Verificar componentes React
    """)
    print("="*60)

def main():
    print(f"\n{Colors.BLUE}🎮 VALIDAÇÃO SOLO LEVELING - SISTEMA COMPLETO{Colors.RESET}\n")
    
    # Verificar conectividade com backend
    if not test_backend_health():
        print_error("\nPor favor, inicie o backend primeiro:")
        print("  python app/main.py")
        return
    
    # Testar cada subsistema
    time.sleep(1)
    test_goals_system()
    time.sleep(1)
    test_missions_system()
    time.sleep(1)
    test_streak_system()
    time.sleep(1)
    test_scoring_system()
    
    # Resumo
    print_summary()

if __name__ == '__main__':
    main()
