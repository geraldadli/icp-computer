// src/components/NavBar.jsx
import React from 'react';

const NavBar = ({ onMenu, onSettings, greeting, profileIcon }) => (
  <div className="top-bar">
    <button className="hamburger" onClick={onMenu}>☰</button>

    <div className="greeting">{greeting}</div>

    {/* avatar now lives here, next to the greeting */}
    <div className="avatar">{profileIcon}</div>

    <button className="settings-icon" onClick={onSettings}>⚙️</button>
  </div>
);

export default NavBar;
