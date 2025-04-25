// src/components/Swap.jsx
import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

export default function Swap() {
  const { state }    = useLocation();
  const navigate     = useNavigate();

  // user context
  const role         = (state?.role     || 'guest').toLowerCase();
  const username     = state?.username || 'Guest';
  const method       = state?.method   || 'email';
  const profileIcon  = method === 'ii' ? '🆔' : role === 'guest' ? '❓' : '👤';

  // top‑level mode: 'swap' or 'limit'
  const [mode, setMode] = useState('swap');

  // tokens & amounts
  const [sellToken, setSellToken]   = useState('SOL');
  const [buyToken,  setBuyToken]    = useState('USDC');
  const [sellAmt,   setSellAmt]     = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [expiry,     setExpiry]     = useState('Never');

  // Mock rates & balances
  const rates = { SOL: { USDC: 140.03 }, USDC: { SOL: 1/140.03 } };
  const marketRate = useMemo(
    () => rates[sellToken]?.[buyToken] || 0,
    [sellToken, buyToken]
  );
  const maxBalance = 0; // replace with real

  const buyAmt = useMemo(() => {
    const n = parseFloat(sellAmt);
    return (!n || marketRate === 0)
      ? ''
      : (n * marketRate).toFixed(6);
  }, [sellAmt, marketRate]);

  const isInsufficient = sellAmt && parseFloat(sellAmt) > maxBalance;

  // Slippage for swap
  const [slippage, setSlippage]     = useState('1');
  const [customSlip, setCustomSlip] = useState('');

  // Handlers
  const swapTokens   = () => {
    setSellAmt('');
    const tmp = sellToken;
    setSellToken(buyToken);
    setBuyToken(tmp);
  };
  const goBack       = () => navigate('/cash', { state });
  const openMenu     = () => {}; // open sidebar if you have one
  const goSettings   = () => navigate('/settings', { state });
  const handleSwap   = () =>
    alert(`Swapped ${sellAmt} ${sellToken} → ${buyAmt} ${buyToken}`);
  const handleLimit  = () =>
    alert(`Limit: Sell ${sellAmt} ${sellToken} @ ${limitPrice} ${buyToken}, expires ${expiry}`);

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Navbar */}
      <NavBar
        greeting="Swap / Limit"
        profileIcon={profileIcon}
        onMenu={openMenu}
        onSettings={goSettings}
      />

      {/* In‑page back */}
      <div className="page-back-wrapper">
        <button className="page-back" onClick={goBack}>← Back</button>
      </div>

      {/* Top‑level pill toggle */}
      <div className="pill-toggle">
        {['swap','limit'].map(m => (
          <button
            key={m}
            className={`pill-btn${mode===m?' active':''}`}
            onClick={()=>{
              setMode(m);
              // clear inputs on mode switch if desired
              setSellAmt(''); setLimitPrice(''); setCustomSlip('');
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="dashboard-content swap-container">
        {mode === 'swap' ? (
          <>
            {/* Sell Section */}
            <div className="swap-section">
              <label>Sell</label>
              <div className="swap-row">
                <select
                  value={sellToken}
                  onChange={e => setSellToken(e.target.value)}
                >
                  <option>SOL</option>
                  <option>USDC</option>
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={sellAmt}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setSellAmt(!isNaN(v) && v >= 0 ? e.target.value : '');
                  }}
                />
              </div>
              <div className="mini-label">Max: {maxBalance}</div>
            </div>

            {/* Direction Button */}
            <button className="swap-direction-btn" onClick={swapTokens}>
              ↕
            </button>

            {/* Buy Section */}
            <div className="swap-section">
              <label>Buy</label>
              <div className="swap-row">
                <select
                  value={buyToken}
                  onChange={e => setBuyToken(e.target.value)}
                >
                  <option>USDC</option>
                  <option>SOL</option>
                </select>
                <input
                  type="text"
                  placeholder="0.000000"
                  readOnly
                  value={buyAmt}
                />
              </div>
            </div>

            {/* Rate & Slippage */}
            {sellAmt && (
              <>
                <div className="rate-row">
                  <span>Rate</span>
                  <span>
                    1 {sellToken} ={' '}
                    {marketRate > 0
                      ? `${marketRate.toFixed(2)} ${buyToken}`
                      : '—'}
                  </span>
                </div>
                <div className="slippage-row">
                  <span>Slippage tolerance</span>
                  <select
                    value={slippage}
                    onChange={e => setSlippage(e.target.value)}
                  >
                    {['0.5','1','2','5','10','20','custom'].map(o => (
                      <option key={o} value={o}>
                        {o==='custom' ? 'Custom' : o+'%'}
                      </option>
                    ))}
                  </select>
                  {slippage === 'custom' && (
                    <input
                      className="slippage-input"
                      placeholder="%"
                      value={customSlip}
                      onChange={e => setCustomSlip(e.target.value)}
                    />
                  )}
                </div>
              </>
            )}

            {/* Insufficient Warning */}
            {isInsufficient && (
              <div className="error-row">
                <strong>Insufficient {sellToken}</strong>
                <p>
                  Make sure you have more than 0.005 {sellToken} to cover fees.
                </p>
              </div>
            )}

            {/* Swap Button */}
            <button
              className="swap-btn"
              onClick={handleSwap}
              disabled={!sellAmt || isInsufficient}
            >
              Swap
            </button>
          </>
        ) : (
          <>
            {/* SELL */}
            <div className="swap-section">
              <label>Sell</label>
              <div className="swap-row">
                <select
                  value={sellToken}
                  onChange={e => setSellToken(e.target.value)}
                >
                  <option>SOL</option>
                  <option>USDC</option>
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={sellAmt}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setSellAmt(!isNaN(v) && v >= 0 ? e.target.value : '');
                  }}
                />
              </div>
              <div className="mini-label">Max: {maxBalance}</div>
            </div>

            {/* Direction */}
            <button className="swap-direction-btn" onClick={swapTokens}>
              ↕
            </button>

            {/* BUY */}
            <div className="swap-section">
              <label>Buy</label>
              <div className="swap-row">
                <select
                  value={buyToken}
                  onChange={e => setBuyToken(e.target.value)}
                >
                  <option>USDC</option>
                  <option>SOL</option>
                </select>
                <input
                  type="text"
                  placeholder="0.000000"
                  readOnly
                  value={buyAmt}
                />
              </div>
            </div>

            {/* PRICE (Limit) */}
            <div className="swap-section">
              <label>Sell {sellToken} at Price</label>
              <div className="swap-row">
                <select
                  value={buyToken}
                  onChange={e => setBuyToken(e.target.value)}
                >
                  <option>USDC</option>
                  <option>SOL</option>
                </select>
                <input
                  type="number"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={e => setLimitPrice(e.target.value)}
                />
              </div>
            </div>

            {/* EXPIRY */}
            <div className="swap-section">
              <label>Expiry</label>
              <select
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
              >
                <option>Never</option>
                <option>1 hour</option>
                <option>1 day</option>
                <option>1 week</option>
              </select>
            </div>

            {isInsufficient && (
              <div className="error-row">
                <strong>Insufficient {sellToken}</strong>
                <p>
                  Make sure you have more than 0.01 {sellToken} to cover fees.
                </p>
              </div>
            )}

            {/* Place Order Button */}
            <button
              className="swap-btn"
              onClick={handleLimit}
              disabled={!sellAmt || !limitPrice}
            >
              Place order
            </button>
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
