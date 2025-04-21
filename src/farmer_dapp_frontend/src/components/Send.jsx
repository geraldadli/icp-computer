import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';
import { IoQrCodeOutline } from 'react-icons/io5';

export default function Send() {
  const { state }   = useLocation();
  const navigate    = useNavigate();

  const role        = (state?.role     || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const method      = state?.method   || 'email';
  const profileIcon = method === 'ii' ? '🆔' : role==='guest'?'❓':'👤';

  // recipient state
  const [toAddr, setToAddr] = useState('');

  // Handlers
  const goBack    = () => navigate('/cash', { state });
  const goScan    = () => navigate('/scan', { state });
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setToAddr(text);
    } catch (err) {
      alert('Paste failed: ' + err.message);
    }
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Select Recipient"
        profileIcon={profileIcon}
        onMenu={() => {}}
        onSettings={() => navigate('/settings', { state })}
      />

      {/* In‑page back */}
      <div className="page-back-wrapper">
        <button className="page-back" onClick={goBack}>← Back</button>
      </div>

      <div className="dashboard-content send-container">
        <div className="send-input-row">
          <input
            type="text"
            className="send-input"
            placeholder="Select or paste address"
            value={toAddr}
            onChange={e => setToAddr(e.target.value)}
          />
          <button className="paste-btn" onClick={handlePaste}>
            Paste
          </button>
        </div>

        <button className="qr-scan-btn" onClick={goScan}>
          <IoQrCodeOutline size={24} /> Scan QR
        </button>
      </div>

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
