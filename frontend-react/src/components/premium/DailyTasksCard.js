import React, { useState } from 'react';
import './DailyTasksCard.css';

function DailyTasksCard({ tasks, onTaskComplete }) {
  const [completingTask, setCompletingTask] = useState(null);

  const handleToggle = async (task) => {
    if (task.completed || completingTask) return;

    setCompletingTask(task.id);
    await onTaskComplete(task.id);

    setTimeout(() => {
      setCompletingTask(null);
    }, 800);
  };

  const getAreaColor = (area) => {
    const colors = {
      'Health': '#22C55E',
      'Career': '#3B82F6',
      'Finance': '#FACC15',
      'Relationships': '#EF4444',
      'Mind': '#8B5CF6'
    };
    return colors[area] || '#6B7280';
  };

  const getAreaEmoji = (area) => {
    const emojis = {
      'Health': '💪',
      'Career': '💼',
      'Finance': '💰',
      'Relationships': '❤️',
      'Mind': '🧠'
    };
    return emojis[area] || '📌';
  };

  return (
    <div className="daily-tasks-card card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📋</span>
          Tarefas do Dia
        </h2>
        <div className="tasks-counter">
          {tasks.filter(t => t.completed).length}/{tasks.length}
        </div>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <span className="empty-icon">📭</span>
            <p className="empty-text">Nenhuma tarefa para hoje</p>
            <span className="empty-hint">Crie metas para gerar missões automáticas</span>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''} ${completingTask === task.id ? 'completing' : ''}`}
              onClick={() => handleToggle(task)}
            >
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="checkbox-input"
                />
                <div className="checkbox-custom">
                  {task.completed && <span className="check-icon">✓</span>}
                </div>
              </div>

              <div className="task-content">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div
                    className="task-area-badge"
                    style={{
                      background: `${getAreaColor(task.area)}20`,
                      borderColor: `${getAreaColor(task.area)}40`
                    }}
                  >
                    <span>{getAreaEmoji(task.area)}</span>
                    <span style={{ color: getAreaColor(task.area) }}>
                      {task.area}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                <div className="task-footer">
                  <div className="task-xp">
                    <span className="xp-icon">⭐</span>
                    <span className="xp-value">+{task.xp_reward} XP</span>
                  </div>
                  {task.difficulty && (
                    <div className="task-difficulty">
                      <span className="difficulty-dots">
                        {Array(task.difficulty).fill('•').join('')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {completingTask === task.id && (
                <div className="completion-animation">
                  <span className="completion-icon">✨</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DailyTasksCard;

