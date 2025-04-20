import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

// MOCK DATA
const mockStats = {
  icpPriceUSD: 5.23,
  yourICP: 120.45,
  marketCap: '1.3B USD',
};

const mockTransactions = [
  { id: 1, date: '2025-04-20', type: 'Send ICP',    amount: -10.0, status: 'Confirmed' },
  { id: 2, date: '2025-04-19', type: 'Receive ICP', amount: +20.5, status: 'Confirmed' },
  { id: 3, date: '2025-04-18', type: 'Stake ICP',   amount: -5.0, status: 'Pending'   },
  { id: 4, date: '2025-04-17', type: 'Airdrop NFT', amount: 0.0,   status: 'Confirmed' },
];

const mockNFTs = [
  { id: 1, name: 'Farmer #1024',   image: 'https://via.placeholder.com/100?text=NFT+1' },
  { id: 2, name: 'Harvest #2048',  image: 'https://via.placeholder.com/100?text=NFT+2' },
  { id: 3, name: 'Farmhouse #3072',image: 'https://via.placeholder.com/100?text=NFT+3' },
];

export default function Cash() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const role     = (state?.role     || 'guest').toLowerCase();
  const username = state?.username || 'Guest';
  const method   = state?.method   || 'email';
  const profileIcon = method === 'ii' ? '🆔' : '👤';

  const [filter, setFilter] = useState('General');

  const handleMenu     = () => {};
  const handleSettings = () =>
    navigate('/settings', { state });

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* Top Bar */}
      <NavBar
        greeting="Wallet"
        profileIcon={profileIcon}
        onMenu={handleMenu}
        onSettings={handleSettings}
      />

      <div className="dashboard-content">

        {/* 1) Stats Section */}
        <div className="section stats-section">
          <h3>ICP Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Current Price</div>
              <div className="stat-value">${mockStats.icpPriceUSD}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Your ICP Balance</div>
              <div className="stat-value">{mockStats.yourICP} ICP</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Market Cap</div>
              <div className="stat-value">{mockStats.marketCap}</div>
            </div>
          </div>
        </div>

        {/* 2) Live Price Dashboard Placeholder */}
        <div className="section live-price-section">
          <h3>Live Price Chart</h3>
          <div className="chart-placeholder">[Chart goes here]</div>
        </div>

        {/* 3) Top‑Up Section */}
        <div className="section topup-section">
          <h3>Top Up</h3>
          <button onClick={() => alert('Top up ICP flow')}>
            Top up ICP
          </button>
          <button onClick={() => alert('Mint/Buy NFT flow')}>
            Buy NFT
          </button>
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
