import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ==================== GOALS COMPONENT ====================
export const GoalsComponent = ({ userId }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'other',
    target_value: '',
    priority: 3,
    reward_xp: 100,
    user_id: userId
  });

  useEffect(() => {
    loadGoals();
    loadStats();
  }, [userId]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${userId}/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    }
  };

  const createGoal = async () => {
    try {
      await axios.post(`${API_URL}/goals`, newGoal);
      setNewGoal({
        title: '',
        description: '',
        category: 'other',
        target_value: '',
        priority: 3,
        reward_xp: 100,
        user_id: userId
      });
      setShowForm(false);
      loadGoals();
      loadStats();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    }
  };

  const completeGoal = async (goalId) => {
    try {
      await axios.post(`${API_URL}/goals/${userId}/${goalId}/complete`);
      loadGoals();
      loadStats();
    } catch (error) {
      console.error('Erro ao completar meta:', error);
    }
  };

  const categoryEmoji = {
    financial: '💰',
    weight: '⚖️',
    habit: '🔄',
    career: '💼',
    health: '💪',
    relationships: '❤️',
    learning: '📚',
    other: '🎯'
  };

  return (
    <div className="goals-container">
      <h2>🎯 Minhas Metas</h2>

      {stats && (
        <div className="goals-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total_goals}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.completed_goals}</span>
            <span className="stat-label">Completas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.completion_rate}%</span>
            <span className="stat-label">Taxa</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">+{stats.total_xp_earned}</span>
            <span className="stat-label">XP Ganho</span>
          </div>
        </div>
      )}

      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : '+ Nova Meta'}
      </button>

      {showForm && (
        <div className="goal-form">
          <input
            type="text"
            placeholder="Título da meta"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <textarea
            placeholder="Descrição"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          />
          <select
            value={newGoal.category}
            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
          >
            <option value="other">Outro</option>
            <option value="financial">Financeiro</option>
            <option value="weight">Peso</option>
            <option value="habit">Hábito</option>
            <option value="career">Carreira</option>
            <option value="health">Saúde</option>
            <option value="relationships">Relacionamentos</option>
            <option value="learning">Aprendizado</option>
          </select>
          <input
            type="number"
            placeholder="Meta (ex: 5000 ou 75kg)"
            value={newGoal.target_value}
            onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
          />
          <input
            type="range"
            min="1"
            max="5"
            value={newGoal.priority}
            onChange={(e) => setNewGoal({ ...newGoal, priority: parseInt(e.target.value) })}
          />
          <span>Prioridade: {newGoal.priority}/5</span>
          <button onClick={createGoal}>Criar Meta</button>
        </div>
      )}

      <div className="goals-list">
        {loading ? (
          <p>Carregando...</p>
        ) : goals.length === 0 ? (
          <p>Nenhuma meta ainda. Crie sua primeira!</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className={`goal-card status-${goal.status}`}>
              <div className="goal-header">
                <h3>
                  {categoryEmoji[goal.category]} {goal.title}
                </h3>
                <span className="goal-xp">+{goal.reward_xp} XP</span>
              </div>
              <p>{goal.description}</p>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: goal.target_value
                        ? `${(goal.current_progress / goal.target_value) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {goal.current_progress} / {goal.target_value || 'N/A'}
                </span>
              </div>
              <div className="goal-actions">
                <span className={`status-badge status-${goal.status}`}>
                  {goal.status}
                </span>
                {goal.status !== 'completed' && (
                  <button onClick={() => completeGoal(goal.id)} className="btn-success">
                    ✓ Completar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .goals-container {
          padding: 20px;
          background: #0B0F1A;
          border-radius: 12px;
          color: #fff;
        }

        .goals-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #3B82F6;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }

        .btn-primary {
          padding: 10px 20px;
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .goal-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 15px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .goal-form input,
        .goal-form textarea,
        .goal-form select {
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 4px;
        }

        .goal-form button {
          padding: 10px;
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .goals-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .goal-card {
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          border-left: 4px solid #3B82F6;
        }

        .goal-card.status-completed {
          border-left-color: #22C55E;
          opacity: 0.7;
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .goal-xp {
          background: rgba(34, 197, 94, 0.2);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          color: #22C55E;
        }

        .goal-progress {
          margin: 10px 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3B82F6, #8B5CF6);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
          display: block;
        }

        .goal-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .status-badge.status-completed {
          background: rgba(34, 197, 94, 0.2);
          color: #22C55E;
        }

        .status-badge.status-in_progress {
          background: rgba(59, 130, 246, 0.2);
          color: #3B82F6;
        }

        .btn-success {
          padding: 6px 12px;
          background: #22C55E;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

// ==================== STREAK COMPONENT ====================
export const StreakComponent = ({ userId }) => {
  const [streak, setStreak] = useState(null);
  const [bonus, setBonus] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreak();
  }, [userId]);

  const loadStreak = async () => {
    try {
      setLoading(true);
      const [streakRes, bonusRes, boardRes] = await Promise.all([
        axios.get(`${API_URL}/streak/${userId}`),
        axios.get(`${API_URL}/streak/${userId}/bonus`),
        axios.get(`${API_URL}/streak/${userId}/leaderboard`)
      ]);

      setStreak(streakRes.data);
      setBonus(bonusRes.data);
      setLeaderboard(boardRes.data.leaderboard);
    } catch (error) {
      console.error('Erro ao carregar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !streak) return <div>Carregando streak...</div>;

  const display = streak.display || {};

  return (
    <div className="streak-container">
      <h2>🔥 Sua Sequência</h2>

      <div className="streak-main">
        <div className="streak-circle">
          <div className="streak-content">
            <div className="streak-badge">{display.badge}</div>
            <div className="streak-days">{streak.current_streak}</div>
            <div className="streak-label">Dias</div>
          </div>
        </div>

        <div className="streak-details">
          <div className="detail-row">
            <span>Melhor Série</span>
            <strong>{streak.best_streak} dias</strong>
          </div>
          <div className="detail-row">
            <span>Nível</span>
            <strong>{display.level}</strong>
          </div>
          <div className="detail-row">
            <span>Multiplicador XP</span>
            <strong>{display.xp_multiplier}x</strong>
          </div>
          {bonus && (
            <>
              <div className="detail-row">
                <span>Bônus XP Ativo</span>
                <strong>+{bonus.bonus_xp} XP</strong>
              </div>
              {bonus.milestone && bonus.milestone.milestone_reached && (
                <div className="milestone-alert">
                  <p>🎉 {bonus.milestone.message}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="leaderboard">
        <h3>🏆 Top 10</h3>
        <div className="leaderboard-list">
          {leaderboard.map((entry, idx) => (
            <div
              key={idx}
              className={`leaderboard-entry ${entry.user_id === userId ? 'my-entry' : ''}`}
            >
              <span className="position">#{entry.position}</span>
              <span className="badge">{entry.badge}</span>
              <span className="streak">{entry.streak} dias</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .streak-container {
          padding: 20px;
          background: #0B0F1A;
          border-radius: 12px;
          color: #fff;
        }

        .streak-main {
          display: flex;
          gap: 30px;
          margin: 20px 0;
          align-items: center;
        }

        .streak-circle {
          position: relative;
          width: 180px;
          height: 180px;
          background: conic-gradient(
            #FF6B6B 0deg,
            #4ECDC4 90deg,
            #45B7D1 180deg,
            #96CEB4 270deg,
            #FF6B6B 360deg
          );
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .streak-content {
          width: 160px;
          height: 160px;
          background: #0B0F1A;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .streak-badge {
          font-size: 48px;
        }

        .streak-days {
          font-size: 42px;
          font-weight: bold;
          color: #3B82F6;
        }

        .streak-label {
          font-size: 12px;
          color: #999;
        }

        .streak-details {
          flex: 1;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .milestone-alert {
          background: rgba(34, 197, 94, 0.1);
          border-left: 3px solid #22C55E;
          padding: 10px;
          margin-top: 10px;
          border-radius: 4px;
        }

        .milestone-alert p {
          margin: 0;
          color: #22C55E;
          font-weight: bold;
        }

        .leaderboard {
          margin-top: 30px;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .leaderboard-entry {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          transition: background 0.2s;
        }

        .leaderboard-entry:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .leaderboard-entry.my-entry {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.5);
        }

        .position {
          font-weight: bold;
          width: 40px;
        }

        .badge {
          font-size: 24px;
          width: 30px;
        }

        .streak {
          flex: 1;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

// ==================== MISSIONS COMPONENT ====================
export const MissionsComponent = ({ userId }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailyStats, setDailyStats] = useState(null);

  useEffect(() => {
    loadMissions();
    loadDailyStats();
  }, [userId]);

  const loadMissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/missions/${userId}`);
      setMissions(response.data);
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/missions/${userId}/process-today`);
      setDailyStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    }
  };

  const completeMission = async (missionId) => {
    try {
      await axios.post(`${API_URL}/missions/${missionId}/complete`);
      loadMissions();
      loadDailyStats();
    } catch (error) {
      console.error('Erro ao completar missão:', error);
    }
  };

  const areaColor = {
    Health: '#22C55E',
    Career: '#3B82F6',
    Finance: '#FACC15',
    Relationships: '#FF6B6B',
    Mind: '#8B5CF6'
  };

  return (
    <div className="missions-container">
      <h2>🎮 Missões do Dia</h2>

      {dailyStats && (
        <div className="mission-stats">
          <div className="stat">
            <span className="value">{dailyStats.missions_completed}/{dailyStats.missions_today}</span>
            <span className="label">Completadas</span>
          </div>
          <div className="stat">
            <span className="value">{dailyStats.completion_rate}%</span>
            <span className="label">Taxa</span>
          </div>
          <div className="stat">
            <span className="value">+{dailyStats.total_xp_with_bonus}</span>
            <span className="label">XP Total</span>
          </div>
        </div>
      )}

      <div className="missions-list">
        {loading ? (
          <p>Carregando...</p>
        ) : missions.length === 0 ? (
          <p>Nenhuma missão gerada ainda. Complete uma métrica para gerar!</p>
        ) : (
          missions.map((mission) => (
            <div key={mission.id} className={`mission-card ${mission.completed ? 'completed' : ''}`}>
              <div className="mission-header">
                <h3>{mission.title}</h3>
                <span className="xp-reward">+{mission.xp_reward} XP</span>
              </div>
              <p className="description">{mission.description}</p>
              <div className="mission-footer">
                <span
                  className="area-tag"
                  style={{ backgroundColor: areaColor[mission.area_name] || '#666' }}
                >
                  {mission.area_name}
                </span>
                <span className="difficulty">
                  {mission.difficulty === 'easy' && '⭐'}
                  {mission.difficulty === 'medium' && '⭐⭐'}
                  {mission.difficulty === 'hard' && '⭐⭐⭐'}
                </span>
                {!mission.completed && (
                  <button
                    onClick={() => completeMission(mission.id)}
                    className="btn-complete"
                  >
                    ✓ Completada
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .missions-container {
          padding: 20px;
          background: #0B0F1A;
          border-radius: 12px;
          color: #fff;
        }

        .mission-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin: 20px 0;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .stat .value {
          font-size: 28px;
          font-weight: bold;
          color: #3B82F6;
        }

        .stat .label {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }

        .missions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .mission-card {
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .mission-card:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mission-card.completed {
          opacity: 0.6;
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.5);
          text-decoration: line-through;
        }

        .mission-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .xp-reward {
          background: rgba(252, 202, 21, 0.2);
          padding: 4px 8px;
          border-radius: 4px;
          color: #FACC15;
          font-weight: bold;
        }

        .description {
          font-size: 14px;
          color: #ccc;
          margin: 10px 0;
        }

        .mission-footer {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .area-tag {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: white;
          font-weight: bold;
        }

        .difficulty {
          flex: 1;
        }

        .btn-complete {
          padding: 6px 12px;
          background: #22C55E;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
        }

        .btn-complete:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
};

// ==================== STATISTICS COMPONENT ====================
export const StatisticsComponent = ({ userId }) => {
  const [stats, setStats] = useState([
    { label: 'Total XP', value: 0, icon: '⭐' },
    { label: 'Nível', value: 0, icon: '🎮' },
    { label: 'Rank', value: 'E', icon: '🏆' },
    { label: 'Streak', value: 0, icon: '🔥' }
  ]);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const streakRes = await axios.get(`${API_URL}/streak/${userId}`);
      const data = streakRes.data;

      setStats([
        { label: 'Total XP', value: 0, icon: '⭐', color: '#3B82F6' },
        { label: 'Nível', value: 0, icon: '🎮', color: '#8B5CF6' },
        { label: 'Rank', value: 'C', icon: '🏆', color: '#FACC15' },
        { label: 'Streak', value: `${data.current_streak} dias`, icon: '🔥', color: '#FF6B6B' }
      ]);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return (
    <div className="stats-container">
      <h2>📊 Estatísticas</h2>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .stats-container {
          padding: 20px;
          background: #0B0F1A;
          border-radius: 12px;
          color: #fff;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .stat-card:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .stat-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #3B82F6;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};
