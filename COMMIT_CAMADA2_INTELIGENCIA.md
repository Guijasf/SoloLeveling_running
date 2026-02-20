feat: Implementar Sistema Inteligente (CAMADA 2) - Difficulty Adapter e Missões Adaptativas

🧠 Sistema de Dificuldade Adaptativa:
- Criar analyze_user_performance() para análise dos últimos 7 dias
- Implementar calculate_adaptive_difficulty() (1-5 baseado em performance)
- Adicionar calculate_adaptive_xp() com bônus de streak e motivacional
- Criar get_performance_insights() com mensagens automáticas

📊 Insights e Performance:
- Novo endpoint GET /insights/{user_id}
- Análise de completion_rate, xp_velocity, streak
- Recomendações automáticas (increase, maintain, decrease)
- Níveis: beginner, intermediate, advanced, expert, struggling
- Mensagens motivacionais dinâmicas

🎮 Missões Inteligentes:
- Criar generate_smart_missions() usando difficulty adapter
- Ajuste automático de quantidade (3-6 missões)
- Priorização de áreas mais fracas
- XP adaptativo com multiplicadores
- Integração com sistema de foco semanal

🔄 Mission Router Melhorado:
- Novo endpoint POST /missions/generate-smart/{user_id}
- Missões baseadas em performance real
- Dificuldade que evolui com o usuário
- Sistema previne frustração e estagnação

🎯 Funcionalidades:
- ✅ Usuário avançado: +dificuldade, +missões, XP normal
- ✅ Usuário lutando: -dificuldade, -missões, +XP motivacional
- ✅ Bônus de streak: 7 dias (+20%), 30 dias (+50%)
- ✅ Insights automáticos com ícones e ações

📂 Arquivos:
- app/services/difficulty_adapter.py (+ funções standalone)
- app/routers/insights_router.py (novo)
- app/services/mission_service.py (generate_smart_missions)
- app/routers/mission_router.py (endpoint inteligente)
- app/main.py (insights_router incluído)

📚 Documentação:
- CAMADA2_INTELIGENCIA_IMPLEMENTADA.md

🚀 Resultado:
Sistema adaptativo que previne frustração, mantém engajamento e evolui com o usuário.
Missões não são mais fixas - agora são contextualizadas e inteligentes.

Status: CAMADA 2 - Sistema Inteligente 80% completo ✅
Próximo: Integrar com frontend e criar histórico de performance

