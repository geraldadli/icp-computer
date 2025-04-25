// src/components/Settings.jsx
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from './WidgetNav';
import { ThemeContext } from '../ThemeContext';

const Settings = () => {
  const { state } = useLocation();
  const navigate    = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleBack = () => navigate(-1);

  const role     = (state?.role || 'guest').toLowerCase();
  const username = state?.username || 'Guest';
  const profileIcon = role === 'guest' ? '❓' : '👤';

  const items = [
    { key: 'account',      label: 'Account',      path: 'account' },
    { key: 'activity',     label: 'Activity',     path: 'activity' },
    { key: 'notification', label: 'Notification', path: 'notification' },
    { key: 'language',     label: 'Language',     path: 'language' },
    { key: 'privacy',      label: 'Privacy',      path: 'privacy' },
  ];

  const goTo = (sub) =>
    navigate(`/settings/${sub}`, { state: { role, username } });

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Setting</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Card */}
      <div className="settings-card">
        {/* Standard options */}
        {items.map((i) => (
          <div
            key={i.key}
            className="settings-item"
            onClick={() => goTo(i.path)}
          >
            <span>{i.label}</span>
            <span>›</span>
          </div>
        ))}

        {/* Mode toggle */}
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

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
      />
    </div>
  );
};

export default Settings;
