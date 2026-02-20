import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import RadarChart from '../components/RadarChart';
import MissionsCard from '../components/MissionsCard';
import AchievementsCard from '../components/AchievementsCard';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setError('');
      const response = await api.get(`/dashboard/${user?.id}`);
      console.log('Dados do dashboard recebidos:', response.data);

      // Validar e limpar dados
      const cleanData = cleanDashboardData(response.data);
      setDashboardData(cleanData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard: ' + (err.message || ''));
      console.error('Erro completo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar e validar dados
  const cleanDashboardData = (data) => {
    if (!data) return {};

    return {
      level: data.level || 1,
      rank: typeof data.rank === 'string' ? data.rank : 'E',
      xp: typeof data.xp === 'number' ? data.xp : 0,
      next_level_xp: typeof data.next_level_xp === 'number' ? data.next_level_xp : 100,
      streak: typeof data.streak === 'number' ? data.streak : 0,
      achievements_count: typeof data.achievements_count === 'number' ? data.achievements_count : 0,
      life_score: typeof data.life_score === 'number' ? data.life_score : 0,
      focus_area: typeof data.focus_area === 'string' ? data.focus_area : null,
      profile_name: typeof data.profile_name === 'string' ? data.profile_name : (typeof data.name === 'string' ? data.name : 'Usuário'),
      area_scores: Array.isArray(data.area_scores) ? data.area_scores.filter(a => a && typeof a === 'object') : [],
      today_missions: Array.isArray(data.today_missions) ? data.today_missions.filter(m => m && typeof m === 'object') : [],
      achievements: Array.isArray(data.achievements) ? data.achievements.filter(a => a && typeof a === 'object') : []
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header userName={user?.name} onSettingsClick={() => navigate('/settings')} />

      <div className="dashboard-container">
        {error && <div className="error-banner">{error}</div>}

        <div className="main-grid">
          <div className="left-column">
            <ProfileCard data={dashboardData} />
            <RadarChart data={dashboardData} />
          </div>

          <div className="right-column">
            <MissionsCard data={dashboardData} />
            <AchievementsCard data={dashboardData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;


