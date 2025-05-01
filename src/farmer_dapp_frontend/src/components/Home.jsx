// src/components/Home.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar           from './NavBar';
import WidgetNav        from './WidgetNav';
import FarmerDashboard  from './FarmerDashboard';
import BuyerDashboard   from './BuyerDashboard';

export default function Home() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  // User context
  const role       = (state?.role     || 'guest').toLowerCase();
  const username   = state?.username || 'Guest';
  const method     = state?.method   || 'email';

  const greeting = method === 'ii'
    ? `Welcome via Internet Identity`
    : `Hi, ${username}${role !== 'guest' ? `'s` : ''}`;

  const profileIcon = method === 'ii'
    ? '🆔'
    : role === 'guest'
      ? '❓'
      : '👤';

  const handleMenu   = () => {};
  const handleSettings = () =>
    navigate('/settings', { state });

  // Which dashboard to render
  const Dashboard = {
    farmer:      FarmerDashboard,
    buyer:       BuyerDashboard,
    distributor: BuyerDashboard,
    guest:       BuyerDashboard,
  }[role];

  // SELL CTA for farmers
  const goSell = () =>
    navigate('/sell', { state });

  // ——— Farmer’s own listings logic ———
  const STORAGE_KEY = 'catalog_products';

  // Load once from localStorage
  const [catalog, setCatalog] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Filter out only this farmer’s items
  const myProducts = catalog.filter(p => p.seller === username);

  // Edit handler
  const handleEdit = (prod) =>
    navigate('/sell', {
      state: { ...state, editProd: prod }
    });

  // Delete handler
  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    const updated = catalog.filter(p => p.id !== id);
    setCatalog(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting={greeting}
        profileIcon={profileIcon}
        onMenu={handleMenu}
        onSettings={handleSettings}
      />

      {method === 'ii' && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: 12
        }}>
          Signed in as Principal: {username}
        </div>
      )}

      {role === 'farmer' && (
        <div className="sell-cta-wrapper">
          <button className="sell-cta-btn" onClick={goSell}>
            Sell Products
          </button>
        </div>
      )}

      

      {role === 'farmer' && (
        <div className="my-products-section">
          <h3>Your Listings</h3>

          {myProducts.length === 0 ? (
            <p className="empty-label">
              You have no active products. Click “Sell Products” to add one.
            </p>
          ) : (
            <div className="products-grid">
              {myProducts.map((p) => (
                <div key={p.id}
                     className="product-card light">
                  <img src={p.image}
                       alt={p.name}
                       className="card-img" />
                  <h4 className="card-title">{p.name}</h4>
                  <p className="card-price">
                    Rp. {p.price.toLocaleString()}
                  </p>
                  <p className="card-stock">
                    Stock: {p.stock}
                  </p>

                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Dashboard />

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
