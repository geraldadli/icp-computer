// src/components/WidgetNav.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WidgetNav = ({ profileIcon, role, username }) => {
  const nav = useNavigate();

  return (
    <div className="widget-nav">
      <button
        className="widget-button"
        onClick={() =>
          nav('/home', { state: { role, username } })
        }
      >
        <span>🏠</span>
        <small>Home</small>
      </button>
      <button
        className="widget-button"
        onClick={() =>
          nav('/cash', { state: { role, username } })
        }
      >
        <span>💰</span>
        <small>Cash</small>
      </button>
      <button
        className="widget-button"
        onClick={() =>
          nav('/mail', { state: { role, username } })
        }
      >
        <span>✉️</span>
        <small>Mail</small>
      </button>
      <button
        className="widget-button"
        onClick={() =>
          nav('/profile', { state: { role, username } })
        }
      >
        <span>{profileIcon}</span>
        <small>Profile</small>
      </button>
    </div>
  );
};

export default WidgetNav;
