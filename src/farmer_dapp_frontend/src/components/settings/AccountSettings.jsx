import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WidgetNav from '../WidgetNav';

const AccountSettings = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const role        = (state?.role || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const emailDefault= state?.email    || 'your.email@example.com';
  const phoneDefault= state?.phone    || '+62 8123456789';
  const profileIcon = role === 'guest' ? '❓' : '👤';

  const [name,  setName]  = useState(username);
  const [email, setEmail] = useState(emailDefault);
  const [phone, setPhone] = useState(phoneDefault);

  const handleBack = () => navigate(-1);
  const handleSave = (e) => {
    e.preventDefault();
    // → call your API to persist changes…
    console.log('Saving Account:', { name, email, phone });
    navigate(-1); // back to /settings
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="profile-title">Account</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Form Card */}
      <div className="settings-card">
        <form className="account-form" onSubmit={handleSave}>
          <div className="account-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="account-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="account-field">
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" className="save-btn">
            Save
          </button>
        </form>
      </div>

      {/* Bottom Nav */}
      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
      />
    </div>
  );
};

export default AccountSettings;
