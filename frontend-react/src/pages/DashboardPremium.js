import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import PremiumHeader from '../components/premium/PremiumHeader';
import EvolutionCard from '../components/premium/EvolutionCard';
import StreakCard from '../components/premium/StreakCard';
import DailyTasksCard from '../components/premium/DailyTasksCard';
import DailyProgressCard from '../components/premium/DailyProgressCard';
import LevelUpModal from '../components/premium/LevelUpModal';
import '../styles/designSystem.css';
import './DashboardPremium.css';

function DashboardPremium() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Detectar Level Up
    if (dashboardData && previousLevel && dashboardData.level > previousLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    if (dashboardData) {
      setPreviousLevel(dashboardData.level);
    }
  }, [dashboardData?.level]);

  const loadDashboardData = async () => {
    try {
      const response = await api.get(`/dashboard/${user?.id}`);
      const cleanData = cleanDashboardData(response.data);
      setDashboardData(cleanData);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const cleanDashboardData = (data) => {
    if (!data) return {};
    return {
      level: data.level || 1,
      rank: typeof data.rank === 'string' ? data.rank : 'E',
      xp: typeof data.xp === 'number' ? data.xp : 0,
      next_level_xp: typeof data.next_level_xp === 'number' ? data.next_level_xp : 100,
      total_xp: typeof data.total_xp === 'number' ? data.total_xp : data.xp || 0,
      streak: typeof data.streak === 'number' ? data.streak : 0,
      achievements_count: typeof data.achievements_count === 'number' ? data.achievements_count : 0,
      life_score: typeof data.life_score === 'number' ? data.life_score : 0,
      focus_area: typeof data.focus_area === 'string' ? data.focus_area : null,
      profile_name: typeof data.profile_name === 'string' ? data.profile_name : user?.name || 'Usuário',
      area_scores: Array.isArray(data.area_scores) ? data.area_scores : [],
      today_missions: Array.isArray(data.today_missions) ? data.today_missions : [],
      achievements: Array.isArray(data.achievements) ? data.achievements : []
    };
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await api.put(`/missions/${taskId}/complete`);
      loadDashboardData(); // Recarrega para mostrar XP ganho
    } catch (err) {
      console.error('Erro ao completar tarefa:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-premium">
        <div className="spinner-premium"></div>
        <p className="text-gradient">Carregando evolução...</p>
      </div>
    );
  }

  const xpPercentage = ((dashboardData.xp / dashboardData.next_level_xp) * 100).toFixed(1);
  const completedTasks = dashboardData.today_missions.filter(m => m.completed).length;
  const totalTasks = dashboardData.today_missions.length;
  const dailyProgress = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

  return (
    <div className="dashboard-premium">
      <PremiumHeader
        userName={dashboardData.profile_name}
        level={dashboardData.level}
        rank={dashboardData.rank}
        xp={dashboardData.xp}
        nextLevelXp={dashboardData.next_level_xp}
        xpPercentage={xpPercentage}
      />

      {showLevelUp && (
        <LevelUpModal level={dashboardData.level} rank={dashboardData.rank} />
      )}

      <div className="dashboard-grid">
        <EvolutionCard
          level={dashboardData.level}
          rank={dashboardData.rank}
          totalXp={dashboardData.total_xp}
          currentXp={dashboardData.xp}
          nextLevelXp={dashboardData.next_level_xp}
          xpPercentage={xpPercentage}
        />

        <StreakCard streak={dashboardData.streak} />

        <DailyTasksCard
          tasks={dashboardData.today_missions}
          onTaskComplete={handleTaskComplete}
        />

        <DailyProgressCard
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          dailyProgress={dailyProgress}
          lifeScore={dashboardData.life_score}
        />
      </div>
    </div>
  );
}

export default DashboardPremium;

