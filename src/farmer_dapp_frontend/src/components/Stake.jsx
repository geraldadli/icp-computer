import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

// Mock validator data
const VALIDATORS = [
  { id: 'solflare',  name: 'Solflare',   apy: 6.98, logo: 'https://via.placeholder.com/32?text=S' },
  { id: 'phantom',   name: 'Phantom',    apy: 7.12, logo: 'https://via.placeholder.com/32?text=P' },
  { id: 'marinade',  name: 'Marinade',   apy: 6.85, logo: 'https://via.placeholder.com/32?text=M' },
  // …add more…
];

export default function Stake() {
  const { state }   = useLocation();
  const navigate    = useNavigate();

  // user context
  const role        = (state?.role     || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const method      = state?.method   || 'email';
  const profileIcon = method === 'ii' ? '🆔' : role==='guest'?'❓':'👤';

  // form state
  const [amount, setAmount]               = useState('');
  const [selectedValidator, setValidator] = useState(VALIDATORS[0]);
  const [showPicker, setShowPicker]       = useState(false);

  // mock balances & thresholds
  const maxBalance      = 0;        // replace with real
  const networkMin      = 0.01;     // e.g. min SOL to cover fees

  // derived values
  const apy        = selectedValidator.apy;
  const annualReturn = amount
    ? ((parseFloat(amount) * apy) / 100).toFixed(6)
    : '-';
  const totalStake   = '1.72M SOL'; // mock

  const isInsufficient = !amount || parseFloat(amount) + networkMin > maxBalance;

  // handlers
  const goBack     = () => navigate('/cash', { state });
  const openPicker = () => setShowPicker(true);
  const closePicker= () => setShowPicker(false);
  const handleStake= () => {
    alert(`Staked ${amount} SOL with ${selectedValidator.name}`);
    // reset
    setAmount('');
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Navbar */}
      <NavBar
        greeting={`Stake SOL`}
        profileIcon={profileIcon}
        onMenu={() => {}}
        onSettings={() => navigate('/settings', { state })}
      />

      {/* In‑page back */}
      <div className="page-back-wrapper">
        <button className="page-back" onClick={goBack}>← Back</button>
      </div>

      <div className="dashboard-content stake-container">
        {/* Asset */}
        <div className="stake-section">
          <label>Asset</label>
          <div className="stake-row">
            <span>SOL</span>
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setAmount(!isNaN(v) && v >= 0 ? e.target.value : '');
              }}
            />
          </div>
          <div className="mini-label">Max: {maxBalance}</div>
        </div>

        {/* Validator */}
        <div className="stake-section validator-section">
          <label>
            Validator <span className="info-icon">ℹ️</span>
          </label>
          <div className="validator-display">
            <img
              src={selectedValidator.logo}
              alt={selectedValidator.name}
              className="validator-logo"
            />
            <div className="validator-info">
              <div className="validator-name">{selectedValidator.name}</div>
              <div className="validator-apy">{selectedValidator.apy}% APY</div>
            </div>
            <button className="edit-btn" onClick={openPicker}>
              Edit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stake-stats">
          <div className="stat-row">
            <span>Annual return <span className="info-icon">ℹ️</span></span>
            <span>{annualReturn} SOL</span>
          </div>
          <div className="stat-row">
            <span>Total stake <span className="info-icon">ℹ️</span></span>
            <span>{totalStake}</span>
          </div>
        </div>

        {/* Error */}
        {isInsufficient && (
          <div className="error-row">
            <strong>Insufficient SOL to stake</strong>
            <p>
              Please ensure you have at least {networkMin} SOL in your wallet 
              to cover network fees.
            </p>
          </div>
        )}

        {/* Stake button */}
        <button
          className="swap-btn"
          onClick={handleStake}
          disabled={isInsufficient}
        >
          Stake
        </button>
      </div>

      {/* Validator picker overlay */}
      {showPicker && (
        <div className="modal-backdrop" onClick={closePicker}>
          <div
            className="modal-card"
            onClick={e => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search validators…"
              className="validator-search"
              onChange={e => {
                const q = e.target.value.toLowerCase();
                setFiltered(
                  VALIDATORS.filter(v =>
                    v.name.toLowerCase().includes(q)
                  )
                );
              }}
            />
            <div className="validator-list">
              {VALIDATORS.map(v => (
                <div
                  key={v.id}
                  className="validator-item"
                  onClick={() => {
                    setValidator(v);
                    closePicker();
                  }}
                >
                  <img src={v.logo} alt={v.name} />
                  <span>{v.name}</span>
                  <span>{v.apy}% APY</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
