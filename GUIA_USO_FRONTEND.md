# 🚀 GUIA RÁPIDO - SoloLeveling Frontend

## 🎯 COMO USAR O SISTEMA AGORA

### 1️⃣ **Iniciar o Backend**
```bash
cd C:\Users\Guilherme.amaral\Documents\SoloLeveling
python -m uvicorn app.main:app --reload
```
✅ Backend rodando em: `http://localhost:8000`

---

### 2️⃣ **Iniciar o Frontend**
```bash
cd C:\Users\Guilherme.amaral\Documents\SoloLeveling\frontend-react
npm start
```
✅ Frontend rodando em: `http://localhost:3000`

---

## 🌐 **PÁGINAS DISPONÍVEIS**

### 🔐 Login/Registro
**URL:** `http://localhost:3000/login`
- Faça login ou crie uma conta
- JWT token válido por 7 dias

### 📊 Dashboard
**URL:** `http://localhost:3000/dashboard`
- Veja seu perfil, level, rank e XP
- Radar de áreas de vida
- Missões do dia
- Conquistas recentes

### 👤 Perfil
**URL:** `http://localhost:3000/profile`
- **Ver estatísticas completas:**
  - XP Total
  - Sequência (streak)
  - Conquistas
  - Dias ativos
- **Editar perfil:**
  - Biografia
  - Título personalizado
  - Perfil público/privado
- **Compartilhar perfil:**
  - Link público

### 📜 Histórico
**URL:** `http://localhost:3000/history`
- Timeline visual de eventos
- Filtros: Todos, Semana, Mês
- Eventos coloridos por tipo

### 🔔 Notificações
- Clique no **sino 🔔** no header
- Veja notificações não lidas
- Marque como lida (individual ou todas)

### ⚙️ Configurações
**URL:** `http://localhost:3000/settings`
- Ajuste preferências
- Personalizações

---

## 🎮 **FLUXO DE USO TÍPICO**

### 1. **Primeiro Acesso**
1. Acesse `/login`
2. Crie uma conta (Register)
3. Faça login
4. Você será redirecionado para `/dashboard`

### 2. **Uso Diário**
1. Login automático (token salvo)
2. Dashboard mostra:
   - Suas missões do dia
   - Progresso atual
   - Foco semanal
3. Complete missões
4. Ganhe XP
5. Suba de level/rank

### 3. **Explorar Perfil**
1. Clique em **👤 Perfil** no header
2. Veja suas estatísticas
3. Edite biografia/título
4. Compartilhe seu progresso

### 4. **Ver Evolução**
1. Clique em **📜 Histórico**
2. Veja sua jornada
3. Filtre por período
4. Acompanhe marcos alcançados

---

## 🎨 **DESTAQUES VISUAIS**

### **Ranks Disponíveis:**
- 🟤 **Rank E** - Iniciante
- 🟢 **Rank D** - Bronze
- 🔵 **Rank C** - Prata
- 🟣 **Rank B** - Ouro
- 🔴 **Rank A** - Platina
- 🟡 **Rank S** - Lendário

### **Sistema de Levels:**
- Level 1-10: Novato
- Level 11-20: Aprendiz
- Level 21-30: Aventureiro
- Level 31-40: Especialista
- Level 41-50: Mestre
- Level 51+: Lenda

---

## 🛠️ **COMANDOS ÚTEIS**

### **Parar servidores:**
- Backend: `Ctrl + C` no terminal
- Frontend: `Ctrl + C` no terminal

### **Reiniciar frontend:**
```bash
cd frontend-react
npm start
```

### **Reiniciar backend:**
```bash
cd C:\Users\Guilherme.amaral\Documents\SoloLeveling
python -m uvicorn app.main:app --reload
```

### **Ver Swagger (API Docs):**
```
http://localhost:8000/docs
```

---

## 📱 **RESPONSIVIDADE**

O sistema funciona perfeitamente em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

---

## 🎉 **CONQUISTAS IMPLEMENTADAS**

Atualmente há conquistas para:
- ✅ Primeira missão completada
- ✅ 7 dias de streak
- ✅ Subir de rank
- ✅ 1000 XP acumulado
- ✅ Melhorar área mais fraca

---

## 🚨 **TROUBLESHOOTING**

### **Erro: "Module not found"**
```bash
cd frontend-react
npm install
```

### **Erro: "Port already in use"**
- Verifique se já há instância rodando
- Mude a porta no comando

### **Token expirado:**
- Faça logout e login novamente
- Token dura 7 dias

### **Dashboard não carrega:**
- Verifique se backend está rodando
- Verifique console do navegador (F12)
- Confirme que fez login

---

## 💡 **DICAS PRO**

1. **Use F12** para ver console e debugar
2. **Auto-save:** Dashboard atualiza a cada 30s
3. **Notificações:** Atualizam a cada 1 minuto
4. **Navegação rápida:** Use os botões do header
5. **Ctrl+Shift+R** para refresh forçado

---

## 🎯 **PRÓXIMAS FEATURES**

Planejado para FASE 4:
- 📊 Gráficos de evolução
- 🏆 Leaderboard global
- 📧 Email notifications
- 💾 Histórico persistente no banco
- 🎮 Missões ainda mais dinâmicas
- 🔥 Sistema de temporadas

---

**Status atual:** ✅ Sistema 100% funcional e profissional
**Pronto para:** Demonstrações, testes e uso real
**Próximo passo:** Persistir dados de histórico e notificações no banco

