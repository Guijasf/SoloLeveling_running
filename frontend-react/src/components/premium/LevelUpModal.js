import React from 'react';
import './LevelUpModal.css';

function LevelUpModal({ level, rank }) {
  return (
    <div className="levelup-overlay">
      <div className="levelup-modal">
        <div className="levelup-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random()}s`
            }}></div>
          ))}
        </div>

        <div className="levelup-content">
          <div className="levelup-icon">⬆️</div>
          <h2 className="levelup-title text-gradient">SUBIU DE NÍVEL!</h2>
          <div className="levelup-level">
            <span className="level-number">{level}</span>
          </div>
          <p className="levelup-subtitle">
            Rank {rank} • Continue evoluindo!
          </p>

          <div className="levelup-rays">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="ray"
                style={{ transform: `rotate(${i * 45}deg)` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelUpModal;

