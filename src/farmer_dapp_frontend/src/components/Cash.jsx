// src/components/Cash.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

// MOCK DATA
const mockStats = {
  balance: 6969.0,
  delta:   365.17,
  pct:     5.24,
};

const mockTokens = [
  { id:1, symbol:'SOL',  name:'Solana',   usd:2967.57, amt:11.85, change:'+6.02%' },
  { id:2, symbol:'USDC', name:'USDC',     usd:699.96, amt:699.96, change:'+0.01%' },
  { id:3, symbol:'BONK', name:'Bonk',     usd:486.54, amt:34752857.14, change:'+2.03%' },
  { id:4, symbol:'RAY',  name:'Raydium',  usd:213.25, amt:67.18, change:'+4.24%' },
];

const mockTransactions = [
  { id: 1, date: '2025-04-20', type: 'Send ICP',    amount: -10.0, status: 'Confirmed' },
  { id: 2, date: '2025-04-19', type: 'Receive ICP', amount: +20.5, status: 'Confirmed' },
  { id: 3, date: '2025-04-18', type: 'Stake ICP',   amount: -5.0, status: 'Pending'   },
  { id: 4, date: '2025-04-17', type: 'Airdrop NFT', amount: 0.0,   status: 'Confirmed' },
];

const mockNFTs = [
  { id: 1, name: 'Farmer #1024',    image: 'https://via.placeholder.com/100?text=NFT+1' },
  { id: 2, name: 'Harvest #2048',   image: 'https://via.placeholder.com/100?text=NFT+2' },
  { id: 3, name: 'Farmhouse #3072', image: 'https://via.placeholder.com/100?text=NFT+3' },
];

export default function Cash() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const role        = (state?.role     || 'guest').toLowerCase();
  const username    = state?.username || 'Guest';
  const method      = state?.method   || 'email';
  const profileIcon = method === 'ii'
    ? '🆔'
    : role === 'guest'
      ? '❓'
      : '👤';

  const handleSettings = () =>
    navigate('/settings', { state });

  const totalTokensUSD = mockTokens.reduce((sum, t) => sum + t.usd, 0);

  // Define your action buttons with target routes
  const actions = [
    { key:'receive', icon:'⬇️', label:'Receive', route:'/receive' },
    { key:'buy',     icon:'🛒', label:'Buy',     route:'/buy'     },
    { key:'swap',    icon:'🔄', label:'Swap',    route:'/swap'    },
    { key:'stake',   icon:'📈', label:'Stake',   route:'/stake'   },
    { key:'send',    icon:'➡️', label:'Send',    route:'/send'    },
  ];

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Top Bar */}
      <NavBar
        greeting="Wallet"
        profileIcon={profileIcon}
        onMenu={() => {}}
        onSettings={handleSettings}
      />

      <div className="dashboard-content">

        {/* 1) Main Wallet Card */}
        <div className="wallet-card">
          <div className="wallet-card-top">
            <div className="profile-avatar-small">{profileIcon}</div>
            <div className="wallet-title">Main Wallet</div>
            {/* QR now routes to /receive */}
            <button
              className="qr-btn"
              onClick={() => navigate('/receive', { state })}
            >
              🔳
            </button>
          </div>
          <div className="wallet-balance">
            ${mockStats.balance.toLocaleString(undefined, { minimumFractionDigits:2 })}
          </div>
          <div className="wallet-change">
            +${mockStats.delta.toLocaleString(undefined,{minimumFractionDigits:2})} (+{mockStats.pct}%)
          </div>
        </div>

        {/* 2) Action Buttons Row */}
        <div className="action-buttons">
          {actions.map((btn) => (
            <button
              key={btn.key}
              className="action-button"
              onClick={() => navigate(btn.route, { state })}
            >
              <span className="action-icon">{btn.icon}</span>
              <small>{btn.label}</small>
            </button>
          ))}
        </div>

        {/* 3) Tokens Section */}
        <div className="section tokens-section">
          <div className="section-header">
            <span>Tokens</span>
            <span className="tokens-value">
              ${totalTokensUSD.toLocaleString()}
            </span>
            <button
              className="view-all-btn"
              onClick={() => navigate('/tokens', { state })}
            >
              View all ›
            </button>
          </div>
          <div className="token-list">
            {mockTokens.map((t) => (
              <div key={t.id} className="token-item">
                <div className="token-info">
                  <strong>{t.name}</strong>
                  <span className="token-change">{t.change}</span>
                </div>
                <div className="token-values">
                  <div>${t.usd.toLocaleString()}</div>
                  <div>{t.amt.toLocaleString()} {t.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4) Transaction History */}
        <div className="section transaction-section">
          <h3>Transaction History</h3>
          <table className="txn-table">
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td
                    data-negative={tx.amount < 0 ? true : undefined}
                    data-positive={tx.amount > 0 ? true : undefined}
                  >
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </td>
                  <td>{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5) NFT Showcase */}
        <div className="section nft-section">
          <h3>Your NFTs</h3>
          <div className="nft-grid">
            {mockNFTs.map((nft) => (
              <div key={nft.id} className="nft-card">
                <img src={nft.image} alt={nft.name} />
                <div className="nft-name">{nft.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Nav */}
      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
