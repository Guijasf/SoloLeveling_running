# SoloLeveling - Frontend React

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ e npm

### Passos

```bash
# 1. Entre na pasta do frontend-react
cd frontend-react

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm start
```

O app será aberto em `http://localhost:3000`

## 🎯 Funcionalidades Implementadas

✅ **Autenticação**
- Login e Registro
- JWT Bearer Token
- Persistência de sessão

✅ **Dashboard**
- Exibição de nível, rank e XP
- Gráfico radar de áreas
- Streak e conquistas
- Foco semanal automático

✅ **Missões**
- Listagem de missões do dia
- Dificuldade com código de cores
- Recompensa em XP
- Marcação como completa

✅ **Conquistas**
- Galeria visual de badges
- Ícones e nomes personalizados

✅ **Interface**
- Dark mode moderno
- Tema verde (#16c784)
- Responsive para todos os devices
- Animações suaves

## 🏗️ Estrutura de Pastas

```
frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Header.js
│   │   ├── ProfileCard.js
│   │   ├── RadarChart.js
│   │   ├── MissionsCard.js
│   │   ├── AchievementsCard.js
│   │   └── PrivateRoute.js
│   ├── context/         # Context API
│   │   └── AuthContext.js
│   ├── pages/          # Páginas completas
│   │   ├── LoginPage.js
│   │   ├── DashboardPage.js
│   │   └── SettingsPage.js
│   ├── utils/          # Utilitários
│   │   └── api.js      # Axios config + interceptors
│   ├── App.js          # Componente principal
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Autenticação & Segurança

- **JWT Bearer Token** armazenado no localStorage
- **Interceptor automático** que adiciona token a todas as requisições
- **Redirecionamento automático** em caso de 401 (não autorizado)
- **PrivateRoute** para proteger rotas do dashboard

## 📡 Integração com Backend

O frontend se conecta ao backend FastAPI rodando em `http://localhost:8000`

### Endpoints Utilizados

```
POST /auth/login          # Login
POST /auth/register       # Registro
GET  /dashboard/{user_id} # Dados do dashboard
POST /missions/{id}/complete  # Completar missão
```

## 🎨 Temas & Customização

Cores principais:
- **Verde Principal**: `#16c784`
- **Verde Escuro**: `#0fb981`
- **Fundo Dark**: `#0f0f1e` → `#1a1a2e`
- **Cinza Claro**: `#aaa`

Para alterar, edite os valores hex nos arquivos `.css`

## 🚀 Build para Produção

```bash
npm run build
```

Gera a pasta `build/` pronta para deploy.

## 🧪 Testes

```bash
npm test
```

## 📱 Responsividade

Layout adaptado para:
- **Desktop** - Grid 2 colunas
- **Tablet** (1024px) - Grid 1 coluna
- **Mobile** - Stack vertical

## 🔄 Atualizações em Tempo Real

Dashboard recarrega dados a cada 30 segundos automaticamente (pode ser customizado em `DashboardPage.js`)

## 🌐 Variáveis de Ambiente

Crie `.env` na raiz com:

```
REACT_APP_API_URL=http://localhost:8000
```

Para produção:
```
REACT_APP_API_URL=https://seu-api.com
```

## 📦 Dependências Principais

- **react** - UI library
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **chart.js** - Gráficos
- **react-chartjs-2** - React wrapper para Chart.js

## 🐛 Troubleshooting

### "Cannot find project"
- Verifique se está na pasta correta: `cd frontend-react`

### CORS error
- Certifique-se que o backend está rodando em `localhost:8000`
- Verifique se CORS está habilitado no FastAPI

### Token expirado
- Faça logout e login novamente
- O interceptor fará redirecionamento automático para `/login`

### Gráfico não aparece
- Verifique se `data.area_scores` não é vazio
- Console pode ter erros - abra DevTools (F12)

## 🎯 Próximos Passos

- [ ] Historico temporal com more gráficos
- [ ] Leaderboard global
- [ ] Notificações em tempo real (WebSocket)
- [ ] Tema claro/escuro customizável
- [ ] PWA - offline support
- [ ] Dark/Light theme toggle
- [ ] Perfil público compartilhável

## 📄 Licença

Projeto SoloLeveling © 2025

---

**Pronto para começar?**

```bash
cd frontend-react && npm install && npm start
```

