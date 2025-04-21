import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

export default function Buy() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const role       = (state?.role     || 'guest').toLowerCase();
  const username   = state?.username || 'Guest';
  const method     = state?.method   || 'email';
  const profileIcon= method==='ii'?'🆔':role==='guest'?'❓':'👤';

  // 1) Fiat side
  const [spendAmt, setSpendAmt]         = useState('');
  const [fiat, setFiat]                 = useState('IDR');

  // 2) Crypto side
  const [token, setToken]               = useState('SOL');

  // Mock rate mapping (fiat per 1 token)
  const rates = {
    SOL: { IDR: 2311967.91, USD: 24.15 },
    USDC:{ IDR: 15000,      USD: 1.00 },
  };
  // compute getAmount
  const getAmt = useMemo(() => {
    const r = rates[token]?.[fiat] || 1;
    const num = parseFloat(spendAmt);
    return isNaN(num) ? '' : (num / r).toFixed(6);
  }, [spendAmt, fiat, token]);

  // Pay methods
  const payMethods = ['QRIS','BCA','Gopay','IC Pay'];
  const [payMethod, setPayMethod] = useState(payMethods[0]);

  const handleBuy = () => {
    alert(
      `Buying ${getAmt} ${token} with ${spendAmt} ${fiat} via ${payMethod}`
    );
    navigate('/cash', { state: { role, username, method } });
  };

  return (
    <div className="buy-container">
      <NavBar
        greeting="Buy crypto"
        profileIcon={profileIcon}
        onMenu={() => {}}
        onSettings={() => navigate('/settings', { state })}
      />

      <div className="buy-content">

        {/* You spend */}
        <div className="buy-row">
          <div className="buy-label">You spend</div>
          <div className="buy-input-group">
            <input
              type="number"
              className="buy-input"
              placeholder="0.00"
              value={spendAmt}
              onChange={(e) => setSpendAmt(e.target.value)}
            />
            <select
              className="currency-select"
              value={fiat}
              onChange={(e) => setFiat(e.target.value)}
            >
              <option value="IDR">🇮🇩 IDR</option>
              <option value="USD">💵 USD</option>
            </select>
          </div>
        </div>

        {/* You get */}
        <div className="buy-row">
          <div className="buy-label">You get</div>
          <div className="buy-input-group">
            <input
              type="text"
              className="buy-input"
              readOnly
              placeholder="0.000000"
              value={getAmt}
            />
            <select
              className="currency-select"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            >
              <option value="SOL">🟣 SOL</option>
              <option value="USDC">🔵 USDC</option>
            </select>
          </div>
        </div>

        {/* Rate display */}
        <div className="rate-row">
          1 {token} ≈ {rates[token]?.[fiat]?.toLocaleString()} {fiat}
        </div>

        {/* Pay using */}
        <div className="buy-row">
          <div className="buy-label">Pay using</div>
          <select
            className="pay-select"
            value={payMethod}
            onChange={(e) => setPayMethod(e.target.value)}
          >
            {payMethods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Buy button */}
        <button className="buy-button" onClick={handleBuy}>
          Buy {token}
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
