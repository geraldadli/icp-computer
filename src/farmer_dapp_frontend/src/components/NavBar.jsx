// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { SidebarContext } from '../SidebarContext';
import Sidebar from './Sidebar';

const NavBar = ({ onSettings, greeting, profileIcon }) => {
  const { open, setOpen } = useContext(SidebarContext);

  return (
    <>
      {/* Sidebar lives here so it’s layered above NavBar but below page content */}
      <Sidebar />

      <div className="top-bar">
        <button className="hamburger" onClick={() => setOpen(true)}>
          ☰
        </button>

        <div className="greeting">{greeting}</div>

        <div className="avatar">{profileIcon}</div>

        <button className="settings-icon" onClick={onSettings}>
          ⚙️
        </button>
      </div>
    </>
  );
};

export default NavBar;
