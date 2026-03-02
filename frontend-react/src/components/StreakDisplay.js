import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function StreakDisplay({ userId }) {
  const [streak, setStreak] = useState(null);
  const [bonus, setBonus] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadStreakData();
    }
  }, [userId]);

  const loadStreakData = async () => {
    try {
      setLoading(true);
      const [streakRes, bonusRes, leaderboardRes] = await Promise.all([
        axios.get(`${API_URL}/streak/${userId}`),
        axios.get(`${API_URL}/streak/${userId}/bonus`),
        axios.get(`${API_URL}/streak/${userId}/leaderboard`)
      ]);
      setStreak(streakRes.data);
      setBonus(bonusRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (error) {
      console.error('Erro ao carregar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <h2>🔥 Seu Streak</h2>

      {streak && (
        <div style={styles.mainStreak}>
          <div style={styles.streakBadge}>
            <div style={styles.badgeEmoji}>{streak.display.badge}</div>
            <div style={styles.streakNumber}>{streak.current_streak}</div>
            <div style={styles.streakLabel}>DIAS</div>
            <div style={styles.levelName}>{streak.display.level}</div>
          </div>

          <div style={styles.streakDetails}>
            <div style={styles.detail}>
              <span>💪 Melhor Streak: {streak.best_streak} dias</span>
            </div>
            <div style={styles.detail}>
              <span>⚡ XP Multiplier: {streak.multiplier}x</span>
            </div>
            <div style={styles.detail}>
              <span>📅 Última Atividade: {streak.last_activity}</span>
            </div>
          </div>
        </div>
      )}

      {bonus && (
        <div style={styles.bonusSection}>
          <h3>💰 Bonus Ativo</h3>
          <div style={styles.bonusItem}>
            <span>XP Extra: +{bonus.bonus_xp}</span>
          </div>
          <div style={styles.bonusItem}>
            <span>Multiplicador: {bonus.multiplier}x</span>
          </div>

          {bonus.milestone && bonus.milestone.milestone_reached && (
            <div style={styles.milestoneAlert}>
              <div style={styles.milestoneEmoji}>{bonus.milestone.emoji}</div>
              <div>
                <h4>{bonus.milestone.message}</h4>
                <p>🎉 Você desbloqueou +{bonus.milestone.bonus_xp} XP!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {leaderboard && (
        <div style={styles.leaderboardSection}>
          <h3>🏆 Leaderboard Top 10</h3>
          <div style={styles.leaderboard}>
            {leaderboard.leaderboard.map((user, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.leaderboardItem,
                  backgroundColor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#2d3436'
                }}
              >
                <span style={styles.position}>#{user.position}</span>
                <span style={styles.badge}>{user.badge}</span>
                <span style={styles.streakCount}>{user.streak} dias</span>
              </div>
            ))}
          </div>

          {leaderboard.user_position && (
            <div style={styles.userPosition}>
              <h4>Sua Posição:</h4>
              <div style={styles.userPositionItem}>
                <span>#{leaderboard.user_position.position}</span>
                <span>{leaderboard.user_position.streak} dias</span>
              </div>
            </div>
          )}
        </div>
      )}

      <button onClick={loadStreakData} style={styles.refreshButton}>
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
  mainStreak: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  streakBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d3436',
    padding: '30px',
    borderRadius: '12px',
    border: '3px solid #3B82F6',
    minWidth: '150px'
  },
  badgeEmoji: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  streakNumber: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#FACC15'
  },
  streakLabel: {
    fontSize: '12px',
    color: '#aaa',
    marginTop: '5px'
  },
  levelName: {
    fontSize: '16px',
    color: '#3B82F6',
    marginTop: '8px',
    fontWeight: 'bold'
  },
  streakDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
    minWidth: '200px'
  },
  detail: {
    backgroundColor: '#2d3436',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '16px'
  },
  bonusSection: {
    backgroundColor: '#2d3436',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #FACC15'
  },
  bonusItem: {
    padding: '10px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FACC15'
  },
  milestoneAlert: {
    backgroundColor: '#1a3a2a',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '15px',
    border: '2px solid #22C55E',
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  milestoneEmoji: {
    fontSize: '36px'
  },
  leaderboardSection: {
    marginTop: '20px'
  },
  leaderboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px',
    borderRadius: '6px',
    fontWeight: 'bold'
  },
  position: {
    minWidth: '40px',
    fontSize: '18px'
  },
  badge: {
    fontSize: '24px',
    minWidth: '30px'
  },
  streakCount: {
    flex: 1,
    textAlign: 'right'
  },
  userPosition: {
    backgroundColor: '#2d3436',
    padding: '15px',
    borderRadius: '6px',
    border: '2px solid #3B82F6'
  },
  userPositionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: 'bold'
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
