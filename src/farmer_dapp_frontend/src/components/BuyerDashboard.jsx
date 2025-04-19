// src/components/BuyerDashboard.jsx
import React from 'react';

const BuyerDashboard = () => (
  <div className="dashboard-content">
    <div className="section">
      <input
        type="text"
        placeholder="Search here..."
        className="input-field"
        style={{ borderRadius: '10px', padding: '10px', width: '100%' }}
      />
    </div>
    <div className="section">
      <h3>Order</h3>
      <div className="order-placeholder">[Order widget]</div>
    </div>
    <div className="section">
      <h3>Check Price</h3>
      <div className="list-placeholder">[Price listing]</div>
    </div>
    <div className="section">
      <h3>Spending Analysis</h3>
      <div className="chart-placeholder">[Spending chart]</div>
    </div>
  </div>
);

export default BuyerDashboard;
