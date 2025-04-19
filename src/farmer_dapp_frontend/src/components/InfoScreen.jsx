import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const InfoScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="overlay"></div>
      <h2>Your trusted partner</h2>
      <p>
        Empowering agriculture through <br />
        technology and transparency.
      </p>
      <button onClick={() => navigate('/roles')}>Next</button>
    </div>
  );
};

export default InfoScreen;
