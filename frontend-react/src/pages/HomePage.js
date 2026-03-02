import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import PremiumHeader from '../components/premium/PremiumHeader';
import EvolutionCard from '../components/premium/EvolutionCard';
import AreaScoreCard from '../components/premium/AreaScoreCard';
import StreakCard from '../components/premium/StreakCard';
import DailyTasksCard from '../components/premium/DailyTasksCard';
import WeeklyEvolutionChart from '../components/premium/WeeklyEvolutionChart';
import GoalProgressCard from '../components/premium/GoalProgressCard';
import LevelUpModal from '../components/premium/LevelUpModal';
import '../styles/designSystem.css';
import './HomePage.css';

function HomePage() {
  const { user } = useContext(AuthContext);

  const defaultDashboardData = {
    level: 1,
    rank: 'E',
    xp: 0,
    next_level_xp: 100,
    total_xp: 0,
    streak: 0,
    achievements_count: 0,
    life_score: 0,
    focus_area: null,
    profile_name: user?.name || 'Usuário',
    area_scores: [],
    today_missions: [],
    achievements: [],
    goals: [],
    weekly_progress: []
  };

  const [dashboardData, setDashboardData] = useState(defaultDashboardData);
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
      setDashboardData({ ...defaultDashboardData });
    } finally {
      setLoading(false);
    }
  };

  const cleanDashboardData = (data) => {
    if (!data) return { ...defaultDashboardData };
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
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
      goals: Array.isArray(data.goals) ? data.goals : [],
      weekly_progress: Array.isArray(data.weekly_progress) ? data.weekly_progress : []
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

  if (loading || !dashboardData) {
    return (
      <div className="loading-home">
        <div className="spinner-premium"></div>
        <p className="text-gradient">Carregando...</p>
      </div>
    );
  }

  const safeNextXp = dashboardData.next_level_xp || 1;
  const xpPercentage = ((dashboardData.xp / safeNextXp) * 100).toFixed(1);

  // Filtrar metas financeiras e físicas
  const financialGoals = dashboardData.goals.filter(g => g.type === 'financial' || g.category === 'Financeiro');
  const physicalGoals = dashboardData.goals.filter(g => g.type === 'physical' || g.category === 'Corpo' || g.category === 'Fisico');

  return (
    <div className="home-page">
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

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Bem vindo! <span className="user-name-highlight">{dashboardData.profile_name}</span>
        </h1>
      </div>

      {/* Main Grid */}
      <div className="home-grid">
        {/* Left Column - Evolution & Stats */}
        <div className="home-left-column">
          <EvolutionCard
            level={dashboardData.level}
            rank={dashboardData.rank}
            totalXp={dashboardData.total_xp}
            currentXp={dashboardData.xp}
            nextLevelXp={dashboardData.next_level_xp}
            xpPercentage={xpPercentage}
          />

          <AreaScoreCard areaScores={dashboardData.area_scores} />

          <StreakCard streak={dashboardData.streak} />
        </div>

        {/* Center Column - Daily Tasks */}
        <div className="home-center-column">
          <DailyTasksCard
            tasks={dashboardData.today_missions}
            onTaskComplete={handleTaskComplete}
          />
        </div>

        {/* Right Column - Weekly Evolution & Goals */}
        <div className="home-right-column">
          <WeeklyEvolutionChart weekData={dashboardData.weekly_progress} />

          <div className="goals-grid">
            <GoalProgressCard
              title="Meta Financeira"
              icon="💰"
              goals={financialGoals}
              type="financial"
            />

            <GoalProgressCard
              title="Meta de Peso"
              icon="🎯"
              goals={physicalGoals}
              type="physical"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

