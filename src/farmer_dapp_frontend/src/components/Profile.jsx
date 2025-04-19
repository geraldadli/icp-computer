// src/components/Profile.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from './WidgetNav';

const Profile = () => {
  const { state } = useLocation();
  const navigate    = useNavigate();

  const role     = (state?.role || 'guest').toLowerCase();
  const username = state?.username || 'Guest';
  const profileIcon = role === 'guest' ? '❓' : '👤';

  const handleBack       = () =>
    navigate('/home', { state: { role, username } });
  const handleChangePass = () =>
    navigate(`/${role}/change-password`, { state: { role, username } });
  const handleSignIn     = () =>
    navigate(`/${role}/login`,   { state: { role, username } });
  const handleLeave      = () =>
    navigate('/roles');

  return (
    <div className="home-container profile-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Profile</div>
        <div style={{ width: 32 }} />{/* placeholder for spacing */}
      </div>

      {/* Avatar + Name + Actions */}
      <div className="profile-avatar">{profileIcon}</div>
      {role !== 'guest' && (
        <>
          <div className="profile-name">{username}</div>
          <div className="profile-actions">
            <button className="profile-action-button">📩</button>
            <button className="profile-action-button">📞</button>
            <button className="profile-action-button">⭐</button>
          </div>

          {/* Info Card */}
          <div className="profile-info-card">
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

            <button
              className="leave-btn"
              onClick={handleLeave}
            >
              Leave Account
            </button>
          </div>
        </>
      )}

      {/* Guest prompt */}
      {role === 'guest' && (
        <div className="profile-info-card">
          <p>Please sign in to view your profile.</p>
          <button
            className="leave-btn"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      )}

      {/* Bottom Widget Nav */}
      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
      />
    </div>
  );
};

export default Profile;
