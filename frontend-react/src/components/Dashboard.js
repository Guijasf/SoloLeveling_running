import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoalsManager from './GoalsManager';
import StreakDisplay from './StreakDisplay';
import MissionsBoard from './MissionsBoard';
import AreaScoringChart from './AreaScoringChart';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Buscar dados do usuário armazenados no localStorage ou fazer login padrão
      const userId = localStorage.getItem('userId') || '1';
      
      const userResponse = await axios.get(`${API_URL}/users/${userId}`);
      const progressResponse = await axios.get(`${API_URL}/progress/${userId}/overall`);

      setUser(userResponse.data);
      setProgress(progressResponse.data);

      // Carregar configurações se existirem
      try {
        const settingsResponse = await axios.get(`${API_URL}/users/${userId}/settings`);
        setUserSettings(settingsResponse.data);
      } catch (error) {
        console.log('Configurações não disponíveis ainda');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Usar dados padrão se não conseguir carregar
      setUser({ id: '1', username: 'Jogador', level: 1 });
      setProgress({ current_xp: 0, level: 1, rank: 'Iniciante', total_followers: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando seu progresso...</p>
      </div>
    );
  }

  const userId = user?.id || '1';

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.playerInfo}>
            <h1 style={styles.title}>🎮 Solo Leveling</h1>
            <div style={styles.userCard}>
              <h2>{user?.username || 'Jogador'}</h2>
              <div style={styles.levelBadge}>
                <span>Nível {progress?.level || 1}</span>
                <span>🏅 {progress?.rank || 'Iniciante'}</span>
              </div>
            </div>
          </div>
          <button onClick={loadUserData} style={styles.refreshButton}>
            🔄 Atualizar
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.tabNav}>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'overview' ? '#3B82F6' : '#2d3436'
          }}
          onClick={() => setActiveTab('overview')}
        >
          📊 Visão Geral
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'missions' ? '#3B82F6' : '#2d3436'
          }}
          onClick={() => setActiveTab('missions')}
        >
          🎮 Missões
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'goals' ? '#3B82F6' : '#2d3436'
          }}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Metas
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'streak' ? '#3B82F6' : '#2d3436'
          }}
          onClick={() => setActiveTab('streak')}
        >
          🔥 Sequência
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'areas' ? '#3B82F6' : '#2d3436'
          }}
          onClick={() => setActiveTab('areas')}
        >
          📍 Áreas
        </button>
      </nav>

      {/* Content Area */}
      <main style={styles.content}>
        {activeTab === 'overview' && (
          <div style={styles.overviewGrid}>
            <div style={styles.overviewSection}>
              <StreakDisplay userId={userId} />
            </div>
            <div style={styles.overviewSection}>
              <div style={styles.progressCard}>
                <h3>📈 Progresso Geral</h3>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: progress?.xp_percentage ? `${progress.xp_percentage}%` : '0%'
                    }}
                  ></div>
                </div>
                <p style={styles.progressText}>
                  {progress?.current_xp || 0} / {progress?.xp_for_next_level || 100} XP
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <MissionsBoard userId={userId} />
        )}

        {activeTab === 'goals' && (
          <GoalsManager userId={userId} />
        )}

        {activeTab === 'streak' && (
          <StreakDisplay userId={userId} fullView={true} />
        )}

        {activeTab === 'areas' && (
          <AreaScoringChart userId={userId} />
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>🎮 Solo Leveling - Transforme sua vida em uma aventura épica</p>
        <p style={styles.footerStats}>
          Nível: {progress?.level || 1} | Rank: {progress?.rank || 'Iniciante'} | 
          Seguidores: {progress?.total_followers || 0}
        </p>
      </footer>
    </div>
  );
}

const styles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#0f1419',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#1a1f2e',
    padding: '20px',
    borderBottom: '2px solid #3B82F6',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  playerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  userCard: {
    backgroundColor: '#2d3436',
    padding: '15px 20px',
    borderRadius: '6px',
    border: '2px solid #3B82F6'
  },
  userCard: {
    h2: {
      margin: '0 0 8px 0',
      fontSize: '18px'
    }
  },
  levelBadge: {
    display: 'flex',
    gap: '15px',
    fontSize: '14px',
    color: '#FACC15'
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#3B82F6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  tabNav: {
    display: 'flex',
    gap: '10px',
    padding: '15px 20px',
    backgroundColor: '#1a1f2e',
    borderBottom: '1px solid #3d4451',
    overflowX: 'auto'
  },
  tabButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.3s'
  },
  content: {
    flex: 1,
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  overviewSection: {
    backgroundColor: '#1a1f2e',
    borderRadius: '8px'
  },
  progressCard: {
    backgroundColor: '#1a1f2e',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #3B82F6'
  },
  progressBar: {
    width: '100%',
    height: '30px',
    backgroundColor: '#2d3436',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '15px 0'
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
    transition: 'width 0.5s ease'
  },
  progressText: {
    margin: 0,
    fontSize: '14px',
    color: '#aaa',
    textAlign: 'center'
  },
  footer: {
    backgroundColor: '#1a1f2e',
    borderTop: '1px solid #3d4451',
    padding: '15px',
    textAlign: 'center',
    color: '#888',
    fontSize: '14px'
  },
  footerStats: {
    margin: '8px 0 0 0',
    fontSize: '12px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f1419',
    color: '#fff'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #3d4451',
    borderTop: '4px solid #3B82F6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};
