// src/components/Scan.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scan() {
  const { state }    = useLocation();
  const navigate     = useNavigate();

  const role        = (state?.role     || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const method      = state?.method   || 'email';
  const profileIcon = method==='ii'?'🆔':role==='guest'?'❓':'👤';

  const [permissionDenied, setPermissionDenied] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          const html5Qr = new Html5Qrcode(/* element id = */ "qr-reader");
          scannerRef.current = html5Qr;
          html5Qr.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              // once we get a result, stop scanning and navigate back
              html5Qr.stop().then(() => {
                navigate('/send', {
                  state: { ...state, toAddr: decodedText }
                });
              });
            },
            (error) => {
              /* ignore scan errors for now */
            }
          ).catch(err => {
            console.error("QR start failed", err);
            setPermissionDenied(true);
          });
        }
      })
      .catch(_ => setPermissionDenied(true));

    return () => {
      // cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [navigate, state]);

  const goBack = () => {
    if (scannerRef.current) scannerRef.current.stop().catch(() => {});
    navigate(-1);
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

      {/* in‑page back */}
      <div className="page-back-wrapper">
        <button className="page-back" onClick={goBack}>← Back</button>
      </div>

      <div className="dashboard-content scan-container">
        {permissionDenied ? (
          <p style={{ color: 'var(--text-color)', textAlign: 'center' }}>
            Camera access denied.<br/>
            Please enable it in your browser settings.
          </p>
        ) : (
          <div id="qr-reader" style={{ width: '100%' }} />
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
