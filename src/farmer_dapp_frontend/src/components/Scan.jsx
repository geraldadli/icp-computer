import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

export default function Scan() {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const videoRef    = useRef(null);

  const [granted, setGranted] = useState(false);
  const [error,   setError]   = useState('');

  const role        = (state?.role     || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const method      = state?.method   || 'email';
  const profileIcon = method === 'ii' ? '🆔' : role==='guest'?'❓':'👤';

  // request camera
  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      setGranted(true);
    } catch (e) {
      setError('Camera permission denied.');
    }
  };

  const goBack = () => {
    // stop camera on leave
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    navigate(-1); // back to Send
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Scan QR"
        profileIcon={profileIcon}
        onMenu={() => {}}
        onSettings={() => navigate('/settings', { state })}
      />

      {/* In‑page back */}
      <div className="page-back-wrapper">
        <button className="page-back" onClick={goBack}>← Back</button>
      </div>

      <div className="dashboard-content scan-container">
        {!granted ? (
          <button className="enable-camera-btn" onClick={enableCamera}>
            Enable Camera Access
          </button>
        ) : (
          <>
            {error && <div className="error-row">{error}</div>}
            <video
              ref={videoRef}
              className="qr-video"
              autoPlay
              muted
              playsInline
            />
          </>
        )}
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
