# 🎮 SoloLeveling - Frontend React

Frontend moderno em **React 18** com design dark mode profissional, conectado ao seu backend FastAPI.

## ⚡ Quick Start

### Windows (PowerShell)
```powershell
cd frontend-react
npm install
npm start
```

### macOS/Linux (Bash)
```bash
cd frontend-react
chmod +x setup.sh
./setup.sh
```

Ou use o script automático do seu sistema (ver pasta raiz).

## 🌟 Funcionalidades

✅ **Autenticação JWT**
- Login e registro
- Token persistente
- Logout seguro

✅ **Dashboard Interativo**
- Card de perfil com nível/rank
- XP bar animada
- Gráfico radar de áreas
- Streak e conquistas

✅ **Missões Diárias**
- Lista de missões dinâmicas
- Dificuldade com código de cores
- Recompensa em XP
- Marcar como completa

✅ **Sistema de Conquistas**
- Galeria visual
- Ícones personalizados
- Badges desbloqueáveis

✅ **Interface Profissional**
- Dark mode com verde (#16c784)
- Fully responsive
- Animações suaves
- Loading states

## 📂 Estrutura

```
src/
├── components/
│   ├── Header.js              # Barra superior
│   ├── ProfileCard.js         # Perfil + XP
│   ├── RadarChart.js          # Gráfico radar
│   ├── MissionsCard.js        # Missões
│   ├── AchievementsCard.js    # Conquistas
│   └── PrivateRoute.js        # Proteção de rotas
├── pages/
│   ├── LoginPage.js           # Login/Registro
│   ├── DashboardPage.js       # Dashboard
│   └── SettingsPage.js        # Configurações
├── context/
│   └── AuthContext.js         # State de auth
├── utils/
│   └── api.js                 # Axios config
└── App.js                     # Router principal
```

## 🔐 Autenticação

- JWT Bearer Token
- localStorage persistence
- Interceptor automático
- 401 → redirect to login

## 🎨 Customização

### Cores
Edite em qualquer arquivo `.css`:
```css
--primary: #16c784      /* Verde */
--primary-dark: #0fb981 /* Verde escuro */
--bg: #0f0f1e          /* Fundo escuro */
```

### API URL
Arquivo `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

## 🛠️ Desenvolvimento

```bash
# Iniciar com hot reload
npm start

# Build otimizado
npm run build

# Rodar testes
npm test
```

## 📦 Dependências

- **react** - UI library
- **react-router-dom** - Client routing
- **axios** - HTTP client
- **chart.js** - Gráficos
- **react-chartjs-2** - React integration

## 🌐 Integração Backend

Endpoints esperados (FastAPI):

```
POST   /auth/login                    # Login
POST   /auth/register                 # Registro
GET    /dashboard/{user_id}           # Dados dashboard
POST   /missions/{id}/complete        # Completar missão
GET    /achievements                  # Listar conquistas
```

## 📱 Responsividade

- **Desktop** → Grid 2 colunas
- **Tablet** (1024px) → Grid 1 coluna
- **Mobile** → Stack vertical

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `npm not found` | Instale [Node.js](https://nodejs.org/) |
| `CORS error` | Backend não está rodando |
| `Porta 3000 em uso` | `npm start -- --port 3001` |
| `Token expirado` | Faça logout e login novamente |

## 🚀 Deploy

### Vercel (recomendado)
```bash
npm run build
# Fazer upload da pasta 'build/'
```

### Netlify
```bash
npm run build
# Drag & drop da pasta 'build/'
```

### Seu próprio servidor
```bash
npm run build
# Servir com nginx ou Apache
```

## 🔄 Próximos Passos

- [ ] Histórico com gráficos temporais
- [ ] Leaderboard global
- [ ] WebSocket para notificações
- [ ] Theme toggle claro/escuro
- [ ] PWA + offline support
- [ ] Sharing de perfil público

## 📝 Licença

SoloLeveling © 2025

---

**Pronto?**

```bash
npm install && npm start
```

