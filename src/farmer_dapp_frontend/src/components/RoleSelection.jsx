import React from 'react';

const RoleSelection = () => {
  const roles = [
    { name: 'Farmer', icon: '👨‍🌾' },
    { name: 'Buyer', icon: '🧑‍💼' },
    { name: 'Distributor', icon: '🏭' },
    { name: 'Guest', icon: '🚶‍♂️' },
  ];

  return (
    <div className="welcome-container">
      <div className="overlay"></div>
      <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        Select Your <span className="text-highlight">Role</span>
      </h2>
      <div className="role-grid">
        {roles.map((role) => (
          <div key={role.name} className="role-card">
            <div style={{ fontSize: '8rem' }}>{role.icon}</div>
            <p>{role.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
