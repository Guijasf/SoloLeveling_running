  import axios from 'axios';
import time
import json

API_URL = 'http://localhost:8000'

class SoloLevelingE2ETest:
    """Testes end-to-end para o sistema Solo Leveling"""
    
    def __init__(self):
        self.user_id = None
        self.goal_id = None
        self.mission_ids = []
        self.results = []
    
    def log_test(self, test_name, passed, message):
        """Registra resultado de um teste"""
        status = "✅ PASSED" if passed else "❌ FAILED"
        self.results.append({
            'test': test_name,
            'status': status,
            'message': message
        })
        print(f"\n{status}: {test_name}")
        print(f"   └─ {message}")
    
    async def test_1_create_user(self):
        """Teste 1: Criar novo usuário"""
        try:
            response = await axios.post(
                f'{API_URL}/users/register',
                json={
                    'username': 'TestPlayer',
                    'email': 'test@solo.com',
                    'password': 'Test123!@'
                }
            )
            self.user_id = response.data.get('id')
            self.log_test(
                'Create User',
                self.user_id is not None,
                f'Usuário criado com ID: {self.user_id}'
            )
            return True
        except Exception as e:
            self.log_test('Create User', False, str(e))
            # Se falhar, usar um ID padrão
            self.user_id = 1
            return False
    
    async def test_2_fetch_user_progress(self):
        """Teste 2: Buscar progresso do usuário"""
        try:
            response = await axios.get(f'{API_URL}/progress/{self.user_id}/overall')
            progress = response.data
            
            passed = (
                'level' in progress and
                'current_xp' in progress and
                'rank' in progress
            )
            
            self.log_test(
                'Fetch User Progress',
                passed,
                f'Level: {progress.get("level")}, XP: {progress.get("current_xp")}, Rank: {progress.get("rank")}'
            )
            return passed
        except Exception as e:
            self.log_test('Fetch User Progress', False, str(e))
            return False
    
    async def test_3_create_goal(self):
        """Teste 3: Criar uma meta"""
        try:
            response = await axios.post(
                f'{API_URL}/goals',
                json={
                    'user_id': self.user_id,
                    'title': 'Correr 5km',
                    'description': 'Correr 5 quilômetros sem parar',
                    'category': 'health',
                    'priority': 1,
                    'target_value': 5,
                    'reward_xp': 100
                }
            )
            self.goal_id = response.data.get('id')
            
            self.log_test(
                'Create Goal',
                self.goal_id is not None,
                f'Meta criada com ID: {self.goal_id}'
            )
            return True
        except Exception as e:
            self.log_test('Create Goal', False, str(e))
            return False
    
    async def test_4_list_goals(self):
        """Teste 4: Listar metas do usuário"""
        try:
            response = await axios.get(f'{API_URL}/goals/{self.user_id}')
            goals = response.data
            
            passed = isinstance(goals, list) and len(goals) > 0
            self.log_test(
                'List Goals',
                passed,
                f'Encontradas {len(goals)} metas'
            )
            return passed
        except Exception as e:
            self.log_test('List Goals', False, str(e))
            return False
    
    async def test_5_get_daily_missions(self):
        """Teste 5: Buscar missões diárias"""
        try:
            response = await axios.get(f'{API_URL}/missions/{self.user_id}')
            missions = response.data
            
            self.mission_ids = [m.get('id') for m in missions if m.get('id')]
            
            self.log_test(
                'Get Daily Missions',
                isinstance(missions, list),
                f'Encontradas {len(missions)} missões diárias'
            )
            return len(missions) > 0
        except Exception as e:
            self.log_test('Get Daily Missions', False, str(e))
            return False
    
    async def test_6_complete_mission(self):
        """Teste 6: Completar uma missão"""
        if not self.mission_ids:
            self.log_test('Complete Mission', False, 'Nenhuma missão disponível')
            return False
        
        try:
            mission_id = self.mission_ids[0]
            response = await axios.post(f'{API_URL}/missions/{mission_id}/complete')
            
            result = response.data
            passed = 'xp_gained' in result
            
            self.log_test(
                'Complete Mission',
                passed,
                f'Missão completada! XP ganho: {result.get("xp_gained", 0)}'
            )
            return passed
        except Exception as e:
            self.log_test('Complete Mission', False, str(e))
            return False
    
    async def test_7_process_today_missions(self):
        """Teste 7: Processar missões de hoje"""
        try:
            response = await axios.get(f'{API_URL}/missions/{self.user_id}/process-today')
            today_stats = response.data
            
            passed = (
                'missions_today' in today_stats and
                'missions_completed' in today_stats and
                'total_xp' in today_stats
            )
            
            self.log_test(
                'Process Today Missions',
                passed,
                f'Missões: {today_stats.get("missions_completed")}/{today_stats.get("missions_today")}, '
                f'XP total: {today_stats.get("total_xp")}'
            )
            return passed
        except Exception as e:
            self.log_test('Process Today Missions', False, str(e))
            return False
    
    async def test_8_check_streak(self):
        """Teste 8: Verificar sequência (streak)"""
        try:
            response = await axios.get(f'{API_URL}/streak/{self.user_id}')
            streak_data = response.data
            
            passed = (
                'current_streak' in streak_data and
                'best_streak' in streak_data
            )
            
            self.log_test(
                'Check Streak',
                passed,
                f'Sequência atual: {streak_data.get("current_streak", 0)} dias, '
                f'Melhor: {streak_data.get("best_streak", 0)} dias'
            )
            return passed
        except Exception as e:
            self.log_test('Check Streak', False, str(e))
            return False
    
    async def test_9_get_streak_leaderboard(self):
        """Teste 9: Buscar leaderboard de streak"""
        try:
            response = await axios.get(f'{API_URL}/streak/{self.user_id}/leaderboard')
            leaderboard = response.data
            
            passed = isinstance(leaderboard, list)
            self.log_test(
                'Streak Leaderboard',
                passed,
                f'Top 10 leaderboard com {len(leaderboard)} jogadores'
            )
            return passed
        except Exception as e:
            self.log_test('Streak Leaderboard', False, str(e))
            return False
    
    async def test_10_get_area_scores(self):
        """Teste 10: Buscar scores de áreas"""
        try:
            response = await axios.get(f'{API_URL}/scoring/{self.user_id}')
            scoring_data = response.data
            
            passed = (
                'life_score' in scoring_data and
                'area_scores' in scoring_data
            )
            
            self.log_test(
                'Get Area Scores',
                passed,
                f'Score de vida: {scoring_data.get("life_score", 0)}, '
                f'Áreas: {len(scoring_data.get("area_scores", []))} categorias'
            )
            return passed
        except Exception as e:
            self.log_test('Get Area Scores', False, str(e))
            return False
    
    async def test_11_get_goal_statistics(self):
        """Teste 11: Buscar estatísticas de metas"""
        try:
            response = await axios.get(f'{API_URL}/goals/{self.user_id}/stats/overview')
            stats = response.data
            
            passed = (
                'total_goals' in stats and
                'completed_goals' in stats
            )
            
            self.log_test(
                'Goal Statistics',
                passed,
                f'Total: {stats.get("total_goals", 0)}, '
                f'Completadas: {stats.get("completed_goals", 0)}, '
                f'Taxa: {stats.get("completion_rate", 0):.1f}%'
            )
            return passed
        except Exception as e:
            self.log_test('Goal Statistics', False, str(e))
            return False
    
    async def test_12_complete_goal(self):
        """Teste 12: Completar uma meta"""
        if not self.goal_id:
            self.log_test('Complete Goal', False, 'Nenhuma meta disponível')
            return False
        
        try:
            response = await axios.post(
                f'{API_URL}/goals/{self.user_id}/{self.goal_id}/complete'
            )
            
            result = response.data
            passed = 'id' in result and result.get('status') == 'completed'
            
            self.log_test(
                'Complete Goal',
                passed,
                f'Meta completada! Status: {result.get("status")}'
            )
            return passed
        except Exception as e:
            self.log_test('Complete Goal', False, str(e))
            return False
    
    async def print_summary(self):
        """Imprime resumo dos testes"""
        print("\n" + "="*60)
        print("📊 RESUMO DOS TESTES END-TO-END")
        print("="*60)
        
        total = len(self.results)
        passed = sum(1 for r in self.results if 'PASSED' in r['status'])
        failed = total - passed
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print(f"\nTotal: {total} testes")
        print(f"✅ Passou: {passed}")
        print(f"❌ Falhou: {failed}")
        print(f"Taxa de sucesso: {success_rate:.1f}%")
        
        print("\n" + "-"*60)
        print("Detalhes:")
        print("-"*60)
        
        for result in self.results:
            print(f"{result['status']}: {result['test']}")
            print(f"   └─ {result['message']}")
        
        print("\n" + "="*60)
        return success_rate >= 80  # Considera sucesso se mais de 80% passaram
    
    async def run_all_tests(self):
        """Executa todos os testes"""
        print("\n🎮 INICIANDO TESTES END-TO-END SOLO LEVELING")
        print("="*60)
        
        tests = [
            self.test_1_create_user,
            self.test_2_fetch_user_progress,
            self.test_3_create_goal,
            self.test_4_list_goals,
            self.test_5_get_daily_missions,
            self.test_6_complete_mission,
            self.test_7_process_today_missions,
            self.test_8_check_streak,
            self.test_9_get_streak_leaderboard,
            self.test_10_get_area_scores,
            self.test_11_get_goal_statistics,
            self.test_12_complete_goal
        ]
        
        for test in tests:
            try:
                await test()
            except Exception as e:
                print(f"⚠️ Erro ao executar {test.__name__}: {e}")
            
            # Pequeño delay entre testes
            time.sleep(0.5)
        
        return await self.print_summary()


# Script para executar os testes
if __name__ == '__main__':
    import asyncio
    
    async def main():
        tester = SoloLevelingE2ETest()
        success = await tester.run_all_tests()
        
        if success:
            print("\n🎉 SISTEMA VALIDADO COM SUCESSO!")
        else:
            print("\n⚠️ Alguns testes falharam. Verificar detalhes acima.")
    
    asyncio.run(main())
