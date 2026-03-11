# 🚀 GUIA RÁPIDO - TESTAR NOVO FRONTEND MUI

**Versão:** 1.0 | **Status:** ✅ Pronto para Testar

---

## ⚡ INÍCIO RÁPIDO (2 min)

### 1️⃣ Abrir Terminal
```bash
cd c:\Users\Guilherme.amaral\Documents\SoloLeveling\frontend-react
npm start
```

**Resultado:** Browser abre em `http://localhost:3000/login`

---

## 📍 ROTAS DE TESTE

### Login Page
```
URL: http://localhost:3000/login

Campo Email:    user@example.com
Campo Senha:    password123
Botão:          Entrar

✅ Vai para /game automaticamente
```

---

## 🎮 PÁGINAS PARA TESTAR

### 1️⃣ Dashboard (HOME) ⭐ NOVO
```
URL: http://localhost:3000/dashboard

O que ver:
  📊 XP Progress Bar (1415/2700 XP)
  📈 4 Stat Cards (Metas, Pontos, etc)
  🔥 Streak Card (15 dias)
  ⭐ Achievements Grid
  ✅ Daily Tasks List (5 tarefas)

Teste:
  ✅ Hover nos cards (levanta)
  ✅ Responsividade (redimensione)
  ✅ Tema (mude tema na navbar)
```

### 2️⃣ Arena (Game)
```
URL: http://localhost:3000/game

O que ver:
  📊 Dashboard com stats
  🎬 Tabs para seções
  📈 Progresso visual

Teste:
  ✅ Clique nas abas
  ✅ Hover animations
  ✅ Responsividade
```

### 3️⃣ Metas
```
URL: http://localhost:3000/goals

O que ver:
  🎯 Goal Cards com 4 exemplos
  ✏️ Menu para editar/deletar
  📝 Dialog para criar nova meta

Teste:
  ✅ Clique no botão "+ Nova Meta"
  ✅ Preencha nome, emoji, categoria
  ✅ Clique "Criar"
  ✅ Clique em "..." de uma meta
  ✅ Editar ou Deletar
```

### 4️⃣ Hábitos ⭐ NOVO
```
URL: http://localhost:3000/habits

O que ver:
  🏃 Habit Cards (6 exemplos)
  📊 Progress Bars coloridas
  📈 Stats Summary (4 cards)
  ✏️ Menu em cada card

Teste:
  ✅ Clique "+ Novo Hábito"
  ✅ Preencha nome, emoji, dias/semana
  ✅ Clique "Criar"
  ✅ Veja card novo aparecer
  ✅ Clique "..." e edite
  ✅ Clique "..." e delete
  ✅ Veja cards levantarem ao hover
  ✅ Cores diferentes por hábito
```

### 5️⃣ Tarefas ⭐ NOVO
```
URL: http://localhost:3000/tasks

O que ver:
  ✅ Task List (6 exemplos)
  📋 Tabs (Pendentes: 5, Completas: 1)
  ☑️ Checkboxes para completar
  🎯 Prioridades (🔴 Alta, 🟡 Média, 🟢 Baixa)
  📊 Stats Bar (4 cards)

Teste:
  ✅ Clique checkbox para completar tarefa
  ✅ Tarefa fica risada com cor verde
  ✅ Conta de "Completas" aumenta
  ✅ Clique aba "✅ Completas"
  ✅ Veja tarefas completas
  ✅ Clique "+ Nova Tarefa"
  ✅ Preencha título, descrição, prioridade
  ✅ Clique "Criar"
  ✅ Clique "..." em uma tarefa
  ✅ Edite ou delete
```

---

## 🎨 TESTAR TEMAS

### Local: Navbar (topo da página)
```
Procure pelo Select dropdown:
  🔵 Default (Azul/Verde)
  🟣 ARISE (Purple/Cyan)

Teste:
  ✅ Clique no dropdown
  ✅ Selecione "🔵 Default"
  ✅ Todas cores mudam para azul/verde
  ✅ Selecione "🟣 ARISE"
  ✅ Todas cores mudam para purple/cyan
  ✅ Persiste ao recarregar (localStorage)
```

---

## 📱 TESTAR RESPONSIVIDADE

### Desktop
```
1️⃣ Veja com tamanho normal
   ✅ Sidebar visível
   ✅ Layout 3+ colunas
   ✅ Navbar + Sidebar visiveis
```

### Tablet
```
1️⃣ Redimensione browser para ~900px
   ✅ Grid muda para 2 colunas
   ✅ Sidebar ainda visível
   ✅ Interface legível
```

### Mobile
```
1️⃣ Redimensione para ~390px (ou use DevTools)
   
   Atalho: Ctrl+Shift+M (DevTools toggle)
   Selecione: iPhone 12
   
   ✅ Menu hamburger aparece
   ✅ Sidebar vira drawer
   ✅ Grid funciona com 1 coluna
   ✅ Cards adaptams tamoanho
   ✅ Tudo legível
```

---

## 🔧 NAVBAR & NAVEGAÇÃO

### Sidebar (Desktop)
```
Dashboard → http://localhost:3000/dashboard
Arena     → http://localhost:3000/game
Metas     → http://localhost:3000/goals
Hábitos   → http://localhost:3000/habits   ⭐ NOVO
Tarefas   → http://localhost:3000/tasks    ⭐ NOVO
```

### Menu Mobile (< 900px)
```
Clique no 📋 ícone (canto superior esquerdo)
Drawer abre com as mesmas opções
Clique em uma opção → Navega e fecha drawer
```

### Profile Menu
```
Clique no Avatar (G no canto superior direito)
Menu abre com:
  Guilherme (seu nome)
  Nível 10 (seu nível)
  ─────
  👤 Perfil
  ⚙️ Configurações
  ─────
  🚪 Logout (faz logout)
```

---

## 🎯 CHECKLIST DE TESTES

### ✅ Funcionalidade Básica
- [ ] Login funciona
- [ ] Navega para /game após login
- [ ] Sidebar links navegam corretamente
- [ ] Avatar click abre menu
- [ ] Logout funciona

### ✅ HomePageMUI (/dashboard)
- [ ] XP Progress Bar visível
- [ ] 4 Stat Cards renderizam
- [ ] Streak Card com fogo 🔥
- [ ] Achievements Grid visível
- [ ] Tasks List visível (5 tarefas)
- [ ] Cards levantam ao hover

### ✅ HabitsPageMUI (/habits)
- [ ] 6 Habit Cards visíveis
- [ ] Progress bars trabalham
- [ ] "+ Novo Hábito" abre dialog
- [ ] Criar novo hábito funciona
- [ ] Menu "..." abre (Editar/Deletar)
- [ ] Editar hábito funciona
- [ ] Deletar hábito funciona
- [ ] Stats Summary (4 cards)

### ✅ DailyTasksPageMUI (/tasks)
- [ ] 6 Tasks visíveis
- [ ] Checkboxes marcam/desmarcam
- [ ] Tarefa risada ao completar
- [ ] Aba "Pendentes" (5 tasks)
- [ ] Aba "Completas" (1 task)
- [ ] "+ Nova Tarefa" abre dialog
- [ ] Criar tarefa funciona
- [ ] Menu "..." (Editar/Deletar)
- [ ] Editar tarefa funciona
- [ ] Deletar tarefa funciona
- [ ] Stats bar atualiza

### ✅ Temas
- [ ] Dropdown tema visível
- [ ] Default theme funciona (azul/verde)
- [ ] ARISE theme funciona (purple/cyan)
- [ ] Tema muda em tempo real
- [ ] Tema persiste (F5 = mesmo tema)

### ✅ Responsividade
- [ ] Desktop: Layout completo
- [ ] Tablet ~900px: Grid 2 colunas
- [ ] Mobile ~390px: Drawer + 1 coluna
- [ ] Todos Cards visíveis em mobile
- [ ] Tudo legível em mobile

### ✅ Animações
- [ ] Cards levantam ao hover
- [ ] Transições suaves
- [ ] Checkboxes animados
- [ ] Dialog abre/fecha

---

## 🐛 SE ALGO NÃO FUNCIONAR

### Erro de módulo?
```bash
npm install
npm start
```

### Port 3000 em uso?
```bash
# Windows
netstat -ano | findstr :3000
# Ou, simplesmente inicie em porta diferente:
PORT=3001 npm start
```

### Erro ao fazer build?
```bash
npm run build
# Se falhar, verifique output para saber qual erro
```

### Cache/Cookie problema?
```
1. Abra DevTools (F12)
2. Application → Clear Site Data
3. F5 para recarregar
```

---

## 📊 RESUMO DE TESTES

| Feature | Status | Nota |
|---------|--------|------|
| Database | ✅ | Deve rodar em background |
| Backend | ⏳ | Precisa `uvicorn` se integrar com API |
| Frontend | ✅ | Pronto para testar now |
| MUI Components | ✅ | Todos funcionando |
| Themes | ✅ | Default + ARISE |
| Routing | ✅ | 7 rotas |
| CRUD | ✅ | Mock (pronto para API) |
| Responsividade | ✅ | Xs → Lg |
| Testes Manual | ✅ | Use checklist acima |

---

## 🎯 RESULTADO ESPERADO

**Tela de Login:**
```
Logo: ⚔️ SoloLeveling
Email: [             ]
Senha: [             ]
Botão: [Entrar      ]

Background: Gradientes azul/purple
```

**Tela Dashboard (/dashboard):**
```
Navbar com: Logo | Theme | Avatar
Sidebar com: Dashboard | Arena | Metas | Hábitos | Tarefas
Main con 3 seções:
  1. XP Progress (grande)
  2. 4 Stat Cards
  3. Achievements (esq) + Tasks (dir)
```

**Tela Hábitos (/habits):**
```
Header: "🌟 Meus Hábitos"
Stats: 6 hábitos | 72% progresso | etc
Grid 3 colunas (desktop): 6 Habit Cards coloridas
Cada card com:
  - Emoji + Nome + Frequência
  - Progress Bar
  - Menu (...)
  - Stats (Semanas, Sequência)
```

**Tela Tarefas (/tasks):**
```
Header: "✅ Minhas Tarefas"
Stats: 5 Pendentes | 1 Completa | 83% Taxa
Tabs: "📋 Pendentes (5)" | "✅ Completas (1)"
Task List:
  ☐ Reunião com o time        🔴 Alta | Hoje | [...]
  ☐ Revisar pull requests     🔴 Alta | Hoje | [...]
  ☑ Atualizar documentação   🟢 Baixa | ✓ | [...]
  etc
```

---

## 🎉 PRÓXIMO PASSO

```
1. Execute npm start
2. Teste as 5 páginas
3. Teste os 2 temas
4. Teste responsividade
5. Se tudo OK →
   Integrar com API Backend 🚀
```

---

**Testes Prontos! Boa Sorte! 🍀**
