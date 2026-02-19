# 📊 Estado do Projeto SoloLeveling

**Data**: 2026-02-19  
**Status**: Em desenvolvimento  
**Fase Atual**: CAMADA 1 ✅ Concluída | CAMADA 2 🔄 Planejada

---

## 🎯 Visão do Projeto

Um **sistema de gamificação adaptativo** que transforma a vida em um RPG, permitindo que usuários:

- 📊 Rastreiem progresso em 5 áreas da vida (Health, Career, Finance, Relationships, Mind)
- 🎮 Ganhem XP, subirem de nível e ascenderem rankings
- 🎯 Recebam missões dinâmicas baseadas em contexto
- 🏆 Desbloqueiem achievements e conquistas
- 📈 Vejam sua evolução ao longo do tempo
- 🤖 Recebam recomendações personalizadas

---

## 📈 Progresso por Camada

### ✅ CAMADA 1 — Estabilidade da Engine (COMPLETA)

**Objetivo**: Garantir que a base do sistema é sólida e centralizada.

**Implementado**:
- ✅ Padronização de formatos entre services
- ✅ Engine recebe novo_log como contexto
- ✅ Remoção de lógica duplicada (XP/Level/Rank centralizados)
- ✅ Modelo `UserProgress` com campos de streak
- ✅ Formato único de retorno: `{"area_scores": [...], "xp": ..., "level": ..., "rank": ...}`
- ✅ Engine é o único "cérebro" que atualiza progresso

**Arquivos Modificados**: 12
- `app/services/progress_engine.py`
- `app/services/scoring_service.py`
- `app/services/mission_service.py`
- `app/services/radar_service.py`
- `app/services/xp_service.py`
- `app/services/focus_service.py`
- `app/routers/metric_log_router.py`
- `app/routers/goal_router.py`
- `app/routers/mission_router.py`
- `app/routers/scoring_router.py`
- `app/models/user_progress.py`
- Documentação: `CAMADA1_IMPLEMENTATION.md`

**Garantias**:
- 🔒 XP nunca é atualizado fora da engine
- 🔒 Level nunca é atualizado fora da engine
- 🔒 Rank nunca é atualizado fora da engine
- 🔒 Formato consistente em toda parte
- 🔒 Engine recebe novo_log para cálculos precisos

---

### 🔄 CAMADA 2 — Inteligência do Sistema (PLANEJADA)

**Objetivo**: Transformar de CRUD para sistema adaptativo.

**A Implementar**:

#### 🎯 4. Foco Semanal Automático
- **Status**: Planejado
- **Escopo**:
  - Detectar área mais fraca automaticamente
  - Criar `UserFocus` model
  - Gerar foco semanal com `generate_weekly_focus()`
  - Aplicar multiplicador de XP (1.5x) ao logar métricas da área focada
  - Endpoint `/focus/{user_id}` para visualizar foco atual
- **Impacto**: Foco do usuário, recompensas maiores, urgência clara
- **Complexidade**: Média
- **Tempo**: ~3-4 horas

#### 🎮 5. Missões Realmente Dinâmicas
- **Status**: Planejado
- **Escopo**:
  - Refatorar `generate_daily_missions()` para receber contexto
  - Implementar `_get_dynamic_missions()` baseado em:
    - Score da área
    - Tendência (growing/declining/stable)
    - Rank atual
    - Streak
    - Se é área focada
  - Adicionar campos `difficulty`, `target_metric_value` ao `DailyMission`
  - Gerar 3-5 missões por dia (vs templates fixos)
- **Impacto**: Missões relevantes, desafiadoras, contextualmente apropriadas
- **Complexidade**: Alta
- **Tempo**: ~5-6 horas

#### 🏆 6. Sistema de Conquistas (Achievements)
- **Status**: Planejado
- **Escopo**:
  - Criar `Achievement` model
  - Implementar `achievement_service.py` com 10+ achievements iniciais
  - Desbloquear automaticamente (streaks, ranks, XP milestones)
  - Recompensar com XP adicional
  - Endpoint para visualizar achievements
- **Impacto**: Gamificação, engajamento contínuo, senso de progresso
- **Complexidade**: Média
- **Tempo**: ~3-4 horas

#### 📊 7. Dificuldade Adaptativa
- **Status**: Planejado
- **Escopo**:
  - Implementar `difficulty_service.py`
  - Analisar velocidade de progresso
  - Ajustar missões se usuário está evoluindo muito rápido/lento
  - Ajustar XP necessário para level
  - Fornecer feedback ao usuário
- **Impacto**: Mantém desafio apropriado, evita frustração/monotonia
- **Complexidade**: Média
- **Tempo**: ~2-3 horas

**Total CAMADA 2**: ~13-17 horas de desenvolvimento

---

### ⏳ CAMADA 3 — Analytics & Visual (FUTURO)

**Objetivo**: Transformar em produto real com dados e visualizações.

**A Implementar**:

#### 📈 8. Histórico Temporal
- Criar `user_progress_history` (snapshots diários)
- Permitir análise de tendências
- Gráficos de evolução

#### 📊 9. Endpoint de Dashboard Consolidado
- Um único endpoint que retorna:
  ```python
  {
    "level": 5,
    "rank": "C",
    "xp": 540,
    "next_level_xp": 700,
    "focus_area": "Health",
    "streak": 6,
    "today_missions": [...],
    "area_scores": [...],
    "radar_data": [...],
    "achievements": [...],
    "trend": "growing"
  }
  ```
- Frontend consome apenas este endpoint

**Tempo**: ~8-10 horas

---

### 🚀 CAMADA 4 — Produto de Verdade (FUTURO)

**Objetivo**: Transformar em SaaS real.

**A Implementar**:

#### 💾 10. Sistema de Usuários Real
- Auth JWT
- Login / Registro
- Proteção de rotas

#### 🧠 11. Sistema de Temporadas
- Reset parcial periódico
- Rankings globais
- Competição saudável

#### 🏆 12. Leaderboard
- Ranking global
- Ranking por área
- Ranking por streak

#### 🤖 13. Recomendação Automática
- Baseado em histórico
- Tendência
- Foco
- Performance semanal

**Tempo**: ~15-20 horas

---

## 📊 Estatísticas do Projeto

### Código
- **Modelos**: 9 existentes + 3 planejados (UserFocus, Achievement, ProgressHistory)
- **Services**: 9 existentes + 3 novos planejados
- **Routers**: 7 existentes + 2 novos planejados
- **Schemas**: 6 existentes
- **Linhas de Código**: ~1.500 LOC (após CAMADA 1)

### Arquitetura
```
app/
├── models/           (Data models)
├── schemas/          (API contracts)
├── services/         (Business logic) ← CENTRALIZADO aqui
├── routers/          (API endpoints)
└── core/
    └── database.py   (ORM setup)
```

**Padrão**: Services como "brains", Routers como "hands"

---

## 🎮 Fluxo de Dados (Visão Completa)

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO CRIA LOG                         │
│                 POST /metric-logs                           │
│            (ex: "Health: 7.5 today")                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  METRIC_LOG_ROUTER                          │
│        - Salva log no BD                                    │
│        - Chama ENGINE com novo_log                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PROGRESS_ENGINE (Cérebro)                      │
│                                                              │
│  1. calculate_area_scores(db, user_id)                     │
│     → [{"area": "Health", "score": 7.5}, ...]             │
│                                                              │
│  2. calculate_life_score(area_scores)                      │
│     → 7.5                                                   │
│                                                              │
│  3. _calculate_xp_gain(new_log, area_scores, progress)     │
│     → 22 (baseado no valor do log)                         │
│     → 33 se for área focada (1.5x multiplicador)           │
│                                                              │
│  4. process_missions(db, user_id)                          │
│     → 0-100 XP de bônus se completou missão               │
│                                                              │
│  5. check_and_unlock_achievements(db, user_id)            │
│     → Verifica streaks, ranks, XP milestones              │
│     → +50 XP por achievement desbloqueado                 │
│                                                              │
│  6. progress.xp += xp_gain + mission_bonus + ach_bonus     │
│  7. progress.level = calculate_level(progress.xp)          │
│  8. progress.rank = calculate_rank(life_score)             │
│  9. progress.current_streak = update_streak(progress)      │
│  10. db.commit() ← ÚNICO LUGAR QUE ATUALIZA!              │
│                                                              │
│  Retorna:                                                    │
│  {                                                          │
│    "area_scores": [...],    ← Para contexto               │
│    "life_score": 7.5,       ← Para rank                    │
│    "xp_gain": 33,           ← Baseado no novo_log         │
│    "mission_bonus": 0,      ← Se completou missão         │
│    "achievement_bonus": 0,  ← Se desbloqueou achievement  │
│    "xp": 575,               ← Total                        │
│    "level": 3,              ← Recalculado                  │
│    "rank": "C",             ← Recalculado                  │
│    "streak": 5,             ← Atualizado                   │
│    "new_achievements": []   ← Se houver novos             │
│  }                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              METRIC_LOG_ROUTER (Retorna)                    │
│                                                              │
│  {                                                          │
│    "metric": {...},           ← O log criado              │
│    "progress": {...}          ← Resultado da engine       │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Integrações Planejadas

### CAMADA 2 Integrações

```
DailyMission ──┐
               ├──> Progress Engine
UserFocus  ────┤
Achievement────┘
```

- **DailyMission**: Variação por contexto + completion tracking
- **UserFocus**: Multiplicador de XP aplicado na engine
- **Achievement**: Check automático e XP reward na engine

---

## 🧪 Testes

### CAMADA 1 Tests (Criado)
- `test_engine_stability.py` - Valida que engine está centralizado

### CAMADA 2 Tests (A Criar)
- `test_focus_system.py` - Valida foco semanal e multiplicador
- `test_dynamic_missions.py` - Valida geração contextual
- `test_achievements.py` - Valida desbloqueio de achievements
- `test_adaptive_difficulty.py` - Valida ajuste de dificuldade

---

## 🚀 Deploy & Roadmap

### Timeline (Estimado)

```
Semana 1:
  ✅ CAMADA 1 (Concluído)
  🔄 Início CAMADA 2 (Foco + Missões Dinâmicas)

Semana 2:
  ✅ CAMADA 2 (Achievements + Dificuldade Adaptativa)
  🔄 Início CAMADA 3 (Histórico + Dashboard)

Semana 3:
  ✅ CAMADA 3 (Visualizações)
  🔄 Testes de carga + Otimizações

Semana 4:
  ✅ CAMADA 4 (Auth + Leaderboard)
  🔄 Beta privado

Semana 5:
  ✅ Beta público
  🔄 Ajustes baseado em feedback
```

---

## 📋 Checklist - Próximos Passos

### Imediato (Hoje)
- [ ] Validar que CAMADA 1 está funcionando (rodar `test_engine_stability.py`)
- [ ] Revisar `CAMADA2_PLANO.md` com todo o detalhe

### Próximas 24h
- [ ] Iniciar implementação de Foco Semanal
  - [ ] Criar `UserFocus` model
  - [ ] Expandir `focus_service.py`
  - [ ] Atualizar progress_engine para aplicar multiplicador
  - [ ] Testar integração

### Próximos 3 dias
- [ ] Implementar Missões Dinâmicas
- [ ] Adicionar Achievements
- [ ] Implementar Dificuldade Adaptativa

---

## 💡 Notas Importantes

1. **Engine é o Cérebro**: Toda lógica de progresso passa por `progress_engine.py`. Isso garante consistência.

2. **Contexto é Chave**: Cada decisão usa contexto real:
   - XP baseado no novo_log (não genérico)
   - Missões baseadas em score, tendência, focus
   - Difficulty baseado em velocidade de progresso

3. **Multiplicadores**: Não são hardcoded, são dinâmicos:
   - Foco semanal → 1.5x XP
   - Difficulty adaptativa → 0.8x-1.2x
   - Achievements → +50 XP

4. **Feedback**: Sistema deve comunicar tudo:
   - Quanto XP ganhou (e por quê)
   - Por que missão é assim
   - Quando achievement foi desbloqueado
   - Se dificuldade mudou

---

## 🎯 Visão Final

Este é um **RPG de vida real** que:

- 📊 Torna métricas em progressão visível
- 🎮 Mantém engajamento contínuo
- 🤖 Se adapta ao usuário
- 📈 Mostra tendências e evolution
- 🏆 Celebra conquistas
- 🎯 Mantém foco claro

**Status**: Base sólida (CAMADA 1) ✅  
**Próximo**: Inteligência (CAMADA 2) 🔄  
**Visão**: Produto real (CAMADA 3+4) 🚀


