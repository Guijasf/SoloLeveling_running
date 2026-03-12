import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Chart from 'chart.js/auto';
import './RadarChart.css';

function RadarChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Validar dados
    if (!data?.area_scores) {
      console.log('area_scores não disponível');
      return;
    }

    if (!Array.isArray(data.area_scores) || data.area_scores.length === 0) {
      console.log('area_scores não é um array válido');
      return;
    }

    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Destruir chart anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    try {
      const labels = data.area_scores.map(area => {
        if (typeof area === 'object' && area.area) {
          return area.area;
        }
        return 'Área';
      });

      const scores = data.area_scores.map(area => {
        if (typeof area === 'object' && typeof area.score === 'number') {
          return area.score;
        }
        return 0;
      });

      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            {
              label: 'Minha Evolução',
              data: scores,
              borderColor: '#16c784',
              backgroundColor: 'rgba(22, 199, 132, 0.2)',
              borderWidth: 2,
              pointBackgroundColor: '#16c784',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: '#888',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(22, 199, 132, 0.1)',
                drawBorder: true,
                borderColor: '#16c784'
              },
              pointLabels: {
                color: '#16c784',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#16c784',
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao renderizar gráfico:', error);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data?.area_scores]);

  return (
    <Card className="radar-chart-card" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          📊 Evolução por Área
        </Typography>
        <Box className="chart-container" sx={{ position: 'relative', height: '300px' }}>
          <canvas ref={chartRef}></canvas>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RadarChart;


