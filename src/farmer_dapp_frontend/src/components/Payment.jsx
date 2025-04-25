// src/components/Payment.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

const Payment = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const role      = state?.role || 'guest';
  const username  = state?.username || 'Guest';
  const profileIcon = role==='guest'?'❓':'👤';

  return (
    <div className="home-container">
      <div className="overlay" />
      <NavBar greeting="Payment" profileIcon={profileIcon} onSettings={()=>navigate('/settings',{state})} />
      <div className="dashboard-content">
        <p>Payment options coming soon…</p>
      </div>
      <WidgetNav profileIcon={profileIcon} role={role} username={username} />
    </div>
  );
};
export default Payment;
