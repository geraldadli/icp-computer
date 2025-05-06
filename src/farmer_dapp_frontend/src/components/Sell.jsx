// src/components/Sell.jsx
import React, { useState, useEffect, use } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';
import actor from '../dfx/marketplace'; 
const decodeImage = (data) => {
  if (!data || Object.keys(data).length === 0) return "";

  // Convert the object into a Uint8Array
  const byteArray = new Uint8Array(Object.values(data));

  // Convert binary data to base64 string
  const binary = String.fromCharCode.apply(null, byteArray);
  return `data:image/jpeg;base64,${btoa(binary)}`;
};



export default function Sell() {
  const { state }    = useLocation();
  const navigate     = useNavigate();

  // User & mode info
  const role       = (state?.role     || 'guest').toLowerCase();
  const username   = state?.username || 'Guest';
  const method     = state?.method   || 'email';
  const profileIcon= method==='ii' ? '🆔' : role==='guest' ? '❓' : '👤';

  // If not farmer, bounce home
  if (role !== 'farmer') {
    navigate('/home', { replace: true, state });
    return null;
  }

  // storage key
  const STORAGE_KEY = 'catalog_products';

  // Are we editing?
  const editProd = state?.editProd || null;

  // Form state (prefill if editing)
  const [title,    setTitle]    = useState(editProd?.name        || '');
  const [desc,     setDesc]     = useState(editProd?.description        || '');
  const [category, setCategory] = useState(editProd?.category    || 'Fruits');
  const [price,    setPrice]    = useState(editProd?.price       || '');
  const [stock,    setStock]    = useState(editProd?.stock       || 1);
  const [preview,  setPreview]  = useState(editProd?.image       || null);
  const [fileErr,  setFileErr]  = useState('');

  // Read existing catalog once
  const readCatalog = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    try { return raw ? JSON.parse(raw) : []; }
    catch { return []; }
  };

  // Write catalog back
  const writeCatalog = (arr) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };

  // Image preview handler
  const onImageChange = (e) => {
    setFileErr('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return setFileErr('Please select an image');
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Back to home
  const goBack = () => navigate('/home', { state });

  // On submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!title.trim() || !desc.trim() || !preview || !price || stock < 1) {
      return alert('Please fill every field correctly.');
    }
    const catalog = readCatalog();

    if (editProd) {
      // EDIT existing
      const updated = catalog.map((p) =>
        p.id === editProd.id
          ? {
              ...p,
              name:     title.trim(),
              desc:     desc.trim(),
              category,
              price:    parseFloat(price),
              stock:    parseInt(stock, 10),
              image:    preview,
            }
          : p
      );
      writeCatalog(updated);
    } else {
      // NEW product
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const nat8Array = Array.from(uint8Array); // converts to [Nat8]
      const newProd = {
        id:       Date.now(),
        name:     title.trim(),
        desc:     desc.trim(),
        category,
        price:    parseFloat(price),
        stock:    parseInt(stock, 10),
        seller:   username,
        image:    preview,
        rating:   0,
      };
      actor.then((actor) => {
        
        const result = actor.addProduct(
          title.trim(),
          category,
          desc.trim(),
          BigInt(price),
          nat8Array,
          BigInt(parseInt(stock, 10)),
          username
        ).then(() =>   alert('Product created with ID:', result));
      
      });
    
  
      writeCatalog([newProd, ...catalog]);
    }

    // After Save, go back to Home
  };

  return (
    <div className="sell-container">
      <NavBar
        greeting={editProd ? 'Edit Product' : 'Sell Product'}
        profileIcon={profileIcon}
        onMenu={() => {}}
        onSettings={() => navigate('/settings', { state })}
      />

      <button className="back-btn" onClick={goBack}>← Back</button>

      <form className="sell-form" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product title"
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label>Image</label>
          <input
            required={!editProd}
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
          {fileErr && <small className="error-text">{fileErr}</small>}
          {preview && (
            <div className="img-preview-wrapper">
              <img src={decodeImage(preview)} alt="Preview" className="img-preview" />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Fruits</option>
            <option>Vegetables</option>
            <option>Grains</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price (Rp.)</label>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Stock */}
        <div className="form-group">
          <label>Stock</label>
          <input
            required
            type="number"
            min="1"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <button type="submit" className="sell-btn">
          {editProd ? 'Save Changes' : 'Put on Shelf'}
        </button>
      </form>

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
}
