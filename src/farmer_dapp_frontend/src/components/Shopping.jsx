// src/components/Shopping.jsx
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';
import { mockProducts } from '../data/mockProducts';
import { ThemeContext } from '../ThemeContext';

export default function Shopping() {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { darkMode }= useContext(ThemeContext);

  // 1) User info
  const role        = (state?.role   || 'guest').toLowerCase();
  const username    = state?.username|| 'Guest';
  const method      = state?.method  || 'email';
  const profileIcon = method==='ii'?'🆔': role==='guest'?'❓':'👤';

  // 2) LocalStorage key
  const STORAGE_KEY = 'catalog_products';

  // 3) Load persisted products (once)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); }
      catch { /* ignore parse errors */ }
    }
    // seed initial: add stock & seller fields
    return mockProducts.map((p) => ({
      ...p,
      stock: 10,         // default stock
      seller: 'Admin',   // default seller
    }));
  });

  // 4) When we arrive with newProd in router state, append it
  useEffect(() => {
    const { newProd } = state || {};
    if (newProd) {
      setProducts((prev) => {
        // avoid dup if id exists
        if (prev.some((p) => p.id === newProd.id)) return prev;
        const updated = [ 
          { 
            ...newProd, 
            stock: newProd.stock ?? 1, 
            seller: username 
          }, 
          ...prev 
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [state, username]);

  // 5) Persist whenever products changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // 6) Cart & address
  const initialCart    = state?.cart    || {};
  const initialAddress = state?.address|| 'Jakarta';
  const [cart, setCart]               = useState(initialCart);
  const [address, setAddress]         = useState(initialAddress);
  const [editingAddr, setEditingAddr] = useState(false);

  // 7) Search / Filter
  const [searchQuery, setSearchQuery]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount]       = useState(8);

  // 8) Compute filtered + visible
  const filtered = useMemo(
    () => products.filter((p) => {
      const catOK = selectedCategory==='All' || p.category===selectedCategory;
      const txtOK = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return catOK && txtOK;
    }),
    [products, selectedCategory, searchQuery]
  );
  const visible = filtered.slice(0, visibleCount);

  // 9) Handlers
  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id]||0)+1 }));
  const goToCheckout = () => navigate('/checkout', {
    state: { cart, address, role, username, method, products }
  });
  const removeProduct = (id) => {
    if (!window.confirm('Remove this product?')) return;
    setProducts((p) => p.filter((x) => x.id!==id));
  };
  const openChat = (productId) => {
    navigate(`/chat/${productId}`, {
      state: { role, username, method, productId, seller: products.find(p=>p.id===productId).seller }
    });
  };

  // 10) Sync address back from checkout
  useEffect(() => {
    if (state?.address) setAddress(state.address);
  }, [state]);

  const cartCount = Object.values(cart).reduce((sum, q) => sum+q, 0);

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Shop"
        profileIcon="🛒"
        onSettings={()=>navigate('/settings',{state})}
      />

      {/* subheader */}
      <div className="shop-subheader">
        {editingAddr
          ? <input
              className="addr-input"
              value={address}
              onChange={e=>setAddress(e.target.value)}
              onBlur={()=>setEditingAddr(false)}
              onKeyDown={e=>e.key==='Enter'&&setEditingAddr(false)}
              autoFocus
            />
          : <div
              className="delivery-address"
              onClick={()=>setEditingAddr(true)}
            >
              Deliver to: {address}
            </div>
        }
        <div className="cart-icon" onClick={goToCheckout}>
          🛒
          {cartCount>0 && (
            <span className="cart-count-badge">{cartCount}</span>
          )}
        </div>
      </div>

      {/* search & filter */}
      <div className="shop-search-bar">
        <select
          value={selectedCategory}
          onChange={e=>setSelectedCategory(e.target.value)}
        >
          {['All','Fruits','Vegetables','Grains'].map(c=>(
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search products…"
          value={searchQuery}
          onChange={e=>setSearchQuery(e.target.value)}
        />
      </div>

      {/* products grid */}
      <div className="products-grid">
        {visible.map((p) => (
          <div key={p.id} className={`product-card ${darkMode?'dark':'light'}`}>
            <img src={p.image} alt={p.name}/>
            <h4>{p.name}</h4>
            <p>{p.desc}</p>
            <p><strong>Rp. {p.price.toLocaleString()}</strong></p>
            <p>Stock: {p.stock}</p>
            <p>Seller: {p.seller}</p>

            <div className="card-actions">
              <button onClick={()=>addToCart(p.id)}>
                Add to Cart
              </button>

              {role==='farmer' && p.seller===username && (
                <button
                  className="remove-btn"
                  onClick={()=>removeProduct(p.id)}
                >
                  Remove
                </button>
              )}

              {role==='buyer' && (
                <button
                  className="chat-btn"
                  onClick={()=>openChat(p.id)}
                >
                  Chat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="show-all">
          <button onClick={()=>setVisibleCount(vc=>vc+8)}>
            Load More
          </button>
        </div>
      )}

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
