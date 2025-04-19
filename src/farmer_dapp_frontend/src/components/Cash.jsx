// src/components/Cash.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

import paypalIcon     from '../assets/paypal.png';
import mastercardIcon from '../assets/mastercard.png';
import visaIcon       from '../assets/visa.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Cash = () => {
  const { state } = useLocation();
  const navigate    = useNavigate();

  // retrieve role/username from router state
  const role     = (state?.role || 'guest').toLowerCase();
  const username = state?.username || 'Guest';
  const profileIcon = role === 'guest' ? '❓' : '👤';

  const [filter, setFilter] = useState('General');
  const infoItems = Array(10).fill(); // placeholder lines

  const handleMenu = () => {
  
  };
  const handleSettings = () => navigate('/settings');

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Wallet"
        profileIcon={profileIcon}
        onMenu={handleMenu}
        onSettings={handleSettings}
      />

      <div className="dashboard-content">
        {/* Balance Section */}
        <div className="balance-section">
          <div className="balance-header">
            <span>Balance</span>
            <div className="payment-icons">
              <img src={paypalIcon} alt="PayPal" />
              <img src={mastercardIcon} alt="Mastercard" />
              <img src={visaIcon} alt="Visa" />
            </div>
          </div>

          <div className="balance-amount">Rp. 100.000.000</div>
          <button
            className="top-up-btn"
            onClick={() =>
              navigate('/topup', { state: { role, username } })
            }
          >
            Top Up
          </button>
        </div>

        {/* Information Section */}
        <div className="information-section">
          <span>Information</span>
          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>General</option>
            <option>Sales</option>
            <option>Purchases</option>
            <option>Rewards</option>
            <option>Programs</option>
          </select>

          <div className="info-list">
            {infoItems.map((_, i) => (
              <div key={i} className="info-list-item" />
            ))}
          </div>
        </div>
      </div>

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
      />
    </div>
  );
};

export default Cash;
