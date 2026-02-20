import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import './ProfilePage.css';

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    title: '',
    public_profile: true
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await api.get(`/profile/${user?.id}`);
      setProfileData(response.data);
      setFormData({
        bio: response.data.bio || '',
        title: response.data.title || '',
        public_profile: response.data.public_profile !== false
      });
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/profile/${user?.id}`, formData);
      setEditing(false);
      loadProfileData();
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar perfil');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header userName={user?.name} onSettingsClick={() => navigate('/settings')} />

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="level-badge">Lv {profileData?.level || 1}</div>
          </div>

          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="profile-title">{profileData?.title || 'Novato'}</p>
            <div className="rank-badge rank-{profileData?.rank?.toLowerCase() || 'e'}">
              Rank {profileData?.rank || 'E'}
            </div>
          </div>

          <div className="profile-actions">
            {!editing ? (
              <button className="btn-primary" onClick={() => setEditing(true)}>
                ✏️ Editar Perfil
              </button>
            ) : (
              <>
                <button className="btn-success" onClick={handleSave}>
                  ✅ Salvar
                </button>
                <button className="btn-secondary" onClick={() => setEditing(false)}>
                  ❌ Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">{profileData?.total_xp || 0}</div>
            <div className="stat-label">XP Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profileData?.streak || 0}</div>
            <div className="stat-label">🔥 Sequência</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profileData?.achievements_count || 0}</div>
            <div className="stat-label">🏆 Conquistas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profileData?.days_active || 0}</div>
            <div className="stat-label">📅 Dias Ativos</div>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h2>📝 Biografia</h2>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            ) : (
              <p>{profileData?.bio || 'Nenhuma biografia definida.'}</p>
            )}
          </div>

          <div className="detail-section">
            <h2>🎯 Título Atual</h2>
            {editing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Estrategista, Guerreiro, Sábio..."
              />
            ) : (
              <p>{profileData?.title || 'Novato'}</p>
            )}
          </div>

          <div className="detail-section">
            <h2>🌐 Privacidade</h2>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.public_profile}
                onChange={(e) => setFormData({...formData, public_profile: e.target.checked})}
                disabled={!editing}
              />
              <span>Perfil público (outros usuários podem ver)</span>
            </label>
          </div>
        </div>

        {profileData?.public_profile && (
          <div className="share-section">
            <h2>🔗 Compartilhar Perfil</h2>
            <div className="share-link">
              <input
                type="text"
                value={`${window.location.origin}/profile/${user?.id}/public`}
                readOnly
              />
              <button onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.id}/public`);
                alert('Link copiado!');
              }}>
                📋 Copiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

