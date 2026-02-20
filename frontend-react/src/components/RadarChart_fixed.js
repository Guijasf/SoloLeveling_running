import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './RadarChart.css';

function RadarChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data?.area_scores || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = data.area_scores.map(area => area.area);
    const scores = data.area_scores.map(area => area.score);

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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data?.area_scores]);

  return (
    <div className="radar-chart-card">
      <h3>📊 Evolução por Área</h3>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default RadarChart;

