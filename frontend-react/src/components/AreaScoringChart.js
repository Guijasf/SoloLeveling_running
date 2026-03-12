import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { Box, Card, CardContent, Typography, Grid, Paper, Button, CircularProgress } from '@mui/material';
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
          color: '#666',
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#3B82F6',
        borderWidth: 1
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#999',
          font: { size: 12 }
        },
        grid: {
          color: 'rgba(59, 130, 246, 0.1)'
        },
        pointLabels: {
          color: '#333',
          font: { size: 12, weight: 'bold' }
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Balanceamento de Áreas
      </Typography>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {stats.life_score.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Score de Vida
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                ✅ {stats.highest_area.area_name}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.highest_area.score.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pts
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                ⚠️ {stats.lowest_area.area_name}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.lowest_area.score.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : radarData ? (
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ position: 'relative', height: '400px' }}>
              <Radar data={radarData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">
            Nenhum dado disponível
          </Typography>
        </Paper>
      )}

      <Button onClick={loadScoringData} variant="contained" fullWidth>
        🔄 Atualizar
      </Button>
    </Box>
  );
}
