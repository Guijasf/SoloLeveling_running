import React, { useState } from 'react';
import api from '../utils/api';
import './MissionsCard.css';

function MissionsCard({ data }) {
  const [completedMissions, setCompletedMissions] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const handleCompleteMission = async (missionId) => {
    setLoading(true);
    try {
      await api.post(`/missions/${missionId}/complete`);
      setCompletedMissions(new Set([...completedMissions, missionId]));
    } catch (err) {
      console.error('Erro ao completar missão:', err);
    } finally {
      setLoading(false);
    }
  };

  const missions = data?.today_missions || [];

  // Validar e limpar missões
  const validMissions = missions.filter(mission => {
    return mission &&
           typeof mission === 'object' &&
           mission.id !== undefined &&
           typeof mission.title === 'string';
  });

  return (
    <div className="missions-card">
      <h3>🎯 Missões de Hoje</h3>

      {missions.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma missão disponível</p>
        </div>
      ) : (
        <div className="missions-list">
          {validMissions.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma missão válida disponível</p>
            </div>
          ) : (
            validMissions.map((mission) => (
              <div
                key={mission.id}
                className={`mission-item ${completedMissions.has(mission.id) ? 'completed' : ''}`}
              >
                <div className="mission-info">
                  <h4>{mission.title || 'Sem título'}</h4>
                  <p>{mission.description || 'Sem descrição'}</p>
                  <div className="mission-meta">
                    <span className="difficulty" style={{ color: getDifficultyColor(mission.difficulty) }}>
                      {mission.difficulty || 'Normal'}
                    </span>
                    <span className="reward">+{mission.xp_reward || 0} XP</span>
                  </div>
                </div>
                <button
                  className="btn-complete"
                  onClick={() => handleCompleteMission(mission.id)}
                  disabled={completedMissions.has(mission.id) || loading}
                >
                  {completedMissions.has(mission.id) ? '✓' : 'Completar'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function getDifficultyColor(difficulty) {
  const colors = {
    'Fácil': '#16c784',
    'Médio': '#ffd700',
    'Difícil': '#ff6666',
  };
  return colors[difficulty] || '#888';
}

export default MissionsCard;



