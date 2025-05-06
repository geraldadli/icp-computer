// // src/components/BuyerDashboard.jsx
// import React from 'react';

// const BuyerDashboard = () => (
//   <div className="dashboard-content">
//     <div className="section">
//       <input
//         type="text"
//         placeholder="Search here..."
//         className="input-field"
//         style={{ borderRadius: '10px', padding: '10px', width: '95%' }}
//       />
//     </div>
//     <div className="section">
//       <h3>Order</h3>
//       <div className="order-placeholder">[Order widget]</div>
//     </div>
//     <div className="section">
//       <h3>Check Price</h3>
//       <div className="list-placeholder">[Price listing]</div>
//     </div>
//     <div className="section">
//       <h3>Spending Analysis</h3>
//       <div className="chart-placeholder">[Spending chart]</div>
//     </div>
//   </div>
// );

// export default BuyerDashboard;
import React, {useState, useEffect, useContext, useMemo} from "react";
import NavBar from "./NavBar";
import WidgetNav from "./WidgetNav";
import {useLocation} from "react-router-dom";

import {ThemeContext} from "../ThemeContext";
import actor from "../dfx/marketplace";
if (typeof global === "undefined") {
  window.global = window;
}
const BuyerDashboard = () => {
  // define the state variables
  const {state} = useLocation();
  const username = state?.username || "Guest";
  const method = state?.method || "email";
  const profileIcon = method === "ii" ? "🆔" : role === "guest" ? "❓" : "👤";
  const role = (state?.role || "guest").toLowerCase();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const {darkMode} = useContext(ThemeContext);
  // Fetch products from Motoko backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const tmp = await actor;

        const data = await tmp.viewProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filtered products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCart((prevCart) => [...prevCart, product]);
      alert(`${product.name} added to cart!`);
    }
  };

  const decodeImage = (bytes) => {
    if (!bytes || bytes.length === 0) return "";
    const binary = new Uint8Array(bytes).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    );
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  return (
    <div className={`dashboard-content ${darkMode ? "dark" : "light"}`}>
      <WidgetNav />

      <div className="section">
        <h3>Your Orders</h3>
        <div className="chart-placeholder">[Chart here]</div>
      </div>

      <div className="section">
        <h3>Check Price</h3>

        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
          </select>

          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div
          className="products-grid"
          style={{maxHeight: "400px", overflowY: "auto"}}>
          {visibleProducts.map((p) => (
            
              
            
            <div
              key={p.id}
              className={`product-card ${darkMode ? "dark" : "light"}`}>
              <img
                src={decodeImage(p.image)}
                alt={p.name}
                style={{width: "100%", height: "150px", objectFit: "cover"}}
              />
              <h5
                style={{
                  textAlign: "left",
                  marginBottom: "5px",
                  color: "green",
                }}>
                Rp. {p.price.toLocaleString()}

              </h5>

              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "0px",
                  marginTop: "0px",
                }}>
                {p.name}
              </h3>
              <p
                style={{
                  textAlign: "left",
                  marginTop: "5px",
                  marginBottom: "5px",
                  color: "#999999",
                }}>
                {p.description}
              </p>

              <small
                style={{
                  textAlign: "left",
                  marginBottom: "0px",
                  marginTop: "0px",
                  color: "#999911",
                }}>
                tersedia ({p.stock}) pcs
              </small>
              <hr></hr>
              <p
                style={{
                  textAlign: "left",
                  marginBottom: "0px",
                  marginTop: "0px",
                }}>
                Seller: {p.owner.toText()}
              </p>

              <div className="card-actions">
                
           
                {role === "farmer" && p.seller === username && (
                  
                  <button
                    className="remove-btn"
                    onClick={() => removeProduct(p.id)}>
                    Remove
                  </button>
                )}

                {role === "buyer" && (
                  <button className="chat-btn" onClick={() => openChat(p.id)}>
                    Chat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filteredProducts.length && (
          <button onClick={loadMore}>Load More</button>
        )}
      </div>
{/* 
      <div className="section">
        <h3>My Reward</h3>
        <div className="reward-placeholder">[Rewards]</div>
      </div>

      <div className="section">
        <h3>Program</h3>
        <div className="program-placeholder">[Program info]</div>
      </div> */}
    </div>
  );
};

export default BuyerDashboard;
