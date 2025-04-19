// src/components/Sidebar.jsx
import React, { useContext } from 'react';
import { SidebarContext } from '../SidebarContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { open, setOpen } = useContext(SidebarContext);
  const { state }         = useLocation();
  const role              = state?.role || 'guest';
  const username          = state?.username || 'Guest';

  const close = () => setOpen(false);
  const linkState = { state: { role, username } };

  return (
    <>
      <div className={`sidebar ${open ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/profile" {...linkState} onClick={close}>Profile</Link>
          </li>
          <li>
            <Link to="/forum" {...linkState} onClick={close}>Forum</Link>
          </li>
          <li>
            <Link to="/payment" {...linkState} onClick={close}>Payment</Link>
          </li>
          <li>
            <Link to="/settings" {...linkState} onClick={close}>Setting</Link>
          </li>
          <li>
            <Link to="/help" {...linkState} onClick={close}>Help</Link>
          </li>
        </ul>
      </div>

      {/* only show backdrop when open */}
      {open && <div className="sidebar-backdrop" onClick={close} />}
    </>
  );
};

export default Sidebar;
