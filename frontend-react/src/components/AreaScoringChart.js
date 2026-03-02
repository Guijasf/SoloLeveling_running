import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function AreaScoringChart({ userId }) {
  const [radarData, setRadarData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadScoringData();
    }
  }, [userId]);

  const loadScoringData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/scoring/${userId}`);
      const data = response.data;

      // Preparar dados para o Radar Chart
      const labels = data.area_scores.map(area => {
        const icons = {
          'carreira': '💼',
          'saúde': '🏥',
          'família': '👨‍👩‍👧',
          'diversão': '🎮',
          'bem-estar': '🧘',
          'relacionamentos': '💑',
          'educação': '📚',
          'financeiro': '💰'
        };
        const icon = icons[area.area_name.toLowerCase()] || '📍';
        return `${icon} ${area.area_name}`;
      });

      const scores = data.area_scores.map(area => area.score);

      setRadarData({
        labels,
        datasets: [
          {
            label: 'Score Atual',
            data: scores,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            fill: true
          }
        ]
      });

      setStats({
        life_score: data.life_score,
        total_areas: data.area_scores.length,
        highest_area: data.area_scores.reduce((max, area) =>
          area.score > max.score ? area : max
        ),
        lowest_area: data.area_scores.reduce((min, area) =>
          area.score < min.score ? area : min
        )
      });
    } catch (error) {
      console.error('Erro ao carregar dados de scoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: '#1a1f2e',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#888',
          font: { size: 12 }
        },
        grid: {
          color: 'rgba(59, 130, 246, 0.1)'
        },
        pointLabels: {
          color: '#fff',
          font: { size: 12, weight: 'bold' }
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>📊 Balanceamento de Áreas</h2>

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <div style={styles.statValue}>{stats.life_score.toFixed(1)}</div>
            <div style={styles.statLabel}>Score de Vida</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>✅ {stats.highest_area.area_name}</div>
            <div style={styles.statLabel}>{stats.highest_area.score.toFixed(1)} Pts</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>⚠️ {stats.lowest_area.area_name}</div>
            <div style={styles.statLabel}>{stats.lowest_area.score.toFixed(1)} Pts</div>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#aaa', textAlign: 'center' }}>Carregando dados...</p>
      ) : radarData ? (
        <div style={styles.chartContainer}>
          <Radar data={radarData} options={chartOptions} />
        </div>
      ) : (
        <p style={{ color: '#aaa', textAlign: 'center' }}>Nenhum dado disponível</p>
      )}

      <button onClick={loadScoringData} style={styles.refreshButton}>
        🔄 Atualizar
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1a1f2e',
    borderRadius: '8px',
    color: '#fff'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  statBox: {
    backgroundColor: '#2d3436',
    padding: '15px',
    borderRadius: '6px',
    textAlign: 'center',
    border: '2px solid #3B82F6'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#aaa'
  },
  chartContainer: {
    position: 'relative',
    height: '400px',
    marginBottom: '20px',
    backgroundColor: '#2d3436',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #3B82F6'
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#3B82F6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%'
  }
};
