import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function MissionsBoard({ userId }) {
  const [missions, setMissions] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadMissions();
      loadTodayStats();
    }
  }, [userId]);

  const loadMissions = async () => {
    try {
      const response = await axios.get(`${API_URL}/missions/${userId}`);
      setMissions(response.data);
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    }
  };

  const loadTodayStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/missions/${userId}/process-today`);
      setTodayStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async (missionId) => {
    try {
      await axios.post(`${API_URL}/missions/${missionId}/complete`);
      loadMissions();
      loadTodayStats();
      alert('✅ Missão completada!');
    } catch (error) {
      console.error('Erro ao completar missão:', error);
      alert('Erro: ' + error.response?.data?.detail || error.message);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#22C55E',
      medium: '#3B82F6',
      hard: '#EF4444'
    };
    return colors[difficulty] || '#999';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: '⭐ Fácil',
      medium: '⭐⭐ Médio',
      hard: '⭐⭐⭐ Difícil'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <div style={styles.container}>
      <h2>🎮 Missões do Dia</h2>

      {todayStats && (
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{todayStats.missions_completed}/{todayStats.missions_today}</div>
            <div style={styles.statLabel}>Completadas</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{todayStats.completion_rate}%</div>
            <div style={styles.statLabel}>Taxa Conclusão</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{todayStats.total_xp_with_bonus}</div>
            <div style={styles.statLabel}>XP Total</div>
          </div>
          {todayStats.bonus_streak > 0 && (
            <div style={styles.statCard}>
              <div style={styles.statValue}>+{todayStats.bonus_streak}</div>
              <div style={styles.statLabel}>Bônus Streak</div>
            </div>
          )}
        </div>
      )}

      <div style={styles.missionsGrid}>
        {loading ? (
          <p>Carregando missões...</p>
        ) : missions.length === 0 ? (
          <p>Nenhuma missão para hoje.</p>
        ) : (
          missions.map((mission) => (
            <div
              key={mission.id}
              style={{
                ...styles.missionCard,
                opacity: mission.completed ? 0.6 : 1
              }}
            >
              <div style={styles.missionHeader}>
                <h4 style={styles.missionTitle}>{mission.title}</h4>
                <span
                  style={{
                    ...styles.difficultyBadge,
                    backgroundColor: getDifficultyColor(mission.difficulty)
                  }}
                >
                  {getDifficultyLabel(mission.difficulty)}
                </span>
              </div>

              <p style={styles.description}>{mission.description}</p>

              <div style={styles.missionInfo}>
                <span style={styles.area}>📍 {mission.area_name}</span>
                <span style={styles.xp}>⭐ {mission.xp_reward} XP</span>
              </div>

              {mission.target_metric_value && (
                <div style={styles.target}>
                  <span>🎯 Meta: {mission.target_metric_value}</span>
                </div>
              )}

              <div style={styles.missionActions}>
                {!mission.completed ? (
                  <button
                    onClick={() => completeMission(mission.id)}
                    style={styles.completeButton}
                  >
                    ✅ Completar
                  </button>
                ) : (
                  <div style={styles.completedLabel}>✓ Completada</div>
                )}
              </div>

              {mission.reason && (
                <div style={styles.reason}>
                  <small>ℹ️ {mission.reason}</small>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <button onClick={() => {
        loadMissions();
        loadTodayStats();
      }} style={styles.refreshButton}>
        🔄 Atualizar
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1a1f2e',
    borderRadius: '8px',
    color: '#fff'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  statCard: {
    backgroundColor: '#2d3436',
    padding: '15px',
    borderRadius: '6px',
    textAlign: 'center',
    border: '2px solid #3B82F6'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#aaa'
  },
  missionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  missionCard: {
    backgroundColor: '#2d3436',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #3B82F6',
    transition: 'all 0.3s'
  },
  missionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '10px'
  },
  missionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    flex: 1
  },
  difficultyBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#fff',
    whiteSpace: 'nowrap'
  },
  description: {
    margin: '8px 0',
    fontSize: '14px',
    color: '#ccc'
  },
  missionInfo: {
    display: 'flex',
    gap: '15px',
    margin: '10px 0',
    fontSize: '14px'
  },
  area: {
    backgroundColor: '#3d4451',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  xp: {
    color: '#FACC15',
    fontWeight: 'bold'
  },
  target: {
    backgroundColor: '#3d4451',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '10px'
  },
  missionActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px'
  },
  completeButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#22C55E',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  completedLabel: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#1a3a2a',
    color: '#22C55E',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  reason: {
    marginTop: '10px',
    color: '#999',
    fontSize: '12px',
    borderTop: '1px solid #3d4451',
    paddingTop: '8px'
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#3B82F6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};
