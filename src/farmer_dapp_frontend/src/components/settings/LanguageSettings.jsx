// src/components/settings/LanguageSettings.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from '../WidgetNav';

const LanguageSettings = () => {
  const { state } = useLocation();
  const navigate    = useNavigate();
  const { role, username } = state || {};
  const [lang, setLang] = useState('en');

  const handleBack = () => navigate(-1);

  return (
    <div className="home-container">
      <div className="overlay" />
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Account</div>
        <div style={{ width: 32 }} />
      </div>

      <div className="settings-card">
        <div className="settings-list">
          <div className="settings-item">
            <span>English</span>
            <input
              type="radio"
              name="lang"
              checked={lang === 'en'}
              onChange={() => setLang('en')}
            />
          </div>
          <div className="settings-item">
            <span>Indonesian</span>
            <input
              type="radio"
              name="lang"
              checked={lang === 'id'}
              onChange={() => setLang('id')}
            />
          </div>
        </div>
      </div>

      <WidgetNav
        profileIcon={role === 'guest' ? '❓' : '👤'}
        role={role}
        username={username}
      />
    </div>
  );
};

export default LanguageSettings;
