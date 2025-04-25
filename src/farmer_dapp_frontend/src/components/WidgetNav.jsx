import React from 'react';
import { useNavigate } from 'react-router-dom';

const WidgetNav = ({ profileIcon, role, username }) => {
  const nav = useNavigate();
  const state = { state: { role, username } };

  return (
    <div className="widget-nav">
      <button onClick={() => nav('/home', state)} className="widget-button">
        <span>🏠</span>
        <small>Home</small>
      </button>

      <button onClick={() => nav('/cash', state)} className="widget-button">
        <span>💳</span>
        <small>Wallet</small>
      </button>

      <button onClick={() => nav('/shop', state)} className="widget-button cart">
        <span>🛒</span>
      </button>

      <button onClick={() => nav('/mail', state)} className="widget-button">
        <span>✉️</span>
        <small>Notification</small>
      </button>

      <button onClick={() => nav('/profile', state)} className="widget-button">
        <span>{profileIcon}</span>
        <small>Profile</small>
      </button>
    </div>
  );
};

export default WidgetNav;
