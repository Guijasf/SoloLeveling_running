import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import './HistoryPage.css';

function HistoryPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, week, month

  useEffect(() => {
    loadHistoryData();
  }, [filter]);

  const loadHistoryData = async () => {
    try {
      const response = await api.get(`/history/${user?.id}?period=${filter}`);
      setHistoryData(response.data.history || []);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getEventIcon = (eventType) => {
    const icons = {
      'level_up': '⬆️',
      'rank_up': '🏆',
      'achievement': '🎖️',
      'mission_completed': '✅',
      'streak_milestone': '🔥',
      'xp_earned': '⭐',
      'goal_completed': '🎯'
    };
    return icons[eventType] || '📌';
  };

  const getEventColor = (eventType) => {
    const colors = {
      'level_up': '#667eea',
      'rank_up': '#ffd700',
      'achievement': '#f093fb',
      'mission_completed': '#56ab2f',
      'streak_milestone': '#ff6b6b',
      'xp_earned': '#4ecdc4',
      'goal_completed': '#764ba2'
    };
    return colors[eventType] || '#a8b2d1';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <Header userName={user?.name} onSettingsClick={() => navigate('/settings')} />

      <div className="history-container">
        <div className="history-header">
          <h1>📜 Histórico de Eventos</h1>
          <p>Acompanhe sua jornada e evolução</p>

          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            <button
              className={filter === 'week' ? 'active' : ''}
              onClick={() => setFilter('week')}
            >
              Última Semana
            </button>
            <button
              className={filter === 'month' ? 'active' : ''}
              onClick={() => setFilter('month')}
            >
              Último Mês
            </button>
          </div>
        </div>

        {historyData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>Nenhum evento ainda</h2>
            <p>Complete missões, ganhe XP e desbloqueie conquistas para ver seu histórico!</p>
          </div>
        ) : (
          <div className="timeline">
            {historyData.map((event, index) => (
              <div
                key={index}
                className="timeline-item"
                style={{ borderLeftColor: getEventColor(event.event_type) }}
              >
                <div className="timeline-icon" style={{ background: getEventColor(event.event_type) }}>
                  {getEventIcon(event.event_type)}
                </div>

                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>{event.title}</h3>
                    <span className="timeline-date">{formatDate(event.created_at)}</span>
                  </div>

                  <p className="timeline-description">{event.description}</p>

                  {event.metadata && (
                    <div className="timeline-metadata">
                      {event.metadata.xp_earned && (
                        <span className="metadata-badge">
                          +{event.metadata.xp_earned} XP
                        </span>
                      )}
                      {event.metadata.new_level && (
                        <span className="metadata-badge">
                          Level {event.metadata.new_level}
                        </span>
                      )}
                      {event.metadata.new_rank && (
                        <span className="metadata-badge">
                          Rank {event.metadata.new_rank}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;

