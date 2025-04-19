// src/components/Home.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard  from './BuyerDashboard';

const Home = () => {
  const { state } = useLocation();
  const navigate    = useNavigate();

  // always lowercase for the lookup
  const role        = (state?.role || 'guest').toLowerCase();
  // now pulled from state
  const username    = state?.username || 'Guest';

  // Proper role label (e.g. “Farmer” → “Farmer’s”)
  // const roleLabel   = role.charAt(0).toUpperCase() + role.slice(1) + `'s`;

  // New greeting: no more “Guest” for non‑guests
  const greeting    = `Hi, ${username}!`;

  const profileIcon = role === 'guest' ? '❓' : '👤';

  const handleMenu     = () => { /* … */ };
  const handleSettings = () => navigate('/settings');

  // pick which dashboard to show
  const Dashboard = {
    farmer: FarmerDashboard,
    buyer: BuyerDashboard,
    distributor: BuyerDashboard,
    guest: BuyerDashboard,
  }[role];

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* now passes profileIcon into NavBar */}
      <NavBar
        greeting={greeting}
        profileIcon={profileIcon}
        onMenu={handleMenu}
        onSettings={handleSettings}
      />

      <Dashboard />

     <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
    />
    </div>
  );
};

export default Home;
