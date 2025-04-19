// src/components/settings/ActivitySettings.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from '../WidgetNav';

const ActivitySettings = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { role, username } = state || {};
  const profileIcon = role === 'guest' ? '❓' : '👤';

  const [trackActivity, setTrackActivity] = useState(true);
  const [showOnline, setShowOnline]       = useState(true);

  const handleBack = () => navigate(-1);

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Activity</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Settings Card */}
      <div className="settings-card">
        <div className="settings-list">
          <div className="settings-item">
            <span>Enable Activity Tracking</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={trackActivity}
                onChange={() => setTrackActivity((v) => !v)}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <span>Show Online Status</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={showOnline}
                onChange={() => setShowOnline((v) => !v)}
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
      />
    </div>
  );
};

export default ActivitySettings;
