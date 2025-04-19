// src/components/Settings.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from './WidgetNav';

const Settings = () => {
  const { state } = useLocation();
  const navigate    = useNavigate();

  const role     = (state?.role || 'guest').toLowerCase();
  const username = state?.username || 'Guest';
  const profileIcon = role === 'guest' ? '❓' : '👤';

  const [darkMode, setDarkMode] = useState(false);

  const handleBack = () => navigate(-1);
  const optionClick = (opt) => {
    // for now: just console.log or wire up later
    console.log('Selected', opt);
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Setting</div>
        <div style={{ width: 32 }} />
      </div>

      {/* White card with options */}
      <div className="settings-card">
        <div className="settings-list">
          {['Account', 'Activity', 'Notification', 'Language', 'Privacy'].map(
            (opt) => (
              <div
                key={opt}
                className="settings-item"
                onClick={() => optionClick(opt)}
              >
                <span>{opt}</span>
                <span>›</span>
              </div>
            )
          )}

          {/* Mode Toggle */}
          <div className="settings-item">
            <span>Mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((v) => !v)}
              />
              <span className="slider" />
            </label>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
      />
    </div>
  );
};

export default Settings;
