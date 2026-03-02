
import React from 'react';
import RadarChart from '../RadarChart';
import './AreaScoreCard.css';

function AreaScoreCard({ areaScores }) {
  const normalizedScores = Array.isArray(areaScores)
    ? areaScores.map((item) => ({
        area: typeof item?.area === 'string' ? item.area : item?.name || 'Area',
        score: typeof item?.score === 'number' ? item.score : item?.value || 0
      }))
    : [];

  return (
    <div className="area-score-card card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">🧭</span>
          Area Score
        </h2>
      </div>
      <div className="area-score-body">
        {normalizedScores.length > 0 ? (
          <div className="area-score-chart">
            <RadarChart data={{ area_scores: normalizedScores }} />
          </div>
        ) : (
          <div className="area-score-empty">
            <span className="empty-icon">📊</span>
            <p className="empty-text">Sem dados de áreas ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AreaScoreCard;

