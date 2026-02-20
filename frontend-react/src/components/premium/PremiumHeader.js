import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PremiumHeader.css';

function PremiumHeader({ userName, level, rank, xp, nextLevelXp, xpPercentage }) {
  const navigate = useNavigate();

  const getRankTitle = (rank) => {
    const titles = {
      'S': 'Lendário',
      'A': 'Mestre',
      'B': 'Especialista',
      'C': 'Aventureiro',
      'D': 'Aprendiz',
      'E': 'Novato'
    };
    return titles[rank] || 'Novato';
  };

  return (
    <header className="premium-header glass">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo-premium" onClick={() => navigate('/dashboard')}>
            <span className="logo-icon">⚡</span>
            <span className="text-gradient">Life Leveling</span>
          </h1>
        </div>

        <div className="header-center">
          <div className="level-display">
            <div className="level-badge animate-glow">
              <span className="level-number">{level}</span>
              <span className="level-label">Nível</span>
            </div>
            <div className="rank-info">
              <span className="rank-title text-gradient">{getRankTitle(rank)}</span>
              <span className="rank-badge badge-purple">Rank {rank}</span>
            </div>
          </div>

          <div className="xp-bar-container">
            <div className="xp-info">
              <span className="xp-current">{xp.toLocaleString()} XP</span>
              <span className="xp-next">/ {nextLevelXp.toLocaleString()} XP</span>
              <span className="xp-percentage">{xpPercentage}%</span>
            </div>
            <div className="xp-bar-wrapper">
              <div
                className="xp-bar-fill"
                style={{ width: `${xpPercentage}%` }}
              ></div>
              <div className="xp-bar-glow" style={{ width: `${xpPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button className="nav-btn" onClick={() => navigate('/habits')}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Hábitos</span>
          </button>
          <button className="nav-btn" onClick={() => navigate('/ranking')}>
            <span className="nav-icon">🏆</span>
            <span className="nav-label">Ranking</span>
          </button>
          <button className="nav-btn" onClick={() => navigate('/goals')}>
            <span className="nav-icon">🎯</span>
            <span className="nav-label">Metas</span>
          </button>
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            <div className="profile-avatar">
              {userName?.charAt(0).toUpperCase()}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default PremiumHeader;

