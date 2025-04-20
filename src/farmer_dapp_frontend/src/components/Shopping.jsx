// src/components/Shopping.jsx
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';
import { mockProducts } from '../data/mockProducts';
import { ThemeContext } from '../ThemeContext'; // adjust path if needed

export default function Shopping() {
  const { state }         = useLocation();
  const navigate          = useNavigate();

  // Pull initial cart & address from location.state (if coming back from checkout)
  const initialCart       = state?.cart    || {};
  const initialAddress    = state?.address || 'Jakarta';

  const role      = (state?.role     || 'guest').toLowerCase();
  const username  = state?.username || 'Guest';
  const method   = state?.method   || 'email';
  const profileIcon = method === 'ii'
  ? '🆔'
  : role === 'guest'
    ? '❓'
    : '👤';

  const { darkMode } = useContext(ThemeContext);

  // Local component state
  const [cart, setCart]               = useState(initialCart);
  const [address, setAddress]         = useState(initialAddress);
  const [editingAddr, setEditingAddr] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(5);

  // Compute the badge count
  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  // Filter products by category & search
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      const catOK  = selectedCategory === 'All' || p.category === selectedCategory;
      const txtOK  = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return catOK && txtOK;
    });
  }, [searchQuery, selectedCategory]);

  // Slice for “Load More”
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Handlers
  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };

  const goToCheckout = () => {
    navigate('/checkout', {
      state: {
        cart,
        address,
        role,
        username,
        method,
      },
    });    
  };

  // Keep address in sync with state on back‑navigation
  useEffect(() => {
    if (state?.address) {
      setAddress(state.address);
    }
  }, [state]);

  return (
    <div className="home-container">
      <div className="overlay" />

      {/* NavBar for burger & settings */}
      <NavBar
        greeting="Shop"
        profileIcon="🛒"
        onSettings={() => navigate('/settings', { state })}
      />

      {/* Subheader: editable address + cart icon */}
      <div className="shop-subheader">
        {editingAddr ? (
          <input
            className="addr-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setEditingAddr(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingAddr(false)}
            autoFocus
          />
        ) : (
          <div
            className="delivery-address"
            onClick={() => setEditingAddr(true)}
            title="Click to edit"
          >
            Deliver to: {address}
          </div>
        )}

        <div className="cart-icon" onClick={goToCheckout}>
          🛒
          {cartCount > 0 && (
            <span className="cart-count-badge">{cartCount}</span>
          )}
        </div>
      </div>

      {/* Search + Category */}
      <div className="shop-search-bar">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {['All','Fruits','Vegetables','Grains'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search products…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories Bar */}
      <div className="categories-bar">
        {['All','Fruits','Vegetables','Grains'].map((c) => (
          <span
            key={c}
            className={`category-item ${selectedCategory===c?'active':''}`}
            onClick={() => setSelectedCategory(c)}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {visibleProducts.map((p) => (
            <div
            key={p.id}
            className={`product-card ${darkMode ? 'dark' : 'light'}`}
            >
            <img src={p.image} alt={p.name} />
            <div>{p.name}</div>
            <div>{p.desc}</div>

            <div>⭐ {p.rating}</div>
            <div>Rp. {p.price.toLocaleString()}</div>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filteredProducts.length && (
        <div className="show-all">
          <button onClick={() => setVisibleCount(visibleCount + 5)}>
            Load More
          </button>
        </div>
      )}

      {/* Bottom Widget Nav */}
      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
