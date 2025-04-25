// src/components/settings/PrivacySettings.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from '../WidgetNav';

const PrivacySettings = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { role, username } = state || {};
  const method   = state?.method   || 'email';
  const profileIcon = method === 'ii'
    ? '🆔'
    : role === 'guest'
      ? '❓'
      : '👤';

  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing]             = useState(false);

  const handleBack = () => navigate(-1);

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Privacy</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Settings Card */}
      <div className="settings-card">
        <div className="settings-list">
          {/* Profile Visibility */}
          <div className="settings-item">
            <span>Profile Visibility</span>
            <select
              className="filter-dropdown"
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Data Sharing */}
          <div className="settings-item">
            <span>Allow Data Sharing</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={dataSharing}
                onChange={() => setDataSharing((v) => !v)}
              />
              <span className="slider" />
            </label>
          </div>
        </div>
      </div>

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
};

export default PrivacySettings;
