import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();
  const roles = [
    { name: 'Farmer', icon: '👨‍🌾' },
    { name: 'Buyer', icon: '🧑‍💼' },
   // { name: 'Distributor', icon: '🏭' },
    // { name: 'Guest', icon: '🚶‍♂️' },
  ];

  const handleClick = (role) => {
    if (role === 'Guest') {
      navigate('/home', { state: { role: 'Guest' } });
    } else {
      navigate(`/${role.toLowerCase()}/register`);
    }
  };

  return (
    <div className="welcome-container">
      <div className="overlay"></div>
      <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        Select Your <span className="text-highlight">Role</span>
      </h2>
      <div className="role-grid">
        {roles.map((r) => (
          <div
            key={r.name}
            className="role-card"
            onClick={() => handleClick(r.name)}
          >
            <div style={{ fontSize: '8rem' }}>{r.icon}</div>
            <p>{r.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
