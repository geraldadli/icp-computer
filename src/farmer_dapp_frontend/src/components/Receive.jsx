import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

export default function Receive() {
  const { state }   = useLocation();
  const navigate    = useNavigate();

  const role        = (state?.role     || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const method      = state?.method   || 'email';
  const profileIcon = method === 'ii' ? '🆔'
                       : role === 'guest' ? '❓' : '👤';

  // your on‑chain wallet principal or address
  const walletId = state?.walletId || 'abcd-4ya6g-iaaaa-aaaaa-cai';

  const handleBack = () => navigate('/cash', { state });

  const handleCopy = () => {
    navigator.clipboard.writeText(walletId);
    alert('Wallet ID copied!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: walletId }).catch(console.error);
    } else {
      alert('Share unavailable');
    }
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Receive"
        profileIcon={profileIcon}
        onMenu={() => {}}
        onSettings={() => navigate('/settings', { state })}
      />

      {/* Back arrow inside content */}
      <div className="page-back-wrapper">
        <button className="page-back" onClick={handleBack}>
          ← Back
        </button>
      </div>

      <div className="dashboard-content receive-container">
        <div className="receive-card">
          <QRCodeSVG
            value={walletId}
            size={200}
            bgColor="transparent"
            fgColor="var(--text-color)"
          />

          <div className="receive-title">Main Wallet</div>
          <div className="wallet-id">{walletId}</div>

          <div className="receive-actions">
            <button className="receive-btn" onClick={handleCopy}>
              📋 Copy
            </button>
            <button className="receive-btn" onClick={handleShare}>
              📤 Share
            </button>
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
}
