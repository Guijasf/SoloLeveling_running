import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function GoalsManager({ userId }) {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    target_value: '',
    priority: 3,
    reward_xp: 100
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (userId) {
      loadGoals();
      loadStats();
    }
  }, [userId]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${userId}/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/goals`, {
        user_id: userId,
        ...formData
      });
      setFormData({
        title: '',
        description: '',
        category: 'other',
        target_value: '',
        priority: 3,
        reward_xp: 100
      });
      loadGoals();
      loadStats();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      alert('Erro ao criar meta: ' + error.response?.data?.detail || error.message);
    }
  };

  const completeGoal = async (goalId) => {
    try {
      await axios.post(`${API_URL}/goals/${userId}/${goalId}/complete`);
      loadGoals();
      loadStats();
      alert('🎉 Meta completada!');
    } catch (error) {
      console.error('Erro ao completar meta:', error);
      alert('Erro: ' + error.response?.data?.detail || error.message);
    }
  };

  const deleteGoal = async (goalId) => {
    if (window.confirm('Deseja deletar esta meta?')) {
      try {
        await axios.delete(`${API_URL}/goals/${userId}/${goalId}`);
        loadGoals();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎯 Suas Metas</h2>

      {stats && (
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span>📊 Total: {stats.total_goals}</span>
          </div>
          <div style={styles.statItem}>
            <span>✅ Completas: {stats.completed_goals}</span>
          </div>
          <div style={styles.statItem}>
            <span>🔄 Em Progresso: {stats.in_progress_goals}</span>
          </div>
          <div style={styles.statItem}>
            <span>📈 Taxa: {stats.completion_rate}%</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>Criar Nova Meta</h3>
        <input
          type="text"
          placeholder="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Descrição"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={styles.textarea}
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          style={styles.input}
        >
          <option value="other">Outra</option>
          <option value="financial">Financeira</option>
          <option value="weight">Peso</option>
          <option value="habit">Hábito</option>
          <option value="career">Carreira</option>
          <option value="health">Saúde</option>
        </select>
        <input
          type="number"
          placeholder="Meta (ex: 80 para peso)"
          value={formData.target_value}
          onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Prioridade (1-5)"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>➕ Criar Meta</button>
      </form>

      <div style={styles.goalsList}>
        <h3>Lista de Metas</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : goals.length === 0 ? (
          <p>Nenhuma meta criada ainda.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} style={styles.goalCard}>
              <div style={styles.goalHeader}>
                <h4>{goal.title}</h4>
                <span style={styles.badge}>{goal.category}</span>
              </div>
              {goal.description && <p>{goal.description}</p>}
              <div style={styles.goalProgress}>
                <span>Progresso: {goal.current_progress} / {goal.target_value}</span>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${(goal.current_progress / (goal.target_value || 100)) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div style={styles.goalActions}>
                {goal.status !== 'completed' && (
                  <button
                    onClick={() => completeGoal(goal.id)}
                    style={styles.buttonSmall}
                  >
                    ✅ Completar
                  </button>
                )}
                <button
                  onClick={() => deleteGoal(goal.id)}
                  style={{ ...styles.buttonSmall, backgroundColor: '#dc3545' }}
                >
                  🗑️ Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
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
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginBottom: '20px'
  },
  statItem: {
    backgroundColor: '#2d3436',
    padding: '15px',
    borderRadius: '6px',
    textAlign: 'center'
  },
  form: {
    backgroundColor: '#2d3436',
    padding: '20px',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#3d4451',
    color: '#fff'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#3d4451',
    color: '#fff',
    minHeight: '60px'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3B82F6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  goalsList: {
    marginTop: '20px'
  },
  goalCard: {
    backgroundColor: '#2d3436',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '10px',
    borderLeft: '4px solid #3B82F6'
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  badge: {
    backgroundColor: '#3B82F6',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  goalProgress: {
    margin: '10px 0'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#3d4451',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '5px'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    transition: 'width 0.3s'
  },
  goalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  buttonSmall: {
    padding: '8px 12px',
    backgroundColor: '#22C55E',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};
