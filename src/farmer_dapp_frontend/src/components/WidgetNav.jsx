// src/components/WidgetNav.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WidgetNav = ({ profileIcon, role, username, method }) => {
  const nav = useNavigate();
  // include method in the state going forward
  const navState = { state: { role, username, method } };

  const items = [
    { key: 'home',     icon: '🏠', label: 'Home',    path: '/home' },
    { key: 'wallet',   icon: '💳', label: 'Wallet',  path: '/cash' },
    { key: 'shop',     icon: '🛒', label: 'Shop',    path: '/shop',  isCart: true },
    { key: 'mail',     icon: '🔔', label: 'Notification', path: '/mail' },
    { key: 'profile',  icon: profileIcon, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="widget-nav">
      {items.map((item) =>
        item.isCart ? (
          <React.Fragment key={item.key}>
            <div className="widget-spacer" />
            <button
              className="widget-button cart"
              onClick={() => nav(item.path, navState)}
            >
              {item.icon}
            </button>
            <div className="widget-spacer" />
          </React.Fragment>
        ) : (
          <button
            key={item.key}
            className="widget-button"
            onClick={() => nav(item.path, navState)}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        )
      )}
    </div>
  );
};

export default WidgetNav;
