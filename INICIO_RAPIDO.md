# 🎮 SOLO LEVELING - INÍCIO RÁPIDO

**Status:** ✅ Pronto para usar (v1.0)

---

## 🚀 Iniciar em 3 Passos

### Passo 1: Backend (Terminal 1)

```bash
cd c:\Users\Guilherme.amaral\Documents\SoloLeveling

# Ativar ambiente virtual
.\venv\Scripts\activate

# Rodar servidor
python app/main.py
```

**Deve mostrar:** `Uvicorn running on http://127.0.0.1:8000`

### Passo 2: Frontend (Terminal 2)

```bash
cd c:\Users\Guilherme.amaral\Documents\SoloLeveling\frontend-react

npm start
```

**Deve mostrar:** `Compiled successfully! You can now view solo-leveling in the browser`

### Passo 3: Abrir no Navegador

```
http://localhost:3000/dashboard
```

---

## 🎯 O Que Você Pode Fazer

### 1. **Criar Metas** 🎯
- Clique na aba **Metas**
- Preencha: Título, Categoria, Prioridade
- Clique em "Criar"

### 2. **Completar Missões** 🎮
- Clique na aba **Missões**
- Veja as missões do dia
- Clique em "✅ Completar"
- Ganhe XP!

### 3. **Acompanhar Sequência** 🔥
- Clique na aba **Sequência**
- Veja suas frequências de 7, 30, 50, 100 dias
- Desbloqueie bônus de XP
- Compare com leaderboard

### 4. **Ver Balanceamento** 📊
- Clique na aba **Áreas**
- Visualize gráfico radar
- Veja qual área está mais fraca
- Equilibre sua vida!

### 5. **Visão Geral** 📈
- Clique na aba **Visão Geral**
- Veja streak + progresso ao next level
- Dashboard resumido

---

## 📊 Os 4 Subsistemas

### 🎯 METAS (Goals System)

**Como funciona:**
1. Você cria uma meta (correr 5km, ler livro, etc)
2. Atribui prazos e pontos de XP
3. Marca progresso
4. Completa e ganha XP

**Exemplo API:**
```bash
# Criar
POST http://localhost:8000/goals
{
  "user_id": 1,
  "title": "Correr 5km",
  "category": "health",
  "priority": 1,
  "target_value": 5,
  "reward_xp": 100
}

# Completar
POST http://localhost:8000/goals/1/1/complete
# Retorna: { "xp_gained": 100, "level_up": false }
```

---

### 🎮 MISSÕES (Missions System)

**Como funciona:**
1. Missões são criadas automaticamente
2. 3 dificuldades: Easy (50 XP), Medium (100 XP), Hard (200 XP)
3. Você completa e ganha XP
4. Bônus de streak aplicado automático (+20% a +50%)

**Exemplo API:**
```bash
# Listar missões de hoje
GET http://localhost:8000/missions/1
# Retorna: [{ "id": 1, "title": "...", "difficulty": "easy", "xp_reward": 50 }]

# Completar
POST http://localhost:8000/missions/1/complete
# Retorna: { "xp_gained": 50, "streak_bonus": 10 }

# Ver estatísticas do dia
GET http://localhost:8000/missions/1/process-today
# Retorna: { "missions_completed": 2, "missions_today": 5, "completion_rate": 40, "total_xp": 350 }
```

---

### 🔥 SEQUÊNCIA (Streak System)

**Milestones:**

| Dias | Multiplicador | Bônus | Emoji |
|------|---------------|-------|-------|
| 7    | 1.1x          | +50   | 🥉    |
| 14   | 1.2x          | +100  | 🥉    |
| 30   | 1.3x          | +200  | 🥈    |
| 50   | 1.4x          | +300  | 🏆    |
| 100+ | 1.5x          | +500  | 💎    |

**Exemplo API:**
```bash
# Dados da sequência
GET http://localhost:8000/streak/1
# Retorna: { "current_streak": 7, "best_streak": 15, "multiplier": 1.1 }

# Informação de bônus
GET http://localhost:8000/streak/1/bonus
# Retorna: { "bonus_xp": 50, "milestone_name": "Bronze", "next_milestone": 14 }

# Leaderboard
GET http://localhost:8000/streak/1/leaderboard
# Retorna: [
#   { "position": 1, "username": "Player1", "current_streak": 50 },
#   { "position": 2, "username": "Player2", "current_streak": 30 }
# ]
```

---

### 📊 SCORING DE ÁREAS (Area Scoring System)

**8 Áreas de Vida:**
```
💼 Carreira - Trabalho & Negócios
🏥 Saúde - Exercício & Bem-estar físico
👨‍👩‍👧 Família - Relacionamento familiares
🎮 Diversão - Lazer & hobby
🧘 Bem-estar - Meditação & mental
💑 Relacionamentos - Amor & amizades
📚 Educação - Aprendizado
💰 Financeiro - Dinheiro & economia
```

**Exemplo API:**
```bash
# Scores de todas as áreas
GET http://localhost:8000/scoring/1
# Retorna: {
#   "life_score": 72.5,
#   "area_scores": [
#     { "area_name": "Carreira", "score": 85.0, "trend": "up" },
#     { "area_name": "Saúde", "score": 60.0, "trend": "stable" }
#   ]
# }
```

---

## 📈 Exemplo de Fluxo Completo

### Cenário: João quer ganhar 1500 XP hoje

1. **João abre Dashboard**
   - Tá no nível 5, com 250/1000 XP
   - Sequência de 7 dias (1.1x multiplicador)

2. **Cria uma Meta**
   - "Ler um livro" (categoria: educação)
   - Prioridade: 2
   - Compensa 100 XP

3. **Vê as 5 Missões de Hoje**
   - Easy: "Meditar 10min" (50 XP)
   - Easy: "Beber 8 copos de água" (50 XP)
   - Medium: "Fazer exercício" (100 XP)
   - Medium: "Trabalhar no projeto" (100 XP)
   - Hard: "Correr 5km" (200 XP)

4. **Completa 4 Missões + 1 Meta**
   - 2x Easy = 100 XP (com 1.1x streak = 110 XP)
   - 2x Medium = 200 XP (com 1.1x streak = 220 XP)
   - 1x Meta Leitura = 100 XP (com 1.1x streak = 110 XP)
   - **Total: 440 XP ganho** ✅

5. **Progresso do Dia**
   - Novo XP: 250 + 440 = 690/1000
   - Faltam 310 XP para level up
   - Streak: 8 dias (prepare-se para unlock 🥉)

6. **Vê na Aba Áreas**
   - Educação subiu (leu livro + meditou)
   - Saúde subiu (exercício + hidratação)
   - Carreira subiu (trabalhou no projeto)
   - Score de vida: 72.5

---

## 🔧 Troubleshooting Rápido

### Backend não inicia?
```bash
# Verifique se port 8000 está livre
netstat -ano | findstr :8000

# Reinstale dependências
pip install --upgrade -r requirements.txt

# Inicie com debug
python app/main.py --log-level debug
```

### Frontend não carrega?
```bash
# Limpe cache
rm -r node_modules package-lock.json
npm install

# Verifique se backend está rodando
curl http://localhost:8000/docs
```

### Dados não sincronizam?
- Abra DevTools (F12)
- Verifique aba Console (erros?)
- Verifique aba Network (requisições?)
- Tente refresh (Ctrl+R)

---

## 📱 URLs Úteis

| URL | Função |
|-----|--------|
| http://localhost:8000 | Backend raiz |
| http://localhost:8000/docs | Swagger API |
| http://localhost:8000/redoc | ReDoc API |
| http://localhost:3000 | Frontend raiz |
| http://localhost:3000/dashboard | Dashboard principal |

---

## 💾 Arquivos Importantes

```
SoloLeveling/
├─ app/
│  ├─ main.py ← Backend
│  ├─ models/ ← Banco de dados
│  ├─ routers/ ← APIs (23 endpoints)
│  └─ services/ ← Lógica de negócio
├─ frontend-react/
│  ├─ src/components/ ← React components
│  └─ package.json ← Dependências
├─ GUIA_IMPLEMENTACAO_COMPLETA.md ← Documentação detalhada
├─ CHECKLIST_FINAL_COMPLETO.md ← Tudo pronto?
└─ README.md ← Este arquivo
```

---

## 🎓 Conceitos Principais

### XP e Nível
- Você ganha XP completando metas e missões
- A cada 1000 XP você sobe de nível
- Cada nível sua média de dificuldade sobe

### Multiplicadores
- **Foco Semanal:** 1.5x se escolheu área como foco dessa semana
- **Streak:** 1.1x a 1.5x dependendo de quantos dias consecutivos
- **Final:** Base XP × Foco_Multi × Streak_Multi

### Rank System
- Iniciante → Aprendiz → Guerreiro → Cavaleiro → Senhor → ...
- Sistema RPG real com progressão

### Leaderboard
- Ranking baseado em sequência (streak)
- Vejo minha posição comparada a outros
- Incentiva competição saudável

---

## 🎮 Dicas Jogare

1. **Foque em uma área por semana** - Pega 1.5x de bônus
2. **Não quebre a sequência** - Multiplicador sobe exponencialmente
3. **Missões valem mais que metas** - Faça as hard missions
4. **Equilibre as áreas** - Radar chart ideal é um círculo
5. **Semanalmente revisite** - Defina novos focos
6. **Completar é melhor que criado** - Metas não concluídas não valem

---

## 📞 Próximos Passos

- [ ] Abrir Dashboard (http://localhost:3000)
- [ ] Criar 3 metas
- [ ] Completar todas as 5 missões de hoje
- [ ] Atingir 7 dias de sequência
- [ ] Desbloqueir milestone 🥉 Bronze
- [ ] Ficar Top 5 do leaderboard
- [ ] Equilibrar todas as 8 áreas

---

## ✨ Parabéns!

Você tem um **sistema gamificado de vida** rodando! 

**O que mudou:**
- Sua vida é um RPG
- Cada ação tem valor (XP)
- Progresso é visível
- Sequência motiva disciplina
- Áreas mostram desequilíbrios

**Agora é só:**
1. ✅ Usar frequentemente
2. ✅ Manter a sequência
3. ✅ Atingir milestones
4. ✅ Subir de nível

---

**Jogue bem! 🎮**

*Solo Leveling v1.0 - Transforme sua vida em uma aventura*
