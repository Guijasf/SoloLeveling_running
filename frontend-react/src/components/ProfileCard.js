import React from 'react';
import SafeRender from './SafeRender';
import './ProfileCard.css';

const RANK_COLORS = {
  'E': { emoji: '🌱', name: 'Novato', color: '#888' },
  'D': { emoji: '⚔️', name: 'Aprendiz', color: '#16c784' },
  'C': { emoji: '🛡️', name: 'Guerreiro', color: '#00d4ff' },
  'B': { emoji: '🐉', name: 'Mestre', color: '#ffd700' },
  'A': { emoji: '⭐', name: 'Lendário', color: '#ff6b9d' },
  'S': { emoji: '👑', name: 'Deus', color: '#ff00ff' }
};

function ProfileCard({ data }) {
  if (!data) {
    return <div className="profile-card loading">Carregando perfil...</div>;
  }

  // Verificar se dados estão válidos
  const level = data?.level || 1;
  const rank = data?.rank || 'E';
  const xp = data?.xp || 0;
  const nextLevelXp = data?.next_level_xp || 100;
  const streak = data?.streak || 0;
  const achievementsCount = data?.achievements_count || 0;
  const lifeScore = data?.life_score || 0;
  const focusArea = data?.focus_area || null;
  const profileName = data?.profile_name || data?.name || 'Usuário';

  const rankInfo = RANK_COLORS[rank] || RANK_COLORS['E'];
  const xpPercent = (xp / nextLevelXp) * 100;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="level-badge">{level}</span>
        </div>
        <div className="profile-info">
          <h2 className="profile-name"><SafeRender value={profileName} fallback="Usuário" /></h2>
          <div className="rank-badge" style={{ borderColor: rankInfo.color }}>
            <span className="rank-emoji">{rankInfo.emoji}</span>
            <span className="rank-name">{rankInfo.name}</span>
            <span className="rank-letter"><SafeRender value={rank} fallback="E" /></span>
          </div>
        </div>
      </div>

      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${xpPercent}%` }}></div>
        <span className="xp-text">
          {xp} / {nextLevelXp} XP
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <span className="stat-icon">🔥</span>
          <span className="stat-label">Streak</span>
          <span className="stat-value"><SafeRender value={streak} fallback="0" /></span>
        </div>
        <div className="stat">
          <span className="stat-icon">🏆</span>
          <span className="stat-label">Conquistas</span>
          <span className="stat-value"><SafeRender value={achievementsCount} fallback="0" /></span>
        </div>
        <div className="stat">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Life Score</span>
          <span className="stat-value"><SafeRender value={Math.round(lifeScore)} fallback="0" /></span>
        </div>
      </div>

      {focusArea && (
        <div className="focus-section">
          <span className="focus-label">📍 Foco Semanal:</span>
          <span className="focus-value">{focusArea}</span>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;






