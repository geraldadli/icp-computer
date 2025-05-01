import React, { useState, useMemo, useContext } from "react";
import NavBar from "./NavBar";
import WidgetNav from "./WidgetNav";
import { mockProducts } from "../data/mockProducts";
import { ThemeContext } from "../ThemeContext"; // Make sure ThemeContext exists and is exported properly

const FarmerDashboard = () => {
  // State variables
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [cart, setCart] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Visible products for "Load More" feature
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Add product to cart
  const addToCart = (productId) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      setCart((prevCart) => [...prevCart, product]);
      alert(`${product.name} added to cart!`);
    }
  };

  // Load more products
  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className={`dashboard-content ${darkMode ? "dark" : "light"}`}>
      <WidgetNav />
      
      <div className="section">
        <h3>Income Analysis</h3>
        <div className="chart-placeholder">[Chart here]</div>
      </div>

      <div className="section">
        <h3>Check Price</h3>

        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
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
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className={`product-card ${darkMode ? "dark" : "light"}`}
            >
              <img src={product.image} alt={product.name} />
              <div>{product.name}</div>
              <div>{product.desc}</div>
              <div>⭐ {product.rating}</div>
              <div>Rp. {product.price.toLocaleString()}</div>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </div>
          ))}
        </div>

        {visibleProducts.length < filteredProducts.length && (
          <button onClick={loadMore}>Load More</button>
        )}
      </div>

      <div className="section">
        <h3>My Reward</h3>
        <div className="reward-placeholder">[Rewards]</div>
      </div>

      <div className="section">
        <h3>Program</h3>
        <div className="program-placeholder">[Program info]</div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
