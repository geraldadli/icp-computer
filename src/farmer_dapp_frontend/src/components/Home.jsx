// src/components/Home.jsx
import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import NavBar from "./NavBar";
import WidgetNav from "./WidgetNav";
import FarmerDashboard from "./FarmerDashboard";
import BuyerDashboard from "./BuyerDashboard";

export default function Home() {
  const {state} = useLocation();
  const navigate = useNavigate();

  // User context
  const role = (state?.role || "guest").toLowerCase();
  const username = state?.username || "Guest";
  const method = state?.method || "email";

  // Customize greeting based on method
  // const greeting = method === 'ii'
  //   ? `Welcome via Internet Identity`
  //   : `Hi, ${username}${role !== 'guest' ? `'s` : ''}`;
  const greeting = "";
  // Choose an avatar/icon:
  const profileIcon = method === "ii" ? "🆔" : role === "guest" ? "❓" : "👤";

  const handleMenu = () => {};
  const handleSettings = () => navigate("/settings", {state});

  // Which dashboard to render
  const Dashboard = {
    farmer: FarmerDashboard,
    buyer: BuyerDashboard,
    distributor: BuyerDashboard,
    guest: BuyerDashboard,
  }[role];

  // SELL CTA for farmers
  const goSell = () => navigate("/sell", {state});

  // ——— Farmer’s own listings logic ———
  const STORAGE_KEY = "catalog_products";

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
  const myProducts = catalog.filter((p) => p.seller === username);

  // Edit handler
  const handleEdit = (prod) =>
    navigate("/sell", {
      state: {...state, editProd: prod},
    });

  // Delete handler
  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    const updated = catalog.filter((p) => p.id !== id);
    setCatalog(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };
  const decodeImage = (data) => {
    if (!data || Object.keys(data).length === 0) return "";
  
    // Convert the object into a Uint8Array
    const byteArray = new Uint8Array(Object.values(data));
  
    // Convert binary data to base64 string
    const binary = String.fromCharCode.apply(null, byteArray);
    return `data:image/jpeg;base64,${btoa(binary)}`;
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

      {/* If you want to show the username/principal under the greeting
      {method === 'ii' && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: 12
        }}>
          Signed in as Principal: {username}
        </div>
      )} */}

      {role === "farmer" && (
        <div
          className="sell-cta-wrapper"
          style={{justifyContent: "right", display: "flex"}}>
          <button
            className="sell-cta-btn"
            style={{background: "blue", color: "white"}}
            onClick={goSell}>
            Sell Products
          </button>
        </div>
      )}

      {role === "farmer" && (
        <div className="my-products-section">
          <h3
            className="t-text"
            style={{marginLeft: "15px", marginTop: "5px", marginBottom: "5px"}}>
            Your Listings
          </h3>
          {myProducts.length === 0 ? (
            <p
              className="empty-label"
              style={{marginTop: "1px", marginLeft: "15px", textAlign: "left"}}>
              You have no active products. Click “Sell Products” to add one.
            </p>
          ) : (
            <div className="products-grid">
              {myProducts.map((p) => (
                <div key={p.id} className="product-card light">
                  <img
                    src={decodeImage(p.image)}
                    alt={p.name}
                    style={{width: "100%", height: "150px", objectFit: "cover"}}
                  />
                  <h4 className="card-title">{p.name}</h4>
                  <p className="card-price">Rp. {p.price.toLocaleString()}</p>
                  <p className="card-stock">Stock: {p.stock}</p>

                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => handleEdit(p)}>
                      Edit
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleDelete(p.id)}>
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
