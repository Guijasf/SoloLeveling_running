import React from 'react';
import './DailyProgressCard.css';

function DailyProgressCard({ completedTasks, totalTasks, dailyProgress, lifeScore }) {
  const getProgressStatus = () => {
    if (dailyProgress >= 100) return { text: 'Perfeito!', color: '#22C55E', emoji: '🎉' };
    if (dailyProgress >= 70) return { text: 'Ótimo progresso', color: '#FACC15', emoji: '⭐' };
    if (dailyProgress >= 40) return { text: 'Continue assim', color: '#3B82F6', emoji: '💪' };
    return { text: 'Você consegue!', color: '#EF4444', emoji: '🚀' };
  };

  const status = getProgressStatus();

  return (
    <div className="daily-progress-card card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📊</span>
          Progresso Diário
        </h2>
        <div
          className="status-badge"
          style={{ background: `${status.color}20`, borderColor: `${status.color}40` }}
        >
          <span>{status.emoji}</span>
          <span style={{ color: status.color }}>{status.text}</span>
        </div>
      </div>

      <div className="progress-content">
        <div className="circular-progress-container">
          <svg className="circular-progress" viewBox="0 0 200 200">
            <circle
              className="progress-bg"
              cx="100"
              cy="100"
              r="85"
            />
            <circle
              className="progress-ring"
              cx="100"
              cy="100"
              r="85"
              style={{
                strokeDasharray: `${(dailyProgress / 100) * 534} 534`,
                stroke: status.color
              }}
            />
          </svg>

          <div className="progress-center">
            <span className="progress-value" style={{ color: status.color }}>
              {dailyProgress}%
            </span>
            <span className="progress-label">concluído</span>
          </div>
        </div>

        <div className="progress-details">
          <div className="detail-item">
            <div className="detail-icon">✅</div>
            <div className="detail-info">
              <span className="detail-value">{completedTasks}</span>
              <span className="detail-label">Tarefas completas</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">📋</div>
            <div className="detail-info">
              <span className="detail-value">{totalTasks}</span>
              <span className="detail-label">Tarefas totais</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">🎯</div>
            <div className="detail-info">
              <span className="detail-value">{lifeScore}</span>
              <span className="detail-label">Score geral</span>
            </div>
          </div>
        </div>

        {dailyProgress < 70 && totalTasks > 0 && (
          <div className="motivation-banner">
            <span className="banner-icon">💡</span>
            <div className="banner-text">
              <strong>Meta mínima:</strong> 70% de conclusão
              <br />
              <small>Faltam {Math.ceil((70 - dailyProgress) / 100 * totalTasks)} tarefas</small>
            </div>
          </div>
        )}

        {dailyProgress >= 100 && (
          <div className="success-banner">
            <span className="banner-icon">🏆</span>
            <div className="banner-text">
              <strong>Dia perfeito!</strong>
              <br />
              <small>Você concluiu 100% das tarefas</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyProgressCard;

