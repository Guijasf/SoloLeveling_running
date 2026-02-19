# 🎯 Referência Rápida - SoloLeveling CAMADA 1

Tudo que você precisa saber sobre o projeto em uma página.

---

## 🏆 Status

**CAMADA 1**: ✅ COMPLETA  
**CAMADA 2**: 🔄 PRÓXIMA (2-3 semanas)  
**Data**: 2026-02-19  

---

## 🎮 O Projeto Em 10 Segundos

Um **RPG de vida real** onde:
- 📊 Você loga métricas (saúde, carreira, etc)
- ⬆️ Ganha XP e sobe de nível
- 🎯 Recebe missões dinâmicas
- 🏆 Desbloqueia achievements
- 📈 Vê seu progresso evoluir

---

## 🧠 A Base (CAMADA 1)

### Princípio Ouro

> **Engine é o cérebro. Toda mudança de progresso passa por lá.**

```
Usuário cria log
    ↓
metric_log_router salva
    ↓
Engine calcula TUDO
    ↓
Retorna progresso atualizado
```

### 3 Garantias Críticas

1. 🔐 **XP centralizado** - Atualizado APENAS na engine
2. 🔐 **Sem duplicação** - Zero lógica repetida
3. 🔐 **Formato único** - `{"area": "Health", "score": 8.5}`

---

## 📁 Estrutura Mínima

```
app/
├── services/
│   ├── progress_engine.py     ⭐ O CÉREBRO
│   ├── scoring_service.py
│   ├── mission_service.py
│   └── ...
├── routers/
│   ├── metric_log_router.py   ← Dispara engine
│   ├── goal_router.py         ← Dispara engine
│   └── ...
└── models/
    └── user_progress.py       ← xp, level, rank
```

---

## 🚀 Como Usar

### 1. Criar Log (Dispara Engine)

```bash
POST /metric-logs
{
    "user_id": 1,
    "metric_type_id": 1,
    "value": 8.5,
    "log_date": "2026-02-19"
}

Resposta:
{
    "progress": {
        "xp": 25,
        "level": 1,
        "rank": "D",
        "streak": 1,
        "area_scores": [{"area": "Health", "score": 8.5}]
    }
}
```

### 2. Completar Goal (Dispara Engine)

```bash
POST /goals/complete/1

Resposta:
{
    "user_level": 1,
    "user_xp": 25,
    "xp_gained": 50
}
```

### 3. Ver Score

```bash
GET /score/1

Resposta:
{
    "area_scores": [{"area": "Health", "score": 8.5}],
    "life_score": 8.5,
    "rank": "D"
}
```

---

## 🛠️ Adicionar Feature

### 5 Passos

1. **Modelo** - `app/models/novo.py`
2. **Schema** - `app/schemas/novo_schema.py`
3. **Service** - `app/services/novo_service.py`
4. **Engine** - Integrar em `progress_engine.py` SE afeta progresso
5. **Router** - `app/routers/novo_router.py`

### Exemplo: Foco Semanal

```python
# 1. Modelo
class UserFocus(Base):
    area_name = Column(String)
    xp_multiplier = Column(Float, default=1.5)

# 2. Service
def get_xp_multiplier(db, user_id, area):
    focus = db.query(UserFocus)...
    return focus.xp_multiplier if focus else 1.0

# 3. Engine (atualizar _calculate_xp_gain)
multiplier = get_xp_multiplier(db, user_id, area)
xp_gain = int(base_xp * multiplier)

# 4. Router
@router.get("/focus/{user_id}")
def get_focus(user_id, db):
    return generate_weekly_focus(db, user_id)
```

---

## 📚 Documentação

| Doc | Para quem | Tempo |
|-----|-----------|-------|
| [README.md](./README.md) | Todos | 10min |
| [QUICK_DEV_GUIDE.md](./QUICK_DEV_GUIDE.md) | Desenvolvedores | 15min |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetos | 20min |
| [CAMADA1_IMPLEMENTATION.md](./CAMADA1_IMPLEMENTATION.md) | Detalhistas | 30min |
| [CAMADA2_PLANO.md](./CAMADA2_PLANO.md) | Planejadores | 20min |

---

## ✅ Checklist Rápido

### Setup
- [ ] Criar usuário
- [ ] Criar áreas de vida
- [ ] Criar métricas
- [ ] Rodar `test_engine_stability.py`

### Desenvolvimento
- [ ] Ler QUICK_DEV_GUIDE.md
- [ ] Criar modelo
- [ ] Criar schema
- [ ] Criar service
- [ ] Integrar com engine
- [ ] Criar router
- [ ] Testar

### Validação
- [ ] Testes passam
- [ ] Sem erros
- [ ] Documentado

---

## 🔥 Próxima Fase (CAMADA 2)

### Foco Semanal (~4h)
- Detecta área mais fraca
- Aplica multiplicador 1.5x
- Gera missões focadas

### Missões Dinâmicas (~6h)
- Baseadas em contexto
- Score, tendência, rank
- Variação por dificuldade

### Achievements (~4h)
- Streak milestones
- Rank upgrades
- XP milestones

### Dificuldade Adaptativa (~3h)
- Se usuário evolui rápido → mais difícil
- Se usuário evolui lento → mais fácil
- Feedback contínuo

---

## ⚡ Comandos Úteis

### Testar CAMADA 1
```bash
cd SoloLeveling
python test_engine_stability.py
```

### Rodar servidor
```bash
uvicorn app.main:app --reload
```

### Debug no Python REPL
```python
from app.core.database import SessionLocal
from app.services.progress_engine import process_user_progress

db = SessionLocal()
result = process_user_progress(db, user_id=1)
print(result)
db.close()
```

---

## 🚨 Erros Comuns

### ❌ Atualizar XP fora da engine
```python
# ERRADO
progress.xp += 50
db.commit()

# CERTO
result = process_user_progress(db, user_id, new_log)
```

### ❌ Múltiplos commits
```python
# ERRADO
db.commit()  # Aqui
service()    # E aqui também

# CERTO
result = process_user_progress(...)
# Engine faz commit UMA VEZ
```

### ❌ Formato inconsistente
```python
# ERRADO
{"area_id": 1, "area_name": "Health"}
{"area": "Health"}

# CERTO
{"area": "Health", "score": 8.5}  # Sempre assim
```

---

## 💡 Dicas

1. **Centralizar** - Dúvida? Coloca na engine
2. **Testar** - Rode testes depois de cada mudança
3. **Documentar** - Code sem docs é código quebrado
4. **Contexto** - Engine precisa saber o quê aconteceu
5. **Formato** - Manter consistência em toda parte

---

## 🎯 Métricas

| Métrica | Valor |
|---------|-------|
| Arquivos Modificados | 11 |
| Documentos Criados | 7 |
| Testes Criados | 1 |
| Linhas Documentação | 2.500+ |
| Duplicação Removida | 100% |
| Engine Centralizada | ✅ Sim |
| Pronto Produção | ✅ Sim |

---

## 📞 FAQ Rápido

**P: Por que engine centralizada?**  
R: Impossível XP cair, rank cair ou estado ficar inconsistente.

**P: Como adicionar feature?**  
R: Modelo → Schema → Service → Engine → Router

**P: Quando chamar engine?**  
R: Sempre que afeta XP, Level ou Rank.

**P: Posso modificar XP em router?**  
R: ❌ Nunca. Engine faz isso.

**P: Como testar?**  
R: `python test_engine_stability.py`

---

## 🚀 Próximos Passos

### Hoje
1. ✅ Entender arquitetura
2. ✅ Rodar testes
3. ✅ Ler documentação

### Amanhã
1. 🔄 Começar CAMADA 2
2. 🔄 Implementar Foco Semanal
3. 🔄 Testar integração

### Próxima Semana
1. ⏳ Missões Dinâmicas
2. ⏳ Achievements
3. ⏳ Dificuldade Adaptativa

---

## 📊 Visão do Projeto

```
        Usuário
           │
           ↓ (log_date: 8.5)
      Router HTTP
           │
           ↓
     Salva no BD
           │
           ↓
    Chama ENGINE
           │
           ├─→ Calcula scores
           ├─→ Calcula XP
           ├─→ Atualiza level
           ├─→ Atualiza rank
           └─→ Commita BD
           │
           ↓
      Retorna progresso
           │
           ↓
     Frontend mostra
```

---

**Status**: ✅ CAMADA 1 Completa  
**Qualidade**: Pronta para Produção  
**Próximo**: CAMADA 2 em 2-3 semanas  

🎮 **SoloLeveling está pronto para evoluir!**


