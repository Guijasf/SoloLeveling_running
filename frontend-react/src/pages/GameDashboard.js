import React, { useState, useEffect } from 'react';
import { GoalsComponent, StreakComponent, MissionsComponent, StatisticsComponent } from '../components/GameComponents';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const GameDashboard = () => {
  const [userId, setUserId] = useState(1); // Default user ID
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Get user from localStorage or use default
    const storedUser = localStorage.getItem('userId');
    if (storedUser) {
      setUserId(parseInt(storedUser));
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="game-dashboard">
      <header className="dashboard-header">
        <h1>⚔️ SoloLeveling RPG</h1>
        <div className="header-info">
          <span>User ID: {userId}</span>
        </div>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Metas
        </button>
        <button
          className={`nav-btn ${activeTab === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveTab('missions')}
        >
          🎮 Missões
        </button>
        <button
          className={`nav-btn ${activeTab === 'streak' ? 'active' : ''}`}
          onClick={() => setActiveTab('streak')}
        >
          🔥 Sequência
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <StatisticsComponent userId={userId} />
            <div className="quick-info">
              <h2>📖 Como Jogar</h2>
              <ul>
                <li>⭐ Complete metas para ganhar XP</li>
                <li>🎮 Realize missões diárias para bônus</li>
                <li>🔥 Mantenha sua sequência ativa (multiplicador até 1.5x)</li>
                <li>🏆 Suba de nível e desbloqueie conquistas</li>
                <li>💰 Ganhe XP em diferentes áreas de vida</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'goals' && <GoalsComponent userId={userId} />}

        {activeTab === 'missions' && <MissionsComponent userId={userId} />}

        {activeTab === 'streak' && <StreakComponent userId={userId} />}
      </main>

      <footer className="dashboard-footer">
        <p>SoloLeveling RPG © 2024 | Gamificação de Vida</p>
      </footer>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #0B0F1A 0%, #1a1f35 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .game-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #0B0F1A 0%, #1a1f35 100%);
          color: #fff;
          padding-bottom: 40px;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #1a1f35 0%, #2d3748 100%);
          padding: 20px 20px;
          border-bottom: 2px solid rgba(59, 130, 246, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .dashboard-header h1 {
          font-size: 32px;
          font-weight: bold;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-info {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #999;
        }

        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 8px;
          font-weight: bold;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        .notification.success {
          background: rgba(34, 197, 94, 0.9);
          color: white;
        }

        .notification.error {
          background: rgba(255, 107, 107, 0.9);
          color: white;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .dashboard-nav {
          display: flex;
          gap: 10px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          flex-wrap: wrap;
        }

        .nav-btn {
          padding: 10px 20px;
          background: rgba(59, 130, 246, 0.1);
          color: #fff;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .nav-btn.active {
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border-color: transparent;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 20px auto;
          padding: 0 20px;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .quick-info {
          padding: 20px;
          background: #0B0F1A;
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .quick-info h2 {
          margin-bottom: 15px;
          color: #3B82F6;
        }

        .quick-info ul {
          list-style: none;
        }

        .quick-info li {
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
        }

        .quick-info li:last-child {
          border-bottom: none;
        }

        .dashboard-footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 10px;
          }

          .dashboard-header h1 {
            font-size: 24px;
          }

          .nav-btn {
            flex: 1;
            min-width: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default GameDashboard;
