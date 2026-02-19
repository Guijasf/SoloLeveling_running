# 🎮 SoloLeveling - RPG de Vida Real

> *Transforme sua vida em um RPG onde você é o herói*

## 📋 O que é?

**SoloLeveling** é um sistema de gamificação adaptativo que transforma o rastreamento de vida em uma experiência RPG completa:

- 🎯 Rastreie progresso em 5 áreas da vida (Saúde, Carreira, Finanças, Relacionamentos, Mentalidade)
- 🎮 Ganhe XP, suba de nível, alcance rankings
- 🎯 Receba missões dinâmicas baseadas em seu contexto
- 🏆 Desbloqueie achievements e conquistas
- 📈 Veja sua evolução em tempo real
- 🤖 Receba recomendações personalizadas

## 🏗️ Arquitetura

### Camadas de Desenvolvimento

```
CAMADA 4 (Futuro)
├─ 💾 Auth Real + JWT
├─ 🧠 Temporadas & Competição
├─ 🏆 Leaderboards Globais
└─ 🤖 Recomendações Automáticas

CAMADA 3 (Futuro)
├─ 📈 Histórico Temporal
└─ 📊 Dashboard Consolidado

CAMADA 2 🔄 (Próximo)
├─ 🎯 Foco Semanal Automático
├─ 🎮 Missões Dinâmicas
├─ 🏆 Achievements
└─ 📊 Dificuldade Adaptativa

CAMADA 1 ✅ (Completa)
├─ 🔒 Engine Centralizada
├─ 📊 Formato Padronizado
├─ 🧠 XP/Level/Rank Unificados
└─ 💾 Banco de Dados Estável
```

## 📊 Status Atual

**CAMADA 1 - Estabilidade da Engine**: ✅ COMPLETA

A base está sólida! Implementamos:

- ✅ Padronização de formatos entre services
- ✅ Progress Engine como "cérebro" centralizado
- ✅ Engine recebe novo_log como contexto
- ✅ Remoção de lógica duplicada
- ✅ Garantia: XP/Level/Rank APENAS na engine
- ✅ Formato único de retorno padronizado

## 🚀 Quick Start

### 1. Setup do Banco de Dados

```bash
cd SoloLeveling
python app/core/database.py
```

### 2. Rodar a API

```bash
uvicorn app.main:app --reload
```

### 3. Criar um Usuário

```bash
POST http://localhost:8000/users
{
    "name": "Seu Nome",
    "email": "seu@email.com"
}
```

### 4. Criar Áreas de Vida

```bash
POST http://localhost:8000/life-areas
{
    "user_id": 1,
    "name": "Health"
}
```

### 5. Logar uma Métrica (Dispara a Engine!)

```bash
POST http://localhost:8000/metric-logs
{
    "user_id": 1,
    "metric_type_id": 1,
    "value": 8.5,
    "log_date": "2026-02-19"
}
```

**Resposta** (Progresso calculado pela engine):

```json
{
    "metric": {...},
    "progress": {
        "area_scores": [{"area": "Health", "score": 8.5}],
        "life_score": 8.5,
        "xp_gain": 25,
        "mission_bonus": 0,
        "xp": 25,
        "level": 1,
        "rank": "D",
        "streak": 1
    }
}
```

## 📁 Estrutura do Projeto

```
SoloLeveling/
├── app/
│   ├── models/              (Data models - BD)
│   │   ├── user.py
│   │   ├── user_progress.py
│   │   ├── metric_log.py
│   │   ├── daily_mission.py
│   │   ├── life_area.py
│   │   └── ...
│   │
│   ├── services/            (Business logic - O Cérebro)
│   │   ├── progress_engine.py      ⭐ ENGINE CENTRAL
│   │   ├── scoring_service.py
│   │   ├── mission_service.py
│   │   ├── focus_service.py
│   │   ├── achievement_service.py  (Planejado)
│   │   ├── level_system.py
│   │   ├── rank_service.py
│   │   └── ...
│   │
│   ├── routers/             (API endpoints)
│   │   ├── user_router.py
│   │   ├── metric_log_router.py
│   │   ├── goal_router.py
│   │   ├── mission_router.py
│   │   └── ...
│   │
│   ├── schemas/             (Validação de dados)
│   │   ├── user_schema.py
│   │   ├── metric_log_schema.py
│   │   └── ...
│   │
│   └── core/
│       └── database.py      (Configuração ORM)
│
├── frontend/                (HTML/CSS/JS - Futuro)
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
│
├── CAMADA1_IMPLEMENTATION.md (Documentação da base)
├── CAMADA2_PLANO.md          (Plano da próxima fase)
├── PROJECT_STATUS.md         (Status completo)
└── test_engine_stability.py  (Testes)
```

## 🧠 Como Funciona

### O Fluxo Principal

```
1. Usuário cria LOG de métrica
   ↓
2. metric_log_router salva no BD
   ↓
3. Chama ENGINE com novo_log
   ↓
4. ENGINE (cérebro) faz:
   - Calcula scores por área
   - Calcula life_score
   - Calcula XP ganho (baseado no novo_log)
   - Aplica multiplicadores (foco, achievements)
   - Atualiza level e rank
   - COMMITA no BD
   ↓
5. Retorna progresso atualizado para o usuário
   ↓
6. Frontend mostra nova pontuação
```

### Garantias Críticas

🔒 **XP NUNCA** é atualizado fora de `progress_engine.py`  
🔒 **Level NUNCA** é atualizado fora de `progress_engine.py`  
🔒 **Rank NUNCA** é atualizado fora de `progress_engine.py`  

Isso garante **consistência total** do sistema.

## 📊 Endpoints Principais

### Score & Progresso
- `GET /score/{user_id}` - Scores das áreas, life_score, rank
- `GET /progress/{user_id}` - XP, level, streak (futuro)

### Missões
- `GET /missions/{user_id}` - Missões diárias (gera automático)
- `POST /missions/{mission_id}/complete` - Marca como completa

### Métricas
- `POST /metric-logs` - Cria log (dispara engine!)
- `GET /metric-logs` - Lista logs do usuário

### Goals
- `POST /goals` - Cria goal
- `POST /goals/complete/{goal_id}` - Completa goal (usa engine)

### Foco (Planejado)
- `GET /focus/{user_id}` - Foco semanal atual
- `POST /focus/{user_id}/reset` - Reset manual

### Achievements (Planejado)
- `GET /achievements/{user_id}` - Lista achievements desbloqueados

## 🎯 Padrões de Código

### Services são o "Cérebro"
- Toda lógica de negócio fica em `services/`
- Sem "if" complexo em routers
- Reutilizável por múltiplos routers

### Routers são as "Mãos"
- Recebem requisição
- Chamam service apropriado
- Retornam resposta
- Sem lógica complexa

### Engine é Soberano
- Único responsável por estados críticos (XP/Level/Rank)
- Recebe contexto completo (novo_log)
- Realiza todas as cálculos
- Commita BD uma única vez

## 🧪 Testes

### Testes de Estabilidade da Engine

```bash
python test_engine_stability.py
```

Valida que:
- ✅ Formato é padronizado
- ✅ Engine recebe novo_log
- ✅ Sem lógica duplicada
- ✅ Retorno é estruturado

## 📚 Documentação

- **[CAMADA1_IMPLEMENTATION.md](./CAMADA1_IMPLEMENTATION.md)** - Detalhes da implementação da base (✅ Completa)
- **[CAMADA2_PLANO.md](./CAMADA2_PLANO.md)** - Plano detalhado da próxima fase (🔄 Próximo)
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Status completo do projeto

## 🎮 Exemplos de Uso

### Exemplo 1: Logar métrica de saúde

```python
# Usuário fez exercício hoje e achou que foi 8/10

POST /metric-logs
{
    "user_id": 1,
    "metric_type_id": 1,  # Exercise
    "value": 8.0,
    "log_date": "2026-02-19"
}

# RESPOSTA (calculada pela engine):
{
    "progress": {
        "area_scores": [
            {"area": "Health", "score": 8.0}
        ],
        "life_score": 8.0,
        "xp_gain": 24,  # Baseado no valor 8.0
        "xp": 24,
        "level": 1,
        "rank": "D",
        "streak": 1
    }
}
```

### Exemplo 2: Com Foco Semanal (quando implementado)

```python
# Se usuário está focando em "Health" esta semana
# (multiplicador 1.5x)

POST /metric-logs
{
    "user_id": 1,
    "metric_type_id": 1,
    "value": 8.0,
    "log_date": "2026-02-19"
}

# RESPOSTA:
{
    "progress": {
        "xp_gain": 36,  # 24 * 1.5 (multiplicador de foco!)
        "xp": 36,
        ...
    }
}
```

### Exemplo 3: Completar Goal

```python
POST /goals/complete/1

# RESPOSTA:
{
    "mensagem": "Meta concluida com sucesso!",
    "user_level": 1,
    "user_xp": 36,
    "xp_gained": 50  # Goal reward
}
```

## 🔮 Roadmap

### CAMADA 2 (Próximo - ~2-3 semanas)
- [ ] Foco Semanal Automático com multiplicador
- [ ] Missões Dinâmicas (não templates)
- [ ] Sistema de Achievements
- [ ] Dificuldade Adaptativa

### CAMADA 3 (~2-3 semanas depois)
- [ ] Histórico Temporal
- [ ] Dashboard Consolidado
- [ ] Gráficos de Evolução

### CAMADA 4 (~3-4 semanas depois)
- [ ] Auth Real (JWT)
- [ ] Sistema de Temporadas
- [ ] Leaderboards
- [ ] Recomendações Automáticas

## 💡 Princípios de Design

1. **Consistência**: Tudo passa pela engine
2. **Contexto**: Decisões baseadas em dados reais
3. **Feedback**: Usuário sabe por quê progrediu
4. **Adaptabilidade**: Sistema se ajusta ao usuário
5. **Celebração**: Achievements e milestones são recompensados

## 🤝 Contribuindo

Para contribuir:

1. Entenda a arquitetura (engine centralizada)
2. Leia o documento da CAMADA relevante
3. Escreva testes primeiro
4. Implemente a feature
5. Valide com testes
6. Faça PR com explicação

## 📝 Notas

- **Banco de Dados**: SQLite (fácil de testar)
- **Framework**: FastAPI (rápido, moderno)
- **ORM**: SQLAlchemy (poderoso)
- **Python**: 3.10+

## 🎯 Próximos Passos Imediatos

1. ✅ Validar CAMADA 1 com testes
2. 🔄 Implementar Foco Semanal (CAMADA 2, parte 1)
3. 🔄 Implementar Missões Dinâmicas (CAMADA 2, parte 2)
4. 🔄 Adicionar Achievements (CAMADA 2, parte 3)

---

**Criado em**: 2026-02-19  
**Status**: Em Desenvolvimento Ativo  
**Versão**: 0.1.0 (CAMADA 1 - Base Estável)

🎮 **Let's Level Up!** 🚀

