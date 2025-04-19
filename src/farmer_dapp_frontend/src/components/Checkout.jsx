// src/components/Checkout.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';
import { mockProducts } from '../data/mockProducts';

export default function Checkout() {
  const { state }   = useLocation();
  const navigate    = useNavigate();

  // Pull cart & address from location.state
  const cart    = state?.cart    || {};
  const address = state?.address || '';

  // Build line‑items
  const items = Object.entries(cart).map(([id, qty]) => {
    const prod = mockProducts.find((p) => p.id === +id);
    return { ...prod, qty };
  });
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Payment method
  const [method, setMethod]   = useState('BCA');
  const [icPayOpt, setIcPayOpt] = useState('ckBTC');

  const handlePlaceOrder = () => {
    alert(
      `Order placed!\n\n` +
      items.map((i) => `${i.name} ×${i.qty}`).join('\n') +
      `\n\nTotal: Rp. ${subtotal.toLocaleString()}` +
      `\nPayment: ${method}${method==='IC Pay'? ` (${icPayOpt})`:''}`
    );

    // Navigate back to Shopping with an **empty** cart
    navigate('/shop', {
      state: {
        cart: {},
        address
      }
    });
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Checkout"
        profileIcon="👤"
        onSettings={() => navigate('/settings', { state })}
      />

      <div className="dashboard-content">
        {/* Address */}
        <div className="section">
          <h3>Shipping to:</h3>
          <p>{address}</p>
        </div>

        {/* Order Summary */}
        <div className="section">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div key={i.id} className="checkout-item">
              <span>{i.name} ×{i.qty}</span>
              <span>Rp. {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="checkout-item total">
            <strong>Total</strong>
            <strong>Rp. {subtotal.toLocaleString()}</strong>
          </div>
        </div>

        {/* Payment */}
        <div className="section">
          <h3>Payment Method</h3>
          {['BCA','Gopay','IC Pay'].map((m) => (
            <label key={m} className="payment-option">
              <input
                type="radio"
                name="pay"
                value={m}
                checked={method === m}
                onChange={() => setMethod(m)}
              />
              {m}
            </label>
          ))}
          {method === 'IC Pay' && (
            <select
              value={icPayOpt}
              onChange={(e) => setIcPayOpt(e.target.value)}
            >
              {['ckBTC','ckETH','ckICP'].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>

      <WidgetNav
        profileIcon="👤"
        role={state?.role || 'guest'}
        username={state?.username || 'Guest'}
      />
    </div>
  );
}
