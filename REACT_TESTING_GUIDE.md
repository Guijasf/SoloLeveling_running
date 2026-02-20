# 🧪 Guia de Testes - React Frontend

## ✅ Testes Manuais

### 1️⃣ Teste de Login

**Objetivo:** Verificar se autenticação funciona

**Passos:**
1. Abra http://localhost:3000
2. Vá para aba "Login"
3. Insira email válido
4. Insira senha correta
5. Clique em "Entrar"

**Resultado esperado:**
- ✅ Redireciona para dashboard
- ✅ Nome do usuário aparece no header
- ✅ Token armazenado no localStorage

**Debug:**
- F12 → Console → procure por erros
- F12 → Network → veja requisição POST /auth/login
- Verifique response status 200

---

### 2️⃣ Teste de Registro

**Objetivo:** Criar nova conta

**Passos:**
1. Abra http://localhost:3000
2. Clique em aba "Registrar"
3. Insira nome, email e senha
4. Clique em "Criar Conta"

**Resultado esperado:**
- ✅ Redireciona para dashboard
- ✅ Conta criada no banco de dados
- ✅ Login automático após registro

**Debug:**
- F12 → Network → POST /auth/register
- Verifique se email não existe já

---

### 3️⃣ Teste de Dashboard

**Objetivo:** Verificar carregamento de dados

**Passos:**
1. Faça login
2. Aguarde página carregar
3. Observe os componentes

**Resultado esperado:**
- ✅ Header com nome do usuário
- ✅ ProfileCard com nível/rank
- ✅ XP bar preenchida
- ✅ RadarChart renderizado (gráfico)
- ✅ MissionsCard com missões
- ✅ AchievementsCard com conquistas

**Debug:**
```javascript
// F12 → Console → Digite:
const data = JSON.parse(localStorage.getItem('currentUser'))
console.log(data)
```

---

### 4️⃣ Teste de XP Bar

**Objetivo:** Verificar progressão visual

**Verificar:**
```javascript
// F12 → Console
const xpPercent = (540 / 700) * 100  // XP atual / XP próximo level
console.log(xpPercent + '%')  // Deve ser ~77%
```

**Visualmente:**
- ✅ Barra verde preenchida
- ✅ Animação shimmer (brilho)
- ✅ Texto "540 / 700 XP"

---

### 5️⃣ Teste de Rank Badge

**Objetivo:** Verificar exibição correta

**Verificar:**
- Rank E → 🌱 Novato
- Rank D → ⚔️ Aprendiz
- Rank C → 🛡️ Guerreiro
- Rank B → 🐉 Mestre
- Rank A → ⭐ Lendário
- Rank S → 👑 Deus

**Color check:**
```css
Deve ter cor diferente para cada rank
```

---

### 6️⃣ Teste de Radar Chart

**Objetivo:** Gráfico renderiza corretamente

**Verificar:**
- ✅ Gráfico aparece
- ✅ 6 áreas (Health, Career, etc)
- ✅ Pontos nos vértices
- ✅ Fundo semi-transparente verde
- ✅ Legendas em verde

**Debug:**
```javascript
// F12 → Console
// Se houver erro do Chart.js, aparecerá aqui
```

---

### 7️⃣ Teste de Missões

**Objetivo:** Completar missão

**Passos:**
1. Vá para dashboard
2. Veja "Missões de Hoje"
3. Clique em "Completar"
4. Observe mudança

**Resultado esperado:**
- ✅ Botão muda para "✓"
- ✅ Card fica opaco
- ✅ Título com strikethrough
- ✅ Requisição POST /missions/{id}/complete

**Debug:**
```javascript
// F12 → Network
// POST /missions/1/complete
// Status deve ser 200
```

---

### 8️⃣ Teste de Settings

**Objetivo:** Ir para página de configurações

**Passos:**
1. Clique no botão ⚙️
2. Veja página de settings
3. Veja informações do usuário
4. Clique em "Sair"

**Resultado esperado:**
- ✅ Mostra email e ID
- ✅ Botão sair funciona
- ✅ Redireciona para login
- ✅ localStorage limpo

**Verify:**
```javascript
// F12 → Console
localStorage.getItem('authToken')  // Deve ser null após logout
```

---

### 9️⃣ Teste de Responsividade

**Mobile (375px):**
```
npm start -- --port 3000

F12 → Ctrl+Shift+M → Select iPhone SE
```

- ✅ Header responsivo
- ✅ Cards em coluna única
- ✅ Texto legível
- ✅ Botões clicáveis
- ✅ Sem scroll horizontal

**Tablet (768px):**
```
F12 → Select iPad
```

- ✅ Layout ajustado
- ✅ Cards bem espaçados
- ✅ Gráfico visível

---

### 🔟 Teste de Hot Reload

**Objetivo:** Verificar desenvolvimento hot reload

**Passos:**
1. Edite `src/pages/DashboardPage.js`
2. Mude algo visível (ex: cor, texto)
3. Observe página recarregar automaticamente

**Resultado esperado:**
- ✅ Página atualiza sem perder dados
- ✅ Não pede reload manual
- ✅ Dev server não interrompe

---

## 🔴 Testes de Erro

### Teste 1️⃣: Backend Desligado

**Passos:**
1. Desactive o backend
2. Tente fazer login

**Resultado esperado:**
- ✅ Mensagem: "Erro de conexão"
- ✅ Sem crash
- ✅ Console tem erro legível

---

### Teste 2️⃣: Credenciais Inválidas

**Passos:**
1. Insira email errado
2. Insira senha errada
3. Clique em "Entrar"

**Resultado esperado:**
- ✅ Mensagem de erro
- ✅ Não redireciona
- ✅ Campo mantém foco

---

### Teste 3️⃣: Token Expirado

**Simulação:**
```javascript
// F12 → Console
localStorage.removeItem('authToken')
location.reload()
```

**Resultado esperado:**
- ✅ Redireciona para login
- ✅ Sem dados na tela

---

### Teste 4️⃣: Rede Lenta

```
F12 → Network → Throttling: Slow 3G
```

**Verificar:**
- ✅ Loading spinner aparece
- ✅ Não congela interface
- ✅ Buttons desabilitados enquanto carrega

---

## 🧬 Testes de Integração

### API Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'
```

**Resultado esperado:** Status 200 + token

### API Dashboard
```bash
curl -X GET http://localhost:8000/dashboard/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Resultado esperado:** Status 200 + JSON com dados

---

## 📋 Checklist de Qualidade

- [ ] Login funciona
- [ ] Registro funciona
- [ ] Dashboard carrega
- [ ] Dados aparecem corretos
- [ ] Gráfico radar renderiza
- [ ] Missões carregam
- [ ] Completar missão funciona
- [ ] Conquistas mostram
- [ ] Header navegação funciona
- [ ] Settings página existe
- [ ] Logout limpa dados
- [ ] Responsivo no mobile
- [ ] Sem erros no console
- [ ] Interceptor adiciona token
- [ ] 401 redireciona para login
- [ ] Hot reload funciona
- [ ] Cores estão corretas
- [ ] Animações funcionam

---

## 🐛 Debug Avançado

### Ver todas as requisições
```javascript
// F12 → Network tab
// Veja todas as requisições HTTP
```

### Ver estado da autenticação
```javascript
// F12 → Console
const auth = JSON.parse(localStorage.getItem('currentUser'))
const token = localStorage.getItem('authToken')
console.log({auth, token})
```

### Ver dados do dashboard
```javascript
// F12 → Network tab
// GET /dashboard/1
// Veja response JSON
```

### Monitorar renderizações
```javascript
// Chrome DevTools → Performance tab
// Record → Interaja com app → Stop
// Veja timeline de renders
```

---

## ✨ Performance Check

```javascript
// F12 → Lighthouse
// Run audit
// Verifique:
// - Performance > 80
// - Accessibility > 80
// - Best Practices > 80
```

---

**Todos os testes passando? 🎉 Seu frontend React está pronto para produção!**

