import React from 'react';
import './AchievementsCard.css';

const ACHIEVEMENT_ICONS = {
  'streak_7': { icon: '🔥', name: '7 Dias de Fogo' },
  'xp_1000': { icon: '⭐', name: '1000 XP' },
  'rank_b': { icon: '🐉', name: 'Mestria' },
  'perfect_week': { icon: '✨', name: 'Semana Perfeita' },
  'level_10': { icon: '🏆', name: 'Nível 10' },
};

function AchievementsCard({ data }) {
  // Garantir que achievements é um array
  let achievements = [];

  if (data?.achievements) {
    if (Array.isArray(data.achievements)) {
      achievements = data.achievements;
    } else if (typeof data.achievements === 'object') {
      // Se for um objeto, converter para array
      achievements = Object.values(data.achievements);
    }
  }

  return (
    <div className="achievements-card">
      <h3>🏆 Conquistas</h3>

      {achievements.length === 0 ? (
        <div className="empty-state">
          <p>Comece a completar missões para desbloquear conquistas!</p>
        </div>
      ) : (
        <div className="achievements-grid">
          {achievements.map((achievement, idx) => {
            // Garantir que achievement é um objeto válido
            if (!achievement || typeof achievement !== 'object') {
              return null;
            }

            const achievementId = achievement.id || idx;
            const achievementKey = achievement.key || 'default';
            const info = ACHIEVEMENT_ICONS[achievementKey] || {
              icon: '🎯',
              name: achievement.name || 'Conquista'
            };

            return (
              <div key={achievementId} className="achievement-item" title={info.name}>
                <div className="achievement-icon">{info.icon}</div>
                <span className="achievement-name">{info.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AchievementsCard;


