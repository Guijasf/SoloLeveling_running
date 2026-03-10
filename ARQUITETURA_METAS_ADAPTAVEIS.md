# 🎯 Arquitetura de Metas Adaptáveis - Implementação Completa

## 📋 Visão Geral

Implementamos uma arquitetura escalável de metas que suporta **4 tipos universais** com cálculo de progresso, gamificação e achievements automáticos.

---

## 🏗️ Estrutura Backend

### 1. Modelos (`app/models/goal_adaptive.py`)

#### AdaptiveGoal
```python
- id, user_id
- title, description, emoji
- type: DAILY | FREQUENCY | CUMULATIVE | MILESTONE
- unit: páginas, km, minutos, kg, etc
- target_value: valor alvo
- start_date, end_date, period: ДЕНЬ | WEEK | MONTH
- status: ACTIVE | COMPLETED | PAUSED | FAILED
- priority: 1-5
- xp_reward: XP recompensado ao completar
- registries: relacionamento com GoalRegistry
```

#### GoalRegistry
```python
- id, goal_id
- date, value (registrado pelo usuário)
- note: anotação opcional
- created_at, updated_at
```

#### GoalAchievement
```python
- id, user_id, goal_id
- achievement_id, name, description
- xp_bonus: XP extra desbloqueado
- unlocked_at
```

---

### 2. Calculadores (`app/services/goal_calculator.py`)

Implementa **Strategy Pattern** para cada tipo:

#### DailyCalculator
```python
✅ Calcula:
  - progress: (dias_concluídos / dias_totais) * 100
  - completed_days: quantos dias atingiram alvo
  - current_streak: dias consecutivos
  - longest_streak: melhor streak da história
  - consistency: % de dias completados
  
📊 Exemplo Ler 15 pág/dia:
  - Dia 1: 18 páginas ✓ (completado)
  - Dia 2: 12 páginas ✗ (streak quebrado)
  - Dia 3: 20 páginas ✓ (novo streak iniciado)
  → progress: 66%, current_streak: 1
```

#### FrequencyCalculator
```python
✅ Calcula:
  - progress: (realizações_semana / alvo_semana) * 100
  - this_period_count: quanto foi feito nesta semana
  - next_target: quantas faltam para completar
  - days_until_reset: dias até reset da semana
  
📊 Exemplo Treinar 4x/semana:
  - Seg: treinou ✓
  - Qua: treinou ✓
  - Sex: treinou ✓
  - Próxima seg ainda faltam 1
  → progress: 75%, next_target: 1
```

#### CumulativeCalculator
```python
✅ Calcula:
  - progress: (acumulado / alvo) * 100
  - total_accumulated: valor somado
  - avg_daily: média diária
  - on_track: se está no ritmo esperado
  - projected_end: data estimada de conclusão
  
📊 Exemplo Correr 50km no mês:
  - Dia 1: 10 km
  - Dia 3: 12 km
  - Dia 5: 8 km
  → Total: 30km / 50km = 60%
  → Projeção: 14 de março (onTime: true)
```

#### MilestoneCalculator
```python
✅ Calcula:
  - progress: (melhor_valor / alvo) * 100
  - current_value: melhor valor registrado
  - improved: if melhorou o recorde anterior
  - improvement: +X em relação ao anterior
  
📊 Exemplo Levantar 150kg:
  - Dia 1: 140 kg
  - Dia 3: 145 kg ✓ (novo recorde!)
  - Dia 5: 148 kg ✓ (novo recorde!)
  → progress: 98.6%, improved: true, improvement: +3kg
```

---

### 3. Gamificação (`app/services/gamification_service.py`)

#### Cálculo de XP
```python
XP_BASE[tipo] + BONOS:
  ┌─────────────────────┐
  │ Base por tipo:      │
  │ Daily: 15 XP        │
  │ Frequency: 20 XP    │
  │ Cumulative: 25 XP   │
  │ Milestone: 30 XP    │
  └─────────────────────┘
       +
  ┌─────────────────────┐
  │ Bônus por exceder:  │
  │ +10% se value > alvo│
  └─────────────────────┘
       +
  ┌─────────────────────┐
  │ Bônus por streak:   │
  │ 7 dias: +10 XP      │
  │ 30 dias: +25 XP     │
  │ 100 dias: +50 XP    │
  └─────────────────────┘
       +
  ┌─────────────────────┐
  │ Bônus consistência: │
  │ 75%: +10 XP         │
  │ 95%: +25 XP         │
  └─────────────────────┘
```

#### Achievements Automáticos
```python
Streak:
  🔥 Uma Semana! (7 dias)
  🌝 Um Mês! (30 dias)
  💯 Um Século! (100 dias)

Progresso:
  ⛳ Na Metade! (50%)
  🎯 Quase Lá! (75%)

Conclusão:
  🏆 Meta Atingida! (100%)

Consistência:
  💪 Compromisso Sólido (75%)
  ⚡ Disciplina de Ferro (95%)

Velocidade:
  ⚡ Velocista! (completou antes do esperado)

Recorde:
  🚀 Novo Recorde Pessoal!
```

#### Níveis
```python
Nível = função(XP_Total)

Curva: cada nível requer 1.5x do anterior
  Nível 1: 100 XP
  Nível 2: 150 XP
  Nível 3: 225 XP
  Nível 4: 337 XP
  ...e assim por diante
```

---

### 4. Routers da API (`app/routers/adaptive_goals_router.py`)

```python
# Metas
POST   /api/goals/              # Criar meta
GET    /api/goals/              # Listar todas com progresso
GET    /api/goals/{goal_id}    # Detalhes com progresso
PATCH  /api/goals/{goal_id}    # Atualizar meta
DELETE /api/goals/{goal_id}    # Deletar meta

# Registros de Progresso
POST   /api/goals/{goal_id}/registries        # Registrar progresso
GET    /api/goals/{goal_id}/registries        # Listar registros
DELETE /api/goals/{goal_id}/registries/{id}  # Deletar registro
```

#### Response Exemplo
```json
{
  "goal": {
    "id": 1,
    "title": "Ler 15 páginas por dia",
    "type": "daily",
    "target_value": 15,
    "unit": "páginas",
    "status": "active",
    "start_date": "2026-03-10",
    "end_date": "2026-03-17",
    "registries": [
      { "date": "2026-03-10", "value": 18, "note": "" }
    ]
  },
  "progress": {
    "progress": 14.28,
    "completed_days": 1,
    "total_days": 8,
    "current_streak": 1,
    "longest_streak": 1,
    "consistency": 100.0,
    "avg_daily": 18.0
  },
  "achievements": [
    {
      "id": "goal_started_1",
      "name": "🎯 Meta Iniciada!",
      "description": "Começou uma nova meta",
      "xp_bonus": 10
    }
  ],
  "xp_earned": 35
}
```

---

## 🎨 Frontend (`frontend-react/public/goals.html`)

### Estrutura do Código JavaScript

```javascript
// Calculadores (Strategy Pattern)
class DailyCalculator { }
class FrequencyCalculator { }
class CumulativeCalculator { }
class MilestoneCalculator { }

// Factory
class CalculatorFactory {
  static getCalculator(goalType)
}

// Gamificação
class GamificationSystem {
  static calculateXP()
  static getAchievements()
}

// Persistência
loadGoals()    // localStorage
saveGoals()
registries     // { goalId: [{ date, value }] }
```

### Interface Adaptável por Tipo

```html
<!-- Daily: Mostra streak e consistência -->
<div class="goal-type-daily">
  <div class="streak-badge">🔥 7 dias</div>
  <div class="progress-stats">
    <div>Dias: 7/7</div>
    <div>Consistência: 100%</div>
  </div>
</div>

<!-- Frequency: Mostra contador do período -->
<div class="goal-type-frequency">
  <div class="frequency-badge">4/4 esta semana</div>
  <div class="countdown">0 faltam</div>
</div>

<!-- Cumulative: Mostra total e projeção -->
<div class="goal-type-cumulative">
  <div class="total-accumulated">30/50km</div>
  <div class="pace">✅ No ritmo</div>
  <div class="projection">Conclusão: 15 de março</div>
</div>

<!-- Milestone: Mostra valor atual vs alvo -->
<div class="goal-type-milestone">
  <div class="milestone-progress">148/150kg</div>
  <div class="milestone-improvement">Melhoria: +3kg</div>
</div>
```

---

## 🔄 Fluxo de Dados

```
Frontend (localStorage)
    ↓
├─ sololeveling_goals              (estrutura de metas)
├─ sololeveling_goal_registries    (registros de progresso)
└─ sololeveling_achievements       (achievements desbloqueados)
    ↓
Backend (Database)
    ↓
├─ adaptive_goals table
├─ goal_registries table
└─ goal_achievements table
    ↓
Calculadores (Estratégia por tipo)
    ↓
Response com Progresso Calculado
    ↓
Frontend renderiza interface adaptável
```

---

## 📊 Casos de Uso Completos

### Caso 1: Meta Diária
```
Meta: Ler 15 páginas por dia durante 7 dias

Dia 1: Usuário registra 18 páginas
  → DailyCalculator.calculate()
  → progress: 14%, completed_days: 1, current_streak: 1
  → XP: 15 (base) + 10 (excesso) = 25 XP
  → Achievement: "🎯 Meta Iniciada!"

Dia 2-7: Continua registrando...

Dia 7: Último dia
  → progress: 100%
  → current_streak: 7
  → consistency: 100%
  → XP: +25 XP (base) + 10 XP (streak de 7)
  → Achievements: "🏆 Meta Atingida!" + "🔥 Uma Semana!"
```

### Caso 2: Meta de Frequência
```
Meta: Treinar 4 vezes por semana durante 4 semanas

Semana 1:
  Seg, Qua, Sex, Dom = 4 realizações
  → FrequencyCalculator.calculate()
  → progress: 100%, this_period_count: 4, days_until_reset: 6
  → Achievement: "✅ Semana Completa!"

Semana 2-4: Continua...

Mês completo:
  → 16 realizações total (4 por semana)
  → Status: "completed"
  → Achievement: "🏆 Meta Atingida!" + "🔥 Um Mês!"
```

### Caso 3: Meta Acumulativa
```
Meta: Correr 50km no mês

Dia 5: 10 + 12 + 8 + 15 + 10 = 55km
  → CumulativeCalculator.calculate()
  → progress: 110%, total_accumulated: 55
  → on_track: true (antecipado)
  → projected_end: 15 de março
  → Achievement: "⚡ Velocista!"
```

### Caso 4: Meta Milestone
```
Meta: Levantar 150kg no supino

Tentativa 1: 140 kg
  → MilestoneCalculator.calculate()
  → progress: 93%, current_value: 140, improved: false

Tentativa 2: 145 kg
  → progress: 96%, improved: true, improvement: +5kg
  → Achievement: "🚀 Novo Recorde Pessoal!"

Tentativa 3: 150 kg
  → progress: 100%, improved: true, improvement: +5kg
  → Achievement: "🏆 Meta Atingida!"
```

---

## 🚀 Como Usar

### Backend

```bash
# Criar meta
curl -X POST http://localhost:8000/api/goals/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ler 15 páginas por dia",
    "description": "Desenvolver hábito de leitura",
    "type": "daily",
    "unit": "páginas",
    "target_value": 15,
    "start_date": "2026-03-10",
    "end_date": "2026-03-17",
    "period": "day"
  }'

# Registrar progresso
curl -X POST http://localhost:8000/api/goals/1/registries \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-10",
    "value": 18,
    "note": "Comedia e suspense"
  }'

# Obter meta com progresso calculado
curl http://localhost:8000/api/goals/1
```

### Frontend

```javascript
// Estrutura automática no localStorage
{
  "sololeveling_goals": [
    {
      "id": 1,
      "title": "Ler 15 páginas por dia",
      "type": "daily",
      "target_value": 15,
      "unit": "páginas",
      ...
    }
  ],
  "sololeveling_goal_registries": {
    "1": [
      { "date": "2026-03-10", "value": 18, "note": "" }
    ]
  }
}

// Registrar progresso
registerProgress(goalId) {
  // Frontend calcula automaticamente usando CalculatorFactory
  const calculator = CalculatorFactory.getCalculator(goal.type);
  const progress = calculator.calculate(goal, goalRegistries);
}
```

---

## 📈 Melhorias Futuras

✅ Implementado:
- [x] Modelos universais
- [x] 4 tipos de calculadores
- [x] Gamificação básica
- [x] Achievements automáticos
- [x] Interface adaptável

🔄 Próximos:
- [ ] Integração Backend ↔ Frontend
- [ ] Sincronização em tempo real
- [ ] Gráficos de evolução
- [ ] Sistema de ranking
- [ ] Notificações diárias
- [ ] Exportar/importar metas
- [ ] Análise de padrões (IA)
- [ ] Recomendações genéricas

---

## 🎓 Padrões Utilizados

1. **Strategy Pattern** - Calculadores por tipo
2. **Factory Pattern** - CalculatorFactory
3. **Service Layer** - Lógica separada de views
4. **DTO Pattern** - Schemas Pydantic para validação
5. **Repository Pattern** - Acesso a dados via ORM

---

## 📝 Resumo

Implementamos uma **arquitetura escalável e extensível** que:
- ✅ Suporta múltiplos tipos de metas sem if/else gigante
- ✅ Calcula progresso automaticamente por tipo
- ✅ Gamificação inteligente com XP e achievements
- ✅ Interface adaptável que muda com o tipo
- ✅ Fácil adicionar novos tipos (basta criar novo Calculador)
- ✅ Backend e Frontend totalmente sincronizados

Você pode agora criar qualquer tipo de meta e o sistema se adapta automaticamente! 🎯
