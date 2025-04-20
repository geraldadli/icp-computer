// src/components/Home.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar        from './NavBar';
import WidgetNav     from './WidgetNav';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard  from './BuyerDashboard';

const Home = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const role      = (state?.role     || 'guest').toLowerCase();
  const username  = state?.username || 'Guest';
  const method    = state?.method   || 'email';

  // Customize greeting based on method
  const greeting = method === 'ii'
    ? `Welcome via Internet Identity`
    : `Hi, ${username}${role !== 'guest' ? `'s` : ''}`;

  // Choose an avatar/icon:
  const profileIcon = method === 'ii'
    ? '🆔'
    : role === 'guest'
      ? '❓'
      : '👤';

  const handleMenu     = () => {};
  const handleSettings = () => navigate('/settings', { state });

  const Dashboard = {
    farmer: FarmerDashboard,
    buyer: BuyerDashboard,
    distributor: BuyerDashboard,
    guest: BuyerDashboard,
  }[role];

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting={greeting}
        profileIcon={profileIcon}
        onMenu={handleMenu}
        onSettings={handleSettings}
      />

      {/* If you want to show the username/principal under the greeting */}
      {method === 'ii' && (
        <div style={{ textAlign: 'center', color: 'white', marginBottom: 12 }}>
          Signed in as Principal: {username}
        </div>
      )}

      <Dashboard />

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
};

export default Home;
