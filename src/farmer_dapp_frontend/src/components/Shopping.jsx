// src/components/Shopping.jsx
import React, {useState, useMemo, useEffect, useContext, act} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import NavBar from "./NavBar";
import WidgetNav from "./WidgetNav";
import {ThemeContext} from "../ThemeContext";
import actor from "../dfx/marketplace";

// Polyfill for global
if (typeof global === "undefined") {
  window.global = window;
}

function ImageViewer({imageData}) {
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (imageData && imageData.length > 0) {
      // Step 1: Convert [Nat8] to Uint8Array
      const byteArray = new Uint8Array(imageData);

      // Step 2: Create a Blob (guess MIME type or pass one like 'image/jpeg')
      const blob = new Blob([byteArray], {type: "image/png"});

      // Step 3: Create a local object URL
      const url = URL.createObjectURL(blob);
      setImageURL(url);

      // Step 4: Clean up on unmount
      return () => URL.revokeObjectURL(url);
    }
  }, [imageData]);

  if (!imageURL) return <p>Loading image...</p>;

  return <img src={imageURL} alt="Product" style={{maxWidth: "100%"}} />;
}

export default function Shopping() {
  const {state} = useLocation();
  const navigate = useNavigate();
  const {darkMode} = useContext(ThemeContext);

  // 1) User info
  const role = (state?.role || "guest").toLowerCase();
  const username = state?.username || "Guest";
  const method = state?.method || "email";
  const profileIcon = method === "ii" ? "🆔" : role === "guest" ? "❓" : "👤";

  // 2) LocalStorage key
  const STORAGE_KEY = "catalog_products";
  // 3) Load persisted products (once)
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const tmp = await actor;
        const productsFromActor = await tmp.viewProducts();
        setProducts(productsFromActor); // Set the products to state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // 4) When we arrive with newProd in router state, append it
  useEffect(() => {
    const {newProd} = state || {};
    if (newProd) {
      setProducts((prev) => {
        // avoid dup if id exists
        if (prev.some((p) => p.id === newProd.id)) return prev;
        const updated = [
          {
            ...newProd,
            stock: newProd.stock ?? 1,
            seller: username,
          },
          ...prev,
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [state, username]);

  // 5) Persist whenever products changes
  useEffect(() => {
    products.forEach((p) => {
      console.log(p.owner._arr);
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );
  }, [products]);

  // 6) Cart & address
  const initialCart = state?.cart || {};
  const initialAddress = state?.address || "Jakarta";
  const [cart, setCart] = useState(initialCart);
  const [address, setAddress] = useState(initialAddress);
  const [editingAddr, setEditingAddr] = useState(false);

  // 7) Search / Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);
  console.log(products);
  // 8) Compute filtered + visible
  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const catOK =
          selectedCategory === "All" || p.category === selectedCategory;
        const txtOK = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return catOK && txtOK;
      }),
    [products, selectedCategory, searchQuery]
  );
  const visible = filtered.slice(0, visibleCount);

  // 9) Handlers
  const addToCart = (p) => {
    console.log("DEBB: ", cart);
    setCart((prevCart) => {
      const updatedCart = {...prevCart};

      if (updatedCart[p.id]) {
        updatedCart[p.id] = {
          qty: updatedCart[p.id].qty + 1,
          product: p,
        };
      } else {
        updatedCart[p.id] = {
          qty: 1,
          product: p,
        };
      }

      return updatedCart;
    });
  };

  const goToCheckout = () =>
    navigate("/checkout", {
      state: {cart, address, role, username, method, products},
    });
  const removeProduct = (id) => {
    if (!window.confirm("Remove this product?")) return;
    setProducts((p) => p.filter((x) => x.id !== id));
  };
  const openChat = (productId) => {
    if (productId === null) {
      alert("error openchat");
      return;
    }
    navigate(`/chat/${productId}`, {
      state: {
        role,
        username,
        method,
        productId,
        seller: products.find((p) => p.id === productId).seller,
      },
    });
  };

  // 10) Sync address back from checkout
  useEffect(() => {
    if (state?.address) setAddress(state.address);
  }, [state]);

  const cartCount = Object.values(cart).reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Shop"
        profileIcon="🛒"
        onSettings={() => navigate("/settings", {state})}
      />

      {/* subheader */}
      <div className="shop-subheader">
        {editingAddr ? (
          <input
            className="addr-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setEditingAddr(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingAddr(false)}
            autoFocus
          />
        ) : (
          <div
            className="delivery-address"
            onClick={() => setEditingAddr(true)}>
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

      {/* search & filter */}
      <div className="shop-search-bar">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          {["All", "Fruits", "Vegetables", "Grains"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search products…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* products grid */}
      <div className="products-grid">
        {visible.map((p) => (
          <div
            key={p.id}
            className={`product-card ${darkMode ? "dark" : "light"}`}>
            <ImageViewer imageData={p.image} />
            <h5
              style={{textAlign: "left", marginBottom: "5px", color: "green"}}>
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
              seller: { p.seller === username ? (<b><i>You</i></b>) :  p.owner.toText()}
            </p>

            <div className="card-actions">
              { p.seller !== username && (
                <button onClick={() => addToCart(p)}>Add to Cart</button>
              )}

              {role === "farmer" && p.seller === username && (
                <button
                  className="remove-btn"
                  style={{backgroundColor: "red"}}
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

      {visibleCount < filtered.length && (
        <div className="show-all">
          <button onClick={() => setVisibleCount((vc) => vc + 8)}>
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
