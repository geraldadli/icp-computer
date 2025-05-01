import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import WidgetNav from './WidgetNav';
import { mockProducts } from '../data/mockProducts';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Auth + user info
  const role     = (state?.role     || 'guest').toLowerCase();
  const username = state?.username || 'Guest';
  const method   = state?.method   || 'email';
  const profileIcon = method === 'ii' ? '🆔' : '👤';

  // Cart & address
  const cart    = state?.cart    || {};
  const address = state?.address || 'No address set';

  // Build line-items
    // Use passed products or fallback to mockProducts
    const allProducts = state?.products || mockProducts;
    const items = Object.entries(cart).map(([id, qty]) => {
    const prod = allProducts.find((p) => p.id === +id);
    return { ...prod, qty };
  });
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Rename this to avoid conflict with login method
  const [paymentMethod, setPaymentMethod] = useState('BCA');
  const [icPayOpt, setIcPayOpt] = useState('ckBTC');

  const handlePlaceOrder = () => {
    alert(
      `Order placed!\n\n` +
      items.map((i) => `${i.name} ×${i.qty}`).join('\n') +
      `\n\nTotal: Rp. ${subtotal.toLocaleString()}` +
      `\nPayment: ${paymentMethod}${paymentMethod === 'IC Pay' ? ` (${icPayOpt})` : ''}`
    );

    // Reset cart and return to shop
    navigate('/shop', {
      state: {
        cart: {},
        address,
        role,
        username,
        method,
      },
    });
  };

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Checkout"
        profileIcon={profileIcon}
        onSettings={() => navigate('/settings', { state })}
      />

      <div className="dashboard-content">
        {/* Address Section */}
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

        {/* Payment Method */}
        <div className="section">
          <h3>Payment Method</h3>
          {['BCA', 'Gopay', 'IC Pay'].map((m) => (
            <label key={m} className="payment-option">
              <input
                type="radio"
                name="pay"
                value={m}
                checked={paymentMethod === m}
                onChange={() => setPaymentMethod(m)}
              />
              {m}
            </label>
          ))}
          {paymentMethod === 'IC Pay' && (
            <select
              value={icPayOpt}
              onChange={(e) => setIcPayOpt(e.target.value)}
            >
              {['ckBTC', 'ckETH', 'ckICP'].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>

      {/* Fixed WidgetNav with proper context */}
      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
