// src/components/Profile.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from './WidgetNav';

const Profile = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();

  const role        = (state?.role     || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const method      = state?.method   || 'email'; // 'ii' or 'email'
  const profileIcon = method === 'ii' ? '🆔' : '👤';

  const handleBack       = () =>
    navigate('/home', { state: { ...state } });
  const handleLeave      = () =>
    navigate('/roles');
  const handleChangePass = () =>
    navigate(`/${role}/change-password`, { state });
  const handleResetII    = () => {
    // TODO: call II logout/reset flow
    console.log('Resetting Internet Identity');
    navigate('/roles');
  };

  return (
    <div className="home-container profile-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Profile</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Avatar + Name */}
      <div className="profile-avatar">{profileIcon}</div>
      <div className="profile-name">
        {method === 'ii'
          ? `Principal: ${username}`       // show full principal
          : username                       // normal username
        }
      </div>

      {/* Action Icons (only for email users) */}
      {method === 'email' && (
        <div className="profile-actions">
          <button className="profile-action-button">📩</button>
          <button className="profile-action-button">📞</button>
          <button className="profile-action-button">⭐</button>
        </div>
      )}

      {/* Info Card */}
      <div className="profile-info-card">
        {method === 'email' ? (
          <>
            <div className="info-row">
              <div className="info-label">Email :</div>
              <div className="info-value">
                {state?.email || 'your.email@example.com'}
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Phone :</div>
              <div className="info-value">
                {state?.phone || '+62 8123456789'}
              </div>
            </div>
            <div
              className="change-password"
              onClick={handleChangePass}
            >
              Change Password
            </div>
          </>
        ) : (
          <>
            <p style={{ marginBottom: 24, textAlign: 'center' }}>
              You are signed in via Internet Identity.<br/>
              No email or phone data stored locally.
            </p>
            <button
              className="ii-reset-btn"
              onClick={handleResetII}
            >
              Reset Identity
            </button>
          </>
        )}

        {/* Leave Account (common) */}
        <button
          className="leave-btn"
          onClick={handleLeave}
        >
          Leave Account
        </button>
      </div>

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
      />
    </div>
  );
};

export default Profile;
