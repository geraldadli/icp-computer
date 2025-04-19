import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="overlay"></div>
      <h2>Explore our vibrant marketplace</h2>
      <p>
        where farmers and dealers converge <br />
        to exchange a diverse array of <br />
        agricultural products.
      </p>
      <button onClick={() => navigate('/info')}>Next</button>
    </div>
  );
};

export default WelcomeScreen;
