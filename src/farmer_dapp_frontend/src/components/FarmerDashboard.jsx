// src/components/FarmerDashboard.jsx
import React from 'react';

const FarmerDashboard = () => (
  <div className="dashboard-content">
    <div className="section">
      <h3>Income Analysis</h3>
      <div className="chart-placeholder">[Chart here]</div>
    </div>
    <div className="section">
      <h3>Check Price</h3>
      <div className="list-placeholder">[Price listing]</div>
    </div>
    <div className="section">
      <h3>My Reward</h3>
      <div className="reward-placeholder">[Rewards]</div>
    </div>
    <div className="section">
      <h3>Program</h3>
      <div className="program-placeholder">[Program info]</div>
    </div>
  </div>
);

export default FarmerDashboard;
