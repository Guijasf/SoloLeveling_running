import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import PremiumHeader from '../components/premium/PremiumHeader';
import '../styles/designSystem.css';
import './PlaceholderPage.css';

function PlaceholderPage({ title }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="placeholder-page">
      <PremiumHeader
        userName={user?.name || 'Usuário'}
        level={1}
        rank="E"
        xp={0}
        nextLevelXp={100}
        xpPercentage={0}
      />
      <div className="placeholder-content">
        <div className="card placeholder-card">
          <h2 className="placeholder-title">{title}</h2>
          <p className="placeholder-text">Em breve vamos evoluir esta área.</p>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderPage;

