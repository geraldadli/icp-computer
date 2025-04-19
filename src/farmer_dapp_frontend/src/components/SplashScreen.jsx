import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="logo" />
      <h2 className="text-highlight-yellow">Empowering Farmer</h2>
      <h2 className="text-highlight-white">Growing Features</h2>
      <h5 className="text-highlight-green">Farmer Chain</h5>
    </div>
  );
};

export default SplashScreen;
