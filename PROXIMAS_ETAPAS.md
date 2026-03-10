# 🚀 Próximas Etapas - Integração Frontend-Backend

## ✅ Já Implementado

- [x] Backend: modelos, calculadores, gamificação
- [x] Backend: routers com CRUD completo
- [x] Backend: integração no main.py
- [x] Database: modelos registrados para criar tabelas
- [x] Frontend: goals.html com interface adaptável

---

## 🔄 Próximos Passos

### 1️⃣ Iniciar Backend (se não estiver rodando)

```bash
# Do terminal na pasta SoloLeveling
python -m uvicorn app.main:app --reload --port 8000
```

**Validar:** http://localhost:8000/docs (Swagger)

### 2️⃣ Testar Endpoints da API

```bash
# Criar uma meta diária
curl -X POST http://localhost:8000/api/goals/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ler 15 páginas por dia",
    "type": "daily",
    "unit": "páginas",
    "target_value": 15,
    "start_date": "2026-03-10",
    "end_date": "2026-03-17",
    "period": "day"
  }'

# Ver resposta com ID criado (ex: 1)
# Usar esse ID nos próximos comandos
```

### 3️⃣ Atualizar Frontend (`frontend-react/public/goals.html`)

Adicionar função para sincronizar com API:

```javascript
// Adicionar no topo do arquivo
const API_BASE_URL = 'http://localhost:8000/api';

// Carregar metas do backend em vez de localStorage
async function loadGoalsFromBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/goals`);
    const data = await response.json();
    
    goals = data.map(item => item.goal);
    registries = {};
    
    data.forEach(item => {
      registries[item.goal.id] = item.goal.registries || [];
    });
    
    renderGoals();
  } catch (error) {
    console.error('Erro ao carregar metas:', error);
    // Fallback para localStorage se API falhar
    loadGoalsLocally();
  }
}

// Registrar progresso no backend
async function registerProgressBackend(goalId, date, value, note = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}/registries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, value, note })
    });
    
    const data = await response.json();
    
    // Atualizar calculador frontend (precisa obj.goal.registries atualizado)
    if (!registries[goalId]) registries[goalId] = [];
    const existing = registries[goalId].find(r => r.date === date);
    if (existing) {
      existing.value = value;
      existing.note = note;
    } else {
      registries[goalId].push({ date, value, note });
    }
    
    renderGoals();
    return data;
  } catch (error) {
    console.error('Erro ao registrar progresso:', error);
    throw error;
  }
}

// Alterar loadGoals() existente para:
function loadGoals() {
  // Tentar backend primeiro
  if (navigator.onLine) {
    loadGoalsFromBackend();
  } else {
    // Modo offline: usar localStorage
    loadGoalsLocally();
  }
}
```

### 4️⃣ Validar Fluxo Completo

```
✅ Backend rodando
  ↓
✅ Frontend carrega metas do /api/goals
  ↓
✅ Usuário registra progresso
  ↓
✅ POST /api/goals/{id}/registries
  ↓
✅ Backend calcula progresso com CalculatorFactory
  ↓
✅ Response com progress, achievements, xp_earned
  ↓
✅ Frontend renderiza dados dinamicamente
```

### 5️⃣ Testar Cada Tipo

**Teste todas as 4 metas com os calculadores:**

#### Daily (Ler 15 pág/dia)
```javascript
// Dia 1: registra 18
registerProgressBackend(1, "2026-03-10", 18, "Comedia");

// Dia 2: registra 12 (quebra streak)
registerProgressBackend(1, "2026-03-11", 12, "Drama");

// Expectativa: 
// - progress: 25%
// - completed_days: 1
// - current_streak: 0 (quebrado)
```

#### Frequency (Treinar 4x/semana)
```javascript
// Semana 1
registerProgressBackend(2, "2026-03-10", 1, "Segunda");
registerProgressBackend(2, "2026-03-12", 1, "Quarta");
registerProgressBackend(2, "2026-03-14", 1, "Sexta");
registerProgressBackend(2, "2026-03-15", 1, "Sábado");

// Expectativa:
// - progress: 100%
// - this_period_count: 4
// - days_until_reset: 0-6 dias
```

#### Cumulative (Correr 50km/mês)
```javascript
registerProgressBackend(3, "2026-03-10", 10, "Manhã");
registerProgressBackend(3, "2026-03-11", 12, "Manhã");
registerProgressBackend(3, "2026-03-12", 8, "Noturno");

// Expectativa:
// - progress: 60%
// - total_accumulated: 30
// - on_track: true/false
// - projected_end: data estimada
```

#### Milestone (Supino 150kg)
```javascript
registerProgressBackend(4, "2026-03-10", 140, "Série 1");
registerProgressBackend(4, "2026-03-12", 148, "Série 2");

// Expectativa:
// - progress: 98.6%
// - current_value: 148
// - improved: true
// - improvement: +8kg
```

---

## 🎯 Checklist de Conclusão

- [ ] Backend rodando sem erros
- [ ] Criar meta via POST /api/goals/
- [ ] Registrar progresso via POST /api/goals/{id}/registries
- [ ] Verificar cálculo de progresso no response
- [ ] Verificar achievements desbloqueados
- [ ] Frontend integrado com API
- [ ] localStorage fallback em caso de offline
- [ ] 4 tipos funcionando corretamente
- [ ] XP sendo calculado corretamente
- [ ] Gamificação funcionando

---

## 📊 Verificar Banco de Dados

```bash
# Abrir SQLite
sqlite3 solo_leveling.db

# Ver tabelas criadas
.tables

# Ver estrutura da tabela adaptive_goals
.schema adaptive_goals

# Ver dados
SELECT * FROM adaptive_goals;
SELECT * FROM goal_registries;
```

---

## 🚨 Possíveis Erros & Soluções

### Erro: "ModuleNotFoundError: No module named 'app.models.goal_adaptive'"
**Solução:** Certifique que `app/models/goal_adaptive.py` existe

### Erro: "sqlalchemy.exc.OperationalError: no such table: adaptive_goals"
**Solução:** Execute `Base.metadata.create_all(bind=engine)` no terminal
```python
from app.core.database import engine, Base
from app.models.goal_adaptive import *
Base.metadata.create_all(bind=engine)
```

### Erro: CORS no fetch do frontend
**Solução:** main.py já tem CORS habilitado com `allow_origins=["*"]`

### Erro: "TypeError: Object of type date is not JSON serializable"
**Solução:** Garantir que schemas usam `datetime` não `date`

---

## 💡 Melhorias Opcionais

1. **Migrar localStorage para API**
   - Sincronizar metas antigas para banco
   - Deletar localStorage depois

2. **Autenticação Real**
   - Substituir hardcoded `user_id=1` com token JWT

3. **Notificações**
   - Avisar quando streak quebrar
   - Reminder quando próximo reset

4. **Gráficos**
   - Evolução do XP
   - Histórico de valores
   - Taxa de conclusão

5. **Analytics**
   - Quais metas mais frequentes
   - Melhor tipo de meta pra esse usuário
   - Predição de sucesso

---

## 📞 Resumo Técnico

| Componente | Localização | Status |
|---|---|---|
| Modelos | `app/models/goal_adaptive.py` | ✅ Pronto |
| Calculadores | `app/services/goal_calculator.py` | ✅ Pronto |
| Gamificação | `app/services/gamification_service.py` | ✅ Pronto |
| Schemas | `app/schemas/adaptive_goal_schema.py` | ✅ Pronto |
| Routers | `app/routers/adaptive_goals_router.py` | ✅ Pronto |
| Database | `app/core/database.py` | ✅ Pronto (c/ imports) |
| Main | `app/main.py` | ✅ Pronto (integrado) |
| Frontend | `frontend-react/public/goals.html` | ✅ Pronto (sem API) |

**Próximo:** Integrar frontend com API dos endpoints `/api/goals/*`

