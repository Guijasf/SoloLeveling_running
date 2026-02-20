import React from 'react';
import './EvolutionCard.css';

function EvolutionCard({ level, rank, totalXp, currentXp, nextLevelXp, xpPercentage }) {
  const getRankEmoji = (rank) => {
    const emojis = {
      'S': '👑',
      'A': '⭐',
      'B': '💎',
      'C': '🔷',
      'D': '🔹',
      'E': '⚪'
    };
    return emojis[rank] || '⚪';
  };

  const getRankColor = (rank) => {
    const colors = {
      'S': 'linear-gradient(135deg, #FACC15, #EAB308)',
      'A': 'linear-gradient(135deg, #EF4444, #DC2626)',
      'B': 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      'C': 'linear-gradient(135deg, #3B82F6, #2563EB)',
      'D': 'linear-gradient(135deg, #22C55E, #16A34A)',
      'E': 'linear-gradient(135deg, #6B7280, #4B5563)'
    };
    return colors[rank] || colors['E'];
  };

  return (
    <div className="evolution-card card card-premium">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📈</span>
          Evolução
        </h2>
      </div>

      <div className="evolution-content">
        <div className="rank-display" style={{ background: getRankColor(rank) }}>
          <div className="rank-emoji">{getRankEmoji(rank)}</div>
          <div className="rank-info-detailed">
            <span className="rank-label">Ranking Atual</span>
            <span className="rank-value">Rank {rank}</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Nível</span>
            <span className="stat-value text-gradient">{level}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">XP Total</span>
            <span className="stat-value text-gradient-green">
              {totalXp.toLocaleString()}
            </span>
          </div>

          <div className="stat-item full-width">
            <div className="stat-header">
              <span className="stat-label">Progresso para Nível {level + 1}</span>
              <span className="stat-percentage">{xpPercentage}%</span>
            </div>
            <div className="progress-bar-modern">
              <div
                className="progress-fill"
                style={{ width: `${xpPercentage}%` }}
              >
                <div className="progress-shine"></div>
              </div>
            </div>
            <div className="xp-remaining">
              <span className="xp-needed">{(nextLevelXp - currentXp).toLocaleString()} XP</span>
              <span className="xp-label">restantes</span>
            </div>
          </div>
        </div>

        <div className="evolution-tip">
          <span className="tip-icon">💡</span>
          <span className="tip-text">Complete missões e hábitos para ganhar XP</span>
        </div>
      </div>
    </div>
  );
}

export default EvolutionCard;

