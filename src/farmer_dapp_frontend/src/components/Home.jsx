// src/components/Home.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const { state } = useLocation();
  const role = (state?.role || 'Guest').charAt(0).toUpperCase()
    + (state?.role || 'Guest').slice(1);

  return (
    <div className="container">
      <h1>Welcome to the {role} Home Page</h1>
      {/* … your actual dashboard/content */}
    </div>
  );
};

export default Home;
