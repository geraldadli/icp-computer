// src/components/settings/NotificationSettings.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from '../WidgetNav';

const NotificationSettings = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { role, username } = state || {};
  const profileIcon = role === 'guest' ? '❓' : '👤';

  const [muteOption, setMuteOption] = useState('off');

  const handleBack = () => navigate(-1);

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Notification</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Settings Card */}
      <div className="settings-card">
        <div className="settings-list">
          {[
            { label: 'Off',          value: 'off' },
            { label: 'Mute 1 Day',   value: '1day' },
            { label: 'Mute 1 Week',  value: '1week' },
            { label: 'Always Mute',  value: 'always' },
          ].map((opt) => (
            <div key={opt.value} className="settings-item">
              <span>{opt.label}</span>
              <input
                type="radio"
                name="mute"
                value={opt.value}
                checked={muteOption === opt.value}
                onChange={() => setMuteOption(opt.value)}
              />
            </div>
          ))}
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

export default NotificationSettings;
