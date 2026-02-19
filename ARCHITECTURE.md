# 🏗️ Arquitetura Detalhada - SoloLeveling

## 📐 Visão Geral da Arquitetura

```
┌──────────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                    │
│                   (HTML/CSS/JS - Futuro)                            │
│                      dashboard.html                                  │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTP Requests
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        FAST API                                      │
│                     (API REST)                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ROUTERS (Recebem requisições, chamam services)               │ │
│  │  ├─ user_router.py                                            │ │
│  │  ├─ metric_log_router.py                ← DISPARA ENGINE      │ │
│  │  ├─ mission_router.py                                         │ │
│  │  ├─ goal_router.py                     ← DISPARA ENGINE      │ │
│  │  ├─ scoring_router.py                                         │ │
│  │  └─ ...                                                        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                            │                                         │
│                            ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  SERVICES (Business Logic)                                    │ │
│  │                                                                │ │
│  │  ⭐ progress_engine.py (CÉREBRO CENTRAL)                     │ │
│  │     ├─ Calcula area_scores                                   │ │
│  │     ├─ Calcula life_score                                    │ │
│  │     ├─ Calcula XP ganho                                      │ │
│  │     ├─ Aplica multiplicadores                                │ │
│  │     ├─ Atualiza Level, Rank, Streak                          │ │
│  │     ├─ Commita BD (ÚNICO LUGAR!)                             │ │
│  │     └─ Retorna progresso atualizado                          │ │
│  │                                                                │ │
│  │  Utilitários (chamados pela engine):                          │ │
│  │  ├─ scoring_service.py                                       │ │
│  │  │   ├─ calculate_area_scores()                              │ │
│  │  │   ├─ calculate_life_score()                               │ │
│  │  │   ├─ find_weakest_area()                                  │ │
│  │  │   └─ calculate_trend()                                    │ │
│  │  │                                                            │ │
│  │  ├─ mission_service.py                                       │ │
│  │  │   ├─ generate_dynamic_missions()                          │ │
│  │  │   └─ process_missions()                                   │ │
│  │  │                                                            │ │
│  │  ├─ level_system.py                                          │ │
│  │  │   └─ calculate_level(xp)                                  │ │
│  │  │                                                            │ │
│  │  ├─ rank_service.py                                          │ │
│  │  │   └─ calculate_rank(life_score)                           │ │
│  │  │                                                            │ │
│  │  ├─ streak_service.py                                        │ │
│  │  │   └─ update_streak(progress)                              │ │
│  │  │                                                            │ │
│  │  ├─ focus_service.py (CAMADA 2)                             │ │
│  │  │   ├─ generate_weekly_focus()                              │ │
│  │  │   └─ get_xp_multiplier()                                  │ │
│  │  │                                                            │ │
│  │  └─ achievement_service.py (CAMADA 2)                       │ │
│  │      └─ check_and_unlock_achievements()                      │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    SQLALCHEMY ORM                                    │
│                   (Data Abstraction)                                │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      SQLITE DATABASE                                │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  TABELAS                                                       │ │
│  │  ├─ users                 (ID, name, email)                   │ │
│  │  ├─ user_progress         (ID, user_id, xp, level, rank)     │ │
│  │  ├─ metric_types          (ID, user_id, life_area_id, name)  │ │
│  │  ├─ metric_logs           (ID, user_id, metric_type_id, ...) │ │
│  │  ├─ life_areas            (ID, user_id, name)                │ │
│  │  ├─ daily_missions        (ID, user_id, title, ...)          │ │
│  │  ├─ goals                 (ID, user_id, title, completed)    │ │
│  │  ├─ user_focus (CAMADA 2) (ID, user_id, area, multiplier)   │ │
│  │  └─ achievements (CAMADA 2)(ID, user_id, type, unlocked_at) │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo Detalhado: Criando uma Métrica

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CLIENTE CRIA MÉTRICA                                         │
│    POST /metric-logs                                            │
│    {                                                            │
│        "user_id": 1,                                           │
│        "metric_type_id": 5,                                    │
│        "value": 8.5,        ← Valor que o usuário entrou      │
│        "log_date": "2026-02-19"                                │
│    }                                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. METRIC_LOG_ROUTER                                            │
│    @router.post("/")                                            │
│    def create_log(log: MetricLogCreate, db: Session):           │
│        # Salva o log no BD                                     │
│        new_log = MetricLog(**log.model_dump())                 │
│        db.add(new_log)                                         │
│        db.commit()                                              │
│        db.refresh(new_log)  ← new_log agora tem ID             │
│                                                                 │
│        # CHAMA A ENGINE COM CONTEXTO                           │
│        result = process_user_progress(db, log.user_id, new_log)│
│                            ↑                          ↑         │
│                     BD connection        NOVO LOG COMO CONTEXTO│
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. PROGRESS_ENGINE (O Cérebro)                                 │
│    def process_user_progress(db, user_id, new_log):            │
│                                                                 │
│    ✅ PASSO 1: Calcular scores por área                       │
│       area_scores = calculate_area_scores(db, user_id)         │
│       → [{"area": "Health", "score": 8.5}, ...]               │
│                                                                 │
│    ✅ PASSO 2: Calcular life_score                            │
│       life_score = calculate_life_score(area_scores)           │
│       → 8.5 (se só tem uma área)                              │
│                                                                 │
│    ✅ PASSO 3: Buscar ou criar UserProgress                   │
│       progress = db.query(UserProgress).filter(                │
│           UserProgress.user_id == user_id                      │
│       ).first()                                                 │
│       → Objeto com: xp, level, rank, streak                    │
│                                                                 │
│    ✅ PASSO 4: Atualizar streak                               │
│       update_streak(progress)                                  │
│       → Se log_date == hoje e streak_date != hoje → streak+1  │
│                                                                 │
│    ✅ PASSO 5: Calcular XP GANHO (NOVO!)                      │
│       xp_gain = _calculate_xp_gain(new_log, area_scores, ...) │
│       → Baseado no valor do novo_log: 8.5 * 3 = 25.5 XP      │
│                                                                 │
│       (Se houver foco semanal, multiplicador aplicado aqui)    │
│       → 25.5 * 1.5 = 38.25 XP (com foco)                      │
│                                                                 │
│    ✅ PASSO 6: Processar missões completadas                 │
│       mission_bonus = process_missions(db, user_id)           │
│       → Se alguma missão foi completada: +50 XP               │
│       → Senão: 0 XP                                           │
│                                                                 │
│    ✅ PASSO 7: Verificar achievements desbloqueados           │
│       new_achievements = check_and_unlock_achievements(...)    │
│       → Se streak atingiu 7: +100 XP                          │
│       → Se XP atingiu 1000: +100 XP                           │
│                                                                 │
│    ✅ PASSO 8: Somar tudo                                    │
│       progress.xp += (xp_gain + mission_bonus + ach_bonus)    │
│       → progress.xp = 150 + 0 + 0 = 150                       │
│                                                                 │
│    ✅ PASSO 9: Recalcular Level                               │
│       progress.level = calculate_level(progress.xp)            │
│       → level = (150 / 100) ^ 0.5 + 1 = 2                     │
│                                                                 │
│    ✅ PASSO 10: Recalcular Rank                               │
│       progress.rank = calculate_rank(life_score)               │
│       → Se life_score=8.5 → rank="D" (≤20)                    │
│                                                                 │
│    ✅ PASSO 11: COMMITAR NO BD (ÚNICO LUGAR!)                 │
│       db.commit()                                              │
│       ↑↑↑ Sem dúvida, toda mudança passa por aqui            │
│                                                                 │
│    ✅ PASSO 12: Retornar resultado                            │
│       return {                                                 │
│           "area_scores": [...],                                │
│           "life_score": 8.5,                                   │
│           "xp_gain": 25,                                       │
│           "mission_bonus": 0,                                  │
│           "xp": 150,                                           │
│           "level": 2,                                          │
│           "rank": "D",                                         │
│           "streak": 1                                          │
│       }                                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. METRIC_LOG_ROUTER (Retorna resultado)                       │
│    return {                                                     │
│        "metric": {                                              │
│            "id": 42,                                            │
│            "user_id": 1,                                        │
│            "metric_type_id": 5,                                │
│            "value": 8.5,                                        │
│            "log_date": "2026-02-19"                             │
│        },                                                       │
│        "progress": {        ← Resultado da engine              │
│            "area_scores": [{"area": "Health", "score": 8.5}], │
│            "life_score": 8.5,                                  │
│            "xp_gain": 25,                                      │
│            "mission_bonus": 0,                                 │
│            "xp": 150,                                          │
│            "level": 2,                                         │
│            "rank": "D",                                        │
│            "streak": 1                                         │
│        }                                                        │
│    }                                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. CLIENTE RECEBE RESPOSTA                                      │
│    Status 200 OK                                                │
│    Body: {...resultado acima...}                               │
│                                                                 │
│    Frontend pode agora:                                        │
│    ✅ Mostrar novo XP (150)                                   │
│    ✅ Mostrar novo Level (2)                                  │
│    ✅ Mostrar novo Rank (D)                                   │
│    ✅ Mostrar Streak (1)                                      │
│    ✅ Animar transição de level                               │
│    ✅ Celebrar progresso                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Garantias Críticas

### Invariante 1: XP é Apenas Atualizado na Engine

```python
# ❌ NUNCA FAÇA ISSO:
# goal_router.py
progress.xp += 50  # ERRADO!

# ✅ SEMPRE FAÇA ISSO:
# goal_router.py
result = process_user_progress(db, user_id)
# Engine atualiza tudo internamente
```

### Invariante 2: Toda Mudança passa por BD Commit na Engine

```python
# ❌ NUNCA:
# router qualquer
progress.xp = 100
# db.commit() aqui ← ERRADO!

# ✅ SEMPRE:
# progress_engine.py
progress.xp = 100
db.commit()  # ÚNICO lugar
return result
```

### Invariante 3: Engine Sempre Recebe Contexto Completo

```python
# ❌ ANTES:
# progress_engine.py
def process_user_progress(db, user_id):
    # Não sabe o que causou a mudança
    xp_gain = generic_calculation()

# ✅ DEPOIS:
# progress_engine.py
def process_user_progress(db, user_id, new_log=None):
    # Sabe exatamente o contexto
    xp_gain = _calculate_xp_gain(new_log, ...)
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Usuário   │
│   Cria Log  │
└──────┬──────┘
       │ value=8.5
       ▼
┌──────────────────┐
│  Validação       │
│  (Schema)        │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────────┐
│  metric_log_router.py            │
│  - Salva no BD                   │
│  - Chama engine(new_log)         │
└──────┬───────────────────────────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
  ┌─────────┐  ┌──────────────┐
  │ scoring │  │ streak_service
  │ service │  └──────────────┘
  └────┬────┘
       │
       ├───────────────┐
       │               │
       ▼               ▼
    ┌─────────┐  ┌─────────────┐
    │ level   │  │ rank_service│
    │ system  │  └─────────────┘
    └────┬────┘
         │
         ▼
    ┌──────────────────┐
    │ progress_engine  │
    │ (Calcula tudo)   │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │  DB COMMIT       │
    │  (ÚNICO LUGAR!)  │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │  Retorna para    │
    │  router          │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │  Cliente recebe  │
    │  resultado       │
    └──────────────────┘
```

---

## 🧩 Componentes Chave

### 1. Progress Engine ⭐

**Responsabilidade**: ÚNICA - Calcular e atualizar progresso

```python
def process_user_progress(db: Session, user_id: int, new_log=None):
    """
    O único lugar que:
    1. Calcula XP baseado em novo_log
    2. Atualiza level
    3. Atualiza rank
    4. Atualiza streak
    5. Commita no BD
    """
```

**Entrada**: `db`, `user_id`, `new_log` (contexto)  
**Saída**: `{"xp": ..., "level": ..., "rank": ..., ...}`

### 2. Scoring Service

**Responsabilidade**: Calcular scores (sem side effects)

```python
def calculate_area_scores(db, user_id) → [{"area": "...", "score": ...}]
def calculate_life_score(area_scores) → float
def find_weakest_area(area_scores) → {"area": "...", "score": ...}
```

### 3. Mission Service

**Responsabilidade**: Gerar/processar missões

```python
def generate_daily_missions(db, user_id, context)
def process_missions(db, user_id) → bonus_xp
```

### 4. Level/Rank/Streak Services

**Responsabilidade**: Cálculos específicos (sem estado)

```python
def calculate_level(xp) → int
def calculate_rank(life_score) → str
def update_streak(progress) → None (modifica in-place)
```

---

## 🎯 Regra de Ouro

> **Toda ação do usuário que afeta progresso DEVE passar pela Progress Engine!**

```
Métrica criada?   → engine
Goal completada?  → engine
Focus atualizado? → engine
Achievement?      → engine

NUNCA atualizar XP/Level/Rank fora da engine.
```

---

## 🔍 Validações

### Input Validation (Schema Level)

```python
class MetricLogCreate(BaseModel):
    user_id: int
    metric_type_id: int
    value: float  # 0-10
    log_date: date
    
    @validator('value')
    def validate_value(cls, v):
        if not 0 <= v <= 10:
            raise ValueError('value must be 0-10')
        return v
```

### Business Logic Validation (Engine Level)

```python
def process_user_progress(db, user_id, new_log):
    # Validar que user existe
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    
    # Validar que progress foi criado
    progress = db.query(UserProgress)...
    if not progress:
        # Criar
        progress = UserProgress(user_id=user_id)
```

---

## 📈 Evolução Planejada

```
CAMADA 1 (Base)          ✅
├─ Engine centralizada
├─ Formatos padronizados
└─ Sem duplicação

CAMADA 2 (Inteligência)  🔄
├─ Foco semanal
├─ Missões dinâmicas
├─ Achievements
└─ Dificuldade adaptativa

CAMADA 3 (Analytics)     ⏳
├─ Histórico temporal
├─ Dashboard unificado
└─ Gráficos/tendências

CAMADA 4 (Produto)       ⏳
├─ Auth real
├─ Temporadas
├─ Leaderboards
└─ Recomendações
```


