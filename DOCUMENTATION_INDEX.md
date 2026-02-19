# 📚 Índice de Documentação - SoloLeveling

Navegue facilmente pela documentação do projeto.

---

## 📋 Visão Geral do Projeto

### Para começar
- **[README.md](./README.md)** - Introdução, setup, exemplos
- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Resumo do que foi feito em CAMADA 1

### Entender o projeto
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Status completo, timeline, roadmap
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura detalhada com diagramas

---

## 🏗️ Desenvolvimento

### Implementação Atual (CAMADA 1)
- **[CAMADA1_IMPLEMENTATION.md](./CAMADA1_IMPLEMENTATION.md)** - Detalhes técnicos de CAMADA 1
  - Padronização de formatos
  - Engine centralizada
  - Remoção de duplicação
  - Testes

### Desenvolvimento Futuro (CAMADA 2)
- **[CAMADA2_PLANO.md](./CAMADA2_PLANO.md)** - Plano detalhado de CAMADA 2
  - Foco Semanal Automático
  - Missões Dinâmicas
  - Achievements
  - Dificuldade Adaptativa

### Como Desenvolver
- **[QUICK_DEV_GUIDE.md](./QUICK_DEV_GUIDE.md)** - Referência rápida para adicionar features
  - Padrões de código
  - Checklist de desenvolvimento
  - Exemplos práticos
  - Erros comuns

---

## 🧪 Testes

- **[test_engine_stability.py](./test_engine_stability.py)** - Suite de testes para CAMADA 1
  - Valida formato padronizado
  - Valida engine centralizada
  - Valida sem duplicação
  - Valida retorno padrão

---

## 📊 Estrutura do Projeto

### Modelos (app/models/)
- `user.py` - Usuário
- `user_progress.py` - Progresso (XP, Level, Rank, Streak)
- `metric_log.py` - Log de métrica
- `metric_type.py` - Tipo de métrica
- `life_area.py` - Área de vida (Health, Career, etc)
- `daily_mission.py` - Missão diária
- `goal.py` - Goal/Meta do usuário
- `user_focus.py` - Foco semanal (CAMADA 2)
- `achievement.py` - Achievement (CAMADA 2)

### Services (app/services/)
⭐ **progress_engine.py** - ENGINE CENTRAL
- Orquestra todo o progresso
- Calcula XP, Level, Rank
- Aplica multiplicadores
- Commita BD uma única vez

Utilitários:
- `scoring_service.py` - Calcula scores por área
- `mission_service.py` - Gera/processa missões
- `level_system.py` - Calcula level baseado em XP
- `rank_service.py` - Calcula rank baseado em score
- `streak_service.py` - Atualiza streak
- `focus_service.py` - Foco semanal (CAMADA 2)
- `achievement_service.py` - Achievements (CAMADA 2)
- `radar_service.py` - Dados para radar chart
- `xp_service.py` - Utilitários de XP (sem estado)

### Routers (app/routers/)
- `user_router.py` - CRUD de usuários
- `metric_log_router.py` - Cria logs (dispara engine!)
- `metric_type_router.py` - CRUD de tipos de métrica
- `life_area_router.py` - CRUD de áreas de vida
- `mission_router.py` - Missões diárias
- `goal_router.py` - Goals (completa via engine!)
- `scoring_router.py` - Scores e rankings
- `focus_router.py` - Foco semanal (CAMADA 2)

### Schemas (app/schemas/)
- Validação de entrada para cada modelo
- Baseado em Pydantic

### Core (app/core/)
- `database.py` - Setup SQLAlchemy, conexão BD

---

## 🎯 Fluxos Principais

### 1. Usuário Cria Log de Métrica
```
POST /metric-logs
  ↓
metric_log_router.py (salva log)
  ↓
progress_engine.py (calcula tudo)
  ↓
Retorna progresso atualizado
```
**Documentação**: [ARCHITECTURE.md - Fluxo Detalhado](./ARCHITECTURE.md#-fluxo-detalhado-criando-uma-métrica)

### 2. Usuário Completa Goal
```
POST /goals/complete/{goal_id}
  ↓
goal_router.py (marca como completa)
  ↓
progress_engine.py (atualiza progresso)
  ↓
Retorna novo progresso
```

### 3. Gerar Foco Semanal (CAMADA 2)
```
GET /focus/{user_id}
  ↓
focus_service.py (analisa scores)
  ↓
Retorna foco para semana
```

---

## 🔐 Princípios do Design

1. **Centralização**: Toda mudança de progresso passa pela engine
2. **Contexto**: Engine recebe novo_log para cálculos precisos
3. **Sem Duplicação**: Xp/Level/Rank atualizados em um único lugar
4. **Padrão Único**: Todos os services usam mesmo formato
5. **Feedback**: Retorno estruturado com todos os dados

**Leia mais**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📈 Roadmap

### CAMADA 1 ✅
- [x] Engine centralizada
- [x] Formatos padronizados
- [x] Sem duplicação
- [x] Testes de estabilidade

**Status**: Completa - Ver [CAMADA1_IMPLEMENTATION.md](./CAMADA1_IMPLEMENTATION.md)

### CAMADA 2 🔄
- [ ] Foco Semanal
- [ ] Missões Dinâmicas
- [ ] Achievements
- [ ] Dificuldade Adaptativa

**Status**: Planejada - Ver [CAMADA2_PLANO.md](./CAMADA2_PLANO.md)

### CAMADA 3 ⏳
- [ ] Histórico Temporal
- [ ] Dashboard Consolidado

**Status**: Futuro

### CAMADA 4 ⏳
- [ ] Auth Real
- [ ] Temporadas
- [ ] Leaderboards
- [ ] Recomendações

**Status**: Futuro

**Timeline Completa**: [PROJECT_STATUS.md - Deploy & Roadmap](./PROJECT_STATUS.md#-deploy--roadmap)

---

## 🛠️ Guia de Uso

### Iniciante?
1. Leia [README.md](./README.md)
2. Entenda a arquitetura em [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Estude [CAMADA1_IMPLEMENTATION.md](./CAMADA1_IMPLEMENTATION.md)

### Desenvolvedor?
1. Leia [QUICK_DEV_GUIDE.md](./QUICK_DEV_GUIDE.md)
2. Escolha feature em [CAMADA2_PLANO.md](./CAMADA2_PLANO.md)
3. Seguir checklist de desenvolvimento
4. Adicione testes
5. Valide com suite de testes

### Gerente/Product?
1. Leia [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)
2. Entenda timeline em [PROJECT_STATUS.md](./PROJECT_STATUS.md)
3. Acompanhe progresso via testes

---

## 🔍 Buscar por Tópico

### Como...?

#### ...criar um novo endpoint?
1. Ler [QUICK_DEV_GUIDE.md - Passo 5](./QUICK_DEV_GUIDE.md)
2. Criar router em `app/routers/`
3. Adicionar ao `main.py`

#### ...adicionar nova feature de progresso?
1. Ler [QUICK_DEV_GUIDE.md - Como Adicionar Feature](./QUICK_DEV_GUIDE.md#-como-adicionar-uma-feature-exemplo-foco-semanal)
2. Integrar com engine
3. Testar

#### ...entender por que engine é centralizada?
1. Ler [ARCHITECTURE.md - Garantias Críticas](./ARCHITECTURE.md#-garantias-críticas)
2. Ver exemplo em [CAMADA1_IMPLEMENTATION.md - Remoção de Lógica Duplicada](./CAMADA1_IMPLEMENTATION.md#-remoção-de-lógica-duplicada)

#### ...testar uma feature?
1. Ver [test_engine_stability.py](./test_engine_stability.py)
2. Criar arquivo similar para sua feature
3. Rodar: `python test_seu_feature.py`

#### ...debugar um problema?
1. Ler [QUICK_DEV_GUIDE.md - Ferramentas Úteis](./QUICK_DEV_GUIDE.md#-ferramentas-úteis)
2. Adicionar prints em `progress_engine.py`
3. Rodar teste isolado

#### ...fazer progresso avançar?
1. Leia [ARCHITECTURE.md - Data Flow Diagram](./ARCHITECTURE.md#-data-flow-diagram)
2. Veja exemplo em [CAMADA1_IMPLEMENTATION.md - Fluxo](./CAMADA1_IMPLEMENTATION.md#-fluxo-de-atualização-de-progresso)

---

## 📝 Notações Usadas

- ✅ Concluído / Implementado
- 🔄 Em progresso / Planejado
- ⏳ Futuro / Não iniciado
- ❌ Não recomendado / Errado
- ⭐ Importante / Crítico
- 🔐 Segurança / Garantia
- 🎯 Objetivo / Meta
- 🚀 Performance / Otimização

---

## 🗂️ Arquivos Importantes

### Implementação
- `app/services/progress_engine.py` ⭐ - ENGINE CENTRAL
- `app/models/user_progress.py` - Modelo principal
- `app/routers/metric_log_router.py` - Dispara engine

### Documentação
- `README.md` - Start here
- `EXECUTIVE_SUMMARY.md` - O que foi feito
- `ARCHITECTURE.md` - Como funciona
- `QUICK_DEV_GUIDE.md` - Como desenvolver
- `CAMADA1_IMPLEMENTATION.md` - Detalhe técnico
- `CAMADA2_PLANO.md` - Próximos passos
- `PROJECT_STATUS.md` - Timeline e roadmap

### Testes
- `test_engine_stability.py` - Valida CAMADA 1

---

## 🔗 Links Úteis

### Documentação Externa
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Pydantic](https://docs.pydantic.dev/)
- [Python 3.10+ Docs](https://docs.python.org/3.10/)

### Projeto
- [GitHub](https://github.com/seu-usuario/SoloLeveling) *(quando criado)*
- [Trello](https://trello.com/) *(para tarefas)*
- [Figma](https://figma.com/) *(para design)*

---

## 📞 Suporte

### Entender algo?
1. Busque nos documentos acima
2. Veja exemplo em `QUICK_DEV_GUIDE.md`
3. Check [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes

### Erro no código?
1. Veja [QUICK_DEV_GUIDE.md - Erros Comuns](./QUICK_DEV_GUIDE.md#-erros-comuns)
2. Rode testes para validar
3. Adicione prints para debug

### Adicionar feature?
1. Leia [CAMADA2_PLANO.md](./CAMADA2_PLANO.md)
2. Siga [QUICK_DEV_GUIDE.md](./QUICK_DEV_GUIDE.md)
3. Teste com `test_nome.py`

---

## ✨ Última Checagem

Antes de começar a desenvolver:

- [ ] Entendi o princípio central (engine centralizada)
- [ ] Li [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Li [QUICK_DEV_GUIDE.md](./QUICK_DEV_GUIDE.md)
- [ ] Consegui rodar [test_engine_stability.py](./test_engine_stability.py)
- [ ] Entendi o fluxo de progresso
- [ ] Tenho documentação de feature em [CAMADA2_PLANO.md](./CAMADA2_PLANO.md)

Se tudo ✅, você está pronto para desenvolver!

---

**Última atualização**: 2026-02-19  
**Versão da Documentação**: 1.0  
**Status**: Completa para CAMADA 1, Planejada para CAMADA 2+

🚀 **Let's Level Up!**


