const API_URL = "http://localhost:8000";
let currentUser = null;
let authToken = null;
let radarChart = null;
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showDashboard();
    } else {
        showLogin();
    }
    document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
    document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
});
function showLogin() {
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("dashboardScreen").classList.add("hidden");
}
function showDashboard() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("dashboardScreen").classList.remove("hidden");
    loadDashboardData();
}
function showLoginTab() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
    document.querySelectorAll(".tab")[0].classList.add("active");
    document.querySelectorAll(".tab")[1].classList.remove("active");
}
function showRegisterTab() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
    document.querySelectorAll(".tab")[0].classList.remove("active");
    document.querySelectorAll(".tab")[1].classList.add("active");
}
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errorDiv = document.getElementById("loginError");
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            errorDiv.textContent = error.detail || "Erro ao fazer login";
            return;
        }
        const data = await response.json();
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        authToken = data.access_token;
        currentUser = data.user;
        showDashboard();
    } catch (error) {
        errorDiv.textContent = "Erro de conexão. Verifique se o servidor está rodando.";
    }
}
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const errorDiv = document.getElementById("registerError");
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            errorDiv.textContent = error.detail || "Erro ao registrar";
            return;
        }
        const data = await response.json();
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        authToken = data.access_token;
        currentUser = data.user;
        showDashboard();
    } catch (error) {
        errorDiv.textContent = "Erro de conexão.";
    }
}
function logout() {
    localStorage.clear();
    authToken = null;
    currentUser = null;
    showLogin();
}
async function loadDashboardData() {
    if (!currentUser || !authToken) return showLogin();
    try {
        const response = await fetch(`${API_URL}/dashboard/${currentUser.id}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!response.ok) {
            if (response.status === 401) return logout();
            throw new Error("Erro");
        }
        const data = await response.json();
        renderDashboard(data);
    } catch (error) {
        console.error(error);
    }
}
function renderDashboard(data) {
    document.getElementById("userName").textContent = data.user.name;
    document.getElementById("profileName").textContent = data.user.name;
    document.getElementById("userLevel").textContent = data.progress.level;
    document.getElementById("rankEmoji").textContent = data.rank.emoji;
    document.getElementById("rankName").textContent = data.rank.name;
    document.getElementById("rankLetter").textContent = data.rank.current;
    document.getElementById("xpFill").style.width = `${data.progress.xp_progress_percentage}%`;
    document.getElementById("xpText").textContent = `${data.progress.xp} / ${data.progress.next_level_xp} XP`;
    document.getElementById("streakValue").textContent = data.progress.streak;
    document.getElementById("achievementsValue").textContent = data.achievements.total;
    document.getElementById("lifeScoreValue").textContent = data.scores.life_score.toFixed(1);
    renderRadarChart(data.radar);
    renderFocus(data.focus);
    renderMissions(data.missions);
    renderAchievements(data.achievements);
}
function renderRadarChart(radarData) {
    const ctx = document.getElementById("radarChart").getContext("2d");
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: radarData.labels,
            datasets: [{
                label: "Score",
                data: radarData.values,
                backgroundColor: "rgba(108, 92, 231, 0.2)",
                borderColor: "rgba(108, 92, 231, 1)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2, color: "#b0b3b8" }, grid: { color: "#3a4354" }, pointLabels: { color: "#e4e6eb" } } },
            plugins: { legend: { display: false } }
        }
    });
}
function renderFocus(focus) {
    const el = document.getElementById("focusContent");
    if (!focus) return el.innerHTML = '<p class="no-data">Sem foco ativo</p>';
    el.innerHTML = `<h4>?? ${focus.area}</h4><p>Multiplicador: ${focus.xp_multiplier}x XP</p><p>Dias restantes: ${focus.days_remaining}</p>`;
}
function renderMissions(missions) {
    const el = document.getElementById("missionsList");
    if (!missions.today || missions.today.length === 0) return el.innerHTML = '<p class="no-data">Nenhuma missão hoje</p>';
    el.innerHTML = missions.today.map(m => `<div class="mission-item ${m.completed ? "completed" : ""}"><div class="mission-checkbox ${m.completed ? "checked" : ""}"></div><div><h4>${m.title}</h4><p>${m.description}</p><small>${m.difficulty} • ${m.xp_reward} XP</small></div></div>`).join("");
}
function renderAchievements(achievements) {
    const el = document.getElementById("achievementsList");
    if (!achievements.recent || achievements.recent.length === 0) return el.innerHTML = '<p class="no-data">Nenhuma conquista ainda</p>';
    el.innerHTML = achievements.recent.map(a => `<div class="achievement-item"><div class="achievement-icon">${a.icon}</div><div class="achievement-info"><h4>${a.title}</h4><p class="achievement-desc">${a.description}</p><small>+${a.xp_reward} XP</small></div></div>`).join("");
}
async function showSettings() {
    document.getElementById("settingsModal").classList.remove("hidden");
    try {
        const response = await fetch(`${API_URL}/profile/${currentUser.id}/settings`, { headers: { "Authorization": `Bearer ${authToken}` } });
        if (response.ok) {
            const s = await response.json();
            document.getElementById("themeSelect").value = s.theme;
            document.getElementById("visibilitySelect").value = s.profile_visibility;
            document.getElementById("notificationsCheck").checked = s.notifications_enabled;
            document.getElementById("weeklyReportCheck").checked = s.weekly_report_enabled;
        }
    } catch (e) { console.error(e); }
}
function closeSettings() { document.getElementById("settingsModal").classList.add("hidden"); }
async function changeTheme() { document.body.setAttribute("data-theme", document.getElementById("themeSelect").value); await updateSettings({ theme: document.getElementById("themeSelect").value }); }
async function changeVisibility() { await updateSettings({ profile_visibility: document.getElementById("visibilitySelect").value }); }
async function toggleNotifications() { await updateSettings({ notifications_enabled: document.getElementById("notificationsCheck").checked }); }
async function toggleWeeklyReport() { await updateSettings({ weekly_report_enabled: document.getElementById("weeklyReportCheck").checked }); }
async function updateSettings(data) { try { await fetch(`${API_URL}/profile/${currentUser.id}/settings`, { method: "PUT", headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json" }, body: JSON.stringify(data) }); } catch (e) {} }
async function loadStats() {
    const modal = document.getElementById("statsModal");
    const content = document.getElementById("statsModalContent");
    modal.classList.remove("hidden");
    try {
        const response = await fetch(`${API_URL}/profile/${currentUser.id}/stats`, { headers: { "Authorization": `Bearer ${authToken}` } });
        if (response.ok) {
            const s = await response.json();
            content.innerHTML = `<div class="stats-grid"><div class="stat"><span class="stat-icon">??</span><span class="stat-label">Dias Ativos</span><span class="stat-value">${s.total_days_active}</span></div><div class="stat"><span class="stat-icon">??</span><span class="stat-label">Total de Logs</span><span class="stat-value">${s.total_logs}</span></div></div><div style="margin-top: 2rem;"><p><strong>Tendência:</strong> ${s.trend}</p><p><strong>Área Forte:</strong> ${s.most_improved_area || "N/A"}</p></div>`;
        }
    } catch (e) { content.innerHTML = '<p>Erro</p>'; }
}
function closeStats() { document.getElementById("statsModal").classList.add("hidden"); }
