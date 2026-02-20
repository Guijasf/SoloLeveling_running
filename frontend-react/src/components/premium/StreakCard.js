import React from 'react';
import './StreakCard.css';

function StreakCard({ streak }) {
  const getStreakLevel = (days) => {
    if (days >= 100) return { level: 'Diamante', emoji: '💎', color: '#06B6D4', next: null };
    if (days >= 50) return { level: 'Ouro', emoji: '🏆', color: '#FACC15', next: 100 };
    if (days >= 30) return { level: 'Prata', emoji: '🥈', color: '#9CA3AF', next: 50 };
    if (days >= 7) return { level: 'Bronze', emoji: '🥉', color: '#D97706', next: 30 };
    return { level: 'Iniciante', emoji: '🔥', color: '#EF4444', next: 7 };
  };

  const streakInfo = getStreakLevel(streak);
  const progress = streakInfo.next ? ((streak / streakInfo.next) * 100).toFixed(0) : 100;
  const daysRemaining = streakInfo.next ? streakInfo.next - streak : 0;

  const getMotivationalMessage = () => {
    if (streak === 0) return "Comece sua jornada hoje!";
    if (streak < 7) return "Continue assim! Cada dia conta.";
    if (streak < 30) return "Você está criando um hábito real!";
    if (streak < 50) return "Incrível! Não pare agora.";
    if (streak < 100) return "Você é imparável! Continue forte.";
    return "Lenda! Você dominou a consistência.";
  };

  return (
    <div className="streak-card card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">🔥</span>
          Sequência
        </h2>
        <div className="streak-badge" style={{ background: streakInfo.color }}>
          {streakInfo.emoji} {streakInfo.level}
        </div>
      </div>

      <div className="streak-content">
        <div className="streak-count">
          <span className="streak-number text-gradient-yellow">{streak}</span>
          <span className="streak-label">dias consecutivos</span>
        </div>

        {streakInfo.next && (
          <div className="streak-progress">
            <div className="progress-info">
              <span className="progress-label">Próximo nível: {streakInfo.next} dias</span>
              <span className="progress-percentage">{progress}%</span>
            </div>
            <div className="progress-bar-modern">
              <div
                className="progress-fill progress-fill-yellow"
                style={{ width: `${progress}%` }}
              >
                <div className="progress-shine"></div>
              </div>
            </div>
            <div className="days-remaining">
              <span className="days-count">{daysRemaining}</span>
              <span className="days-label">dias restantes</span>
            </div>
          </div>
        )}

        {!streakInfo.next && (
          <div className="streak-maxed">
            <span className="maxed-icon">👑</span>
            <span className="maxed-text">Nível Máximo Alcançado!</span>
          </div>
        )}

        <div className="motivational-message">
          <div className="message-box">
            <span className="message-quote">"</span>
            <p className="message-text">{getMotivationalMessage()}</p>
          </div>
        </div>

        <div className="streak-stats">
          <div className="streak-stat">
            <span className="stat-icon">📅</span>
            <div className="stat-info">
              <span className="stat-number">{Math.floor(streak / 7)}</span>
              <span className="stat-label">semanas</span>
            </div>
          </div>
          <div className="streak-stat">
            <span className="stat-icon">⚡</span>
            <div className="stat-info">
              <span className="stat-number">{streak > 0 ? '100' : '0'}%</span>
              <span className="stat-label">hoje</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakCard;

