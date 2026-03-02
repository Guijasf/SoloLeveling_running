import React from 'react';
import './GoalProgressCard.css';

function GoalProgressCard({ title, icon, goals, type }) {
  const safeGoals = Array.isArray(goals) ? goals : [];

  const normalizeProgress = (goal) => {
    const current = Number(goal?.current_value ?? goal?.current ?? goal?.progress_value ?? goal?.value ?? 0);
    const target = Number(goal?.target_value ?? goal?.target ?? goal?.goal ?? 0);
    const progress = Number(goal?.progress ?? 0);

    if (target > 0) {
      return Math.min((current / target) * 100, 100);
    }

    if (progress > 0 && progress <= 1) {
      return progress * 100;
    }

    if (progress > 1) {
      return Math.min(progress, 100);
    }

    return 0;
  };

  const progressValues = safeGoals.map(normalizeProgress);
  const progressAverage = progressValues.length
    ? Math.round(progressValues.reduce((acc, val) => acc + val, 0) / progressValues.length)
    : 0;

  const progressLabel = `${progressAverage}%`;
  const primaryColor = type === 'financial' ? '#3B82F6' : '#FACC15';
  const accentColor = type === 'financial' ? '#22C55E' : '#EF4444';

  const firstGoal = safeGoals[0];
  const minLabel = firstGoal?.start_value ?? (type === 'financial' ? 'R$0,00' : '120kg');
  const maxLabel = firstGoal?.target_value ?? (type === 'financial' ? 'R$10.000,00' : '90kg');

  return (
    <div className="goal-progress-card card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-icon">{icon}</span>
          {title}
        </h3>
      </div>
      <div className="goal-progress-content">
        <div
          className="goal-progress-circle"
          style={{
            background: `conic-gradient(${primaryColor} ${progressAverage}%, rgba(255, 255, 255, 0.05) ${progressAverage}%)`
          }}
        >
          <div className="goal-progress-inner">
            <span className="goal-progress-value" style={{ color: primaryColor }}>
              {progressLabel}
            </span>
            <span className="goal-progress-sub">concluído</span>
          </div>
        </div>

        <div className="goal-progress-bar">
          <span className="goal-progress-min">{minLabel}</span>
          <div className="progress-bar" style={{ '--progress': `${progressAverage}%` }}>
            <span className="goal-progress-fill" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }}></span>
          </div>
          <span className="goal-progress-max">{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default GoalProgressCard;

