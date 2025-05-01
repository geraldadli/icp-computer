// src/components/WidgetNav.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdHome,IoIosNotifications } from 'react-icons/io';
import { FaWallet } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
const WidgetNav = ({ profileIcon, role, username, method }) => {
  const nav = useNavigate();
  const navState = { state: { role, username, method } };

  const items = [
    { key: 'home', icon: <IoMdHome />, label: 'Home', path: '/home' },
    { key: 'wallet', icon: <FaWallet/>, label: 'Wallet', path: '/cash' },
    { key: 'shop', icon: '🛒', label: 'Shop', path: '/shop', isCart: true },
    { key: 'mail', icon: <IoIosNotifications/>, label: 'Notification', path: '/mail' },
    { key: 'profile', icon: <CgProfile/> , label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="widget-nav">
      {items.map((item) => {
        const button = (
          <button
            key={item.key}
            className={`widget-button${item.isCart ? ' cart' : ''}`}
            onClick={() => nav(item.path, navState)}
          >
            <span>{item.icon}</span>
            {!item.isCart && <small>{item.label}</small>}
          </button>
        );

        return item.isCart ? (
          <React.Fragment key={item.key}>
            <div className="widget-spacer" />
            {button}
            <div className="widget-spacer" />
          </React.Fragment>
        ) : (
          button
        );
      })}
    </div>
  );
};

export default WidgetNav;
