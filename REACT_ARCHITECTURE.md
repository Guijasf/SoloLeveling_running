# 🎨 Frontend React - Arquitetura Visual

## 📊 Estrutura de Componentes

```
App.js (Router + Auth Context)
│
├── LoginPage
│   ├── Form Login
│   └── Form Registro
│
└── DashboardPage (Private)
    ├── Header
    │   ├── Logo
    │   ├── User Name
    │   ├── Settings Button
    │   └── Logout Button
    │
    └── Container (Grid 2 colunas)
        │
        ├── Left Column
        │   ├── ProfileCard
        │   │   ├── Avatar com Level
        │   │   ├── Rank Badge
        │   │   ├── XP Bar
        │   │   └── Stats (Streak, Achievements, Life Score)
        │   │
        │   └── RadarChart
        │       └── Chart.js (6 áreas)
        │
        └── Right Column
            ├── MissionsCard
            │   └── Lista de Missões
            │       ├── Dificuldade
            │       ├── Recompensa XP
            │       └── Btn Completar
            │
            └── AchievementsCard
                └── Grid de Conquistas
                    ├── Ícone
                    └── Nome
```

## 🔄 Fluxo de Dados

```
User Action
    ↓
Component State Update
    ↓
API Request (axios)
    ↓
Backend Response
    ↓
State Update
    ↓
Re-render Component
```

### Exemplo: Completar Missão

```javascript
[Button Click]
    ↓
handleCompleteMission(id)
    ↓
POST /missions/{id}/complete
    ↓
Backend processa
    ↓
Response: {success: true}
    ↓
setCompletedMissions.add(id)
    ↓
UI atualiza (botão desaparece)
```

## 🔐 Fluxo de Autenticação

```
[Login/Registro]
    ↓
POST /auth/login (email, password)
    ↓
Backend: Verifica credenciais
    ↓
Response: {access_token, user}
    ↓
AuthContext.login()
    ↓
localStorage.setItem('authToken', token)
    ↓
Navigate to Dashboard
    ↓
PrivateRoute permite acesso
```

## 📱 Responsividade

```
Desktop (> 1024px)          Tablet (768-1024px)        Mobile (< 768px)
┌─────────────────────┐    ┌──────────────────┐      ┌───────────┐
│      Header         │    │     Header       │      │  Header   │
├──────────┬──────────┤    ├──────────────────┤      ├───────────┤
│          │          │    │   ProfileCard    │      │ProfileCard│
│ Profile  │ Missions │ →  ├──────────────────┤  →   ├───────────┤
│ Radar    │Achievem. │    │   RadarChart     │      │RadarChart │
│          │          │    ├──────────────────┤      ├───────────┤
│          │          │    │   MissionsCard   │      │Missions   │
│          │          │    ├──────────────────┤      ├───────────┤
│          │          │    │Achievements      │      │Achievements
└──────────┴──────────┘    └──────────────────┘      └───────────┘
```

## 🎨 Design System

### Cores
- **Primary**: `#16c784` (Verde)
- **Primary Dark**: `#0fb981` (Verde escuro)
- **Background**: `#0f0f1e` → `#1a1a2e` (Gradiente)
- **Text**: `#fff` (Branco)
- **Text Secondary**: `#aaa` (Cinza)
- **Danger**: `#ff6666` (Vermelho)

### Componentes
- **Button Primary**: Verde com shadow hover
- **Card**: Dark com border verde
- **Input**: Dark com border verde
- **Badge**: Inline com background semi-transparente

### Animações
- **XP Bar**: shimmer infinito
- **Hover Cards**: scale + border color change
- **Buttons**: translateY + shadow on hover
- **Loading**: spin animation

## 🔌 API Interceptor

```javascript
axios.interceptors.request.use((config) => {
  // ADD TOKEN TO ALL REQUESTS
  config.headers.Authorization = `Bearer ${token}`
  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TOKEN EXPIRED
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 📈 Estado Global

```javascript
AuthContext {
  user: {
    id,
    name,
    email
  },
  token: "jwt...",
  login: (user, token) => {},
  logout: () => {}
}
```

### Uso:
```javascript
const { user, token, login, logout } = useContext(AuthContext)
```

## 🚀 Build Process

```
npm start
  ↓
Webpack compila JSX → JavaScript
  ↓
Babel transpila para ES5
  ↓
Dev server com Hot Module Reload
  ↓
Browser em http://localhost:3000
```

```
npm run build
  ↓
Production build otimizado
  ↓
Minificação + Tree shaking
  ↓
Pasta 'build/' pronta para deploy
  ↓
Size: ~150KB gzipped
```

## 📊 Requisições HTTP

### Login
```
POST /auth/login
Headers: Content-Type: application/json
Body: {
  "email": "user@example.com",
  "password": "senha123"
}
Response: {
  "access_token": "eyJ0eXAi...",
  "user": {
    "id": 1,
    "name": "João",
    "email": "user@example.com"
  }
}
```

### Dashboard
```
GET /dashboard/1
Headers: Authorization: Bearer eyJ0eXAi...
Response: {
  "level": 5,
  "rank": "C",
  "xp": 540,
  "next_level_xp": 700,
  "streak": 6,
  "achievements_count": 3,
  "area_scores": [
    { "area": "Health", "score": 85 },
    { "area": "Career", "score": 72 },
    ...
  ],
  "today_missions": [
    {
      "id": 1,
      "title": "Exercitar",
      "description": "30 min de exercício",
      "difficulty": "Médio",
      "xp_reward": 100
    }
  ],
  "achievements": [
    { "id": 1, "key": "streak_7", "name": "7 Dias" }
  ]
}
```

## 🧪 Componentes Testáveis

Cada componente é isolado:

- **LoginPage** → Testa auth flow
- **ProfileCard** → Testa renderização de dados
- **RadarChart** → Testa integração Chart.js
- **MissionsCard** → Testa interações
- **Header** → Testa navegação

## 🔗 Dependências de Componentes

```
App
 ├── AuthContext (global)
 ├── LoginPage
 │    └── api.js
 │
 └── DashboardPage
      ├── Header
      ├── ProfileCard
      ├── RadarChart (chart.js)
      ├── MissionsCard
      │    └── api.js
      └── AchievementsCard
```

## 📡 Ciclo de Vida

```javascript
// Ao abrir Dashboard
useEffect(() => {
  loadDashboardData()  // 1a requisição
  
  // Atualiza a cada 30 segundos
  const interval = setInterval(loadDashboardData, 30000)
  
  // Cleanup ao desmontar
  return () => clearInterval(interval)
}, [])
```

## 🎯 Fluxo Completo de Uso

```
1. User abre http://localhost:3000
2. App.js carrega localStorage
3. Se token existe → vai para Dashboard
4. Se não → vai para Login
5. User faz login
6. API retorna token + user
7. AuthContext.login() salva dados
8. Navigate para /dashboard
9. DashboardPage carrega dados
10. RadarChart renderiza com Chart.js
11. User clica em "Completar Missão"
12. API POST /missions/{id}/complete
13. UI atualiza (missão marca como completa)
14. Cada 30s data é refrescada automaticamente
```

---

**Esta arquitetura é profissional, escalável e pronta para produção!** 🚀

