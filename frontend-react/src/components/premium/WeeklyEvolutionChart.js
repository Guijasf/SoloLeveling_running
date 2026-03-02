import React from 'react';
import './WeeklyEvolutionChart.css';

function WeeklyEvolutionChart({ weekData = [] }) {
  // Dados mock se não houver dados reais
  const defaultData = [
    { day: 'Segunda', tasks: 5 },
    { day: 'Terça', tasks: 8 },
    { day: 'Quarta', tasks: 6 },
    { day: 'Quinta', tasks: 12 },
    { day: 'Sexta', tasks: 10 },
    { day: 'Sábado', tasks: 15 },
    { day: 'Domingo', tasks: 14 }
  ];

  const data = weekData.length > 0 ? weekData : defaultData;
  const maxTasks = Math.max(...data.map(d => d.tasks), 1);

  return (
    <div className="weekly-evolution-card card-premium">
      <div className="card-header-premium">
        <h3 className="card-title">📈 Evolução Semanal</h3>
      </div>
      <div className="chart-container">
        <div className="chart-grid">
          {[0, 5, 10, 15, 20].map(val => (
            <div key={val} className="grid-line" style={{ bottom: `${(val / 20) * 100}%` }}>
              <span className="grid-label">{val}</span>
            </div>
          ))}
        </div>
        <div className="line-chart">
          <svg width="100%" height="100%" viewBox="0 0 700 200">
            {/* Linha do gráfico */}
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              points={data.map((d, i) => {
                const x = (i * 100) + 50;
                const y = 180 - (d.tasks / maxTasks) * 150;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Área abaixo da linha */}
            <polygon
              fill="url(#areaGradient)"
              opacity="0.3"
              points={`
                50,180
                ${data.map((d, i) => {
                  const x = (i * 100) + 50;
                  const y = 180 - (d.tasks / maxTasks) * 150;
                  return `${x},${y}`;
                }).join(' ')}
                ${(data.length - 1) * 100 + 50},180
              `}
            />

            {/* Pontos */}
            {data.map((d, i) => {
              const x = (i * 100) + 50;
              const y = 180 - (d.tasks / maxTasks) * 150;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#22c55e"
                    className="chart-point"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#fff"
                  />
                  <text
                    x={x}
                    y="195"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="12"
                  >
                    {d.day.slice(0, 3)}
                  </text>
                </g>
              );
            })}

            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default WeeklyEvolutionChart;

