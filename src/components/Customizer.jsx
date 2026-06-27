import React, { useRef } from 'react';
import { Upload, ShoppingCart, Type, Palette, Sparkles } from 'lucide-react';

export default function Customizer({
  activeProduct,
  setActiveProduct,
  designColor,
  setDesignColor,
  designImage,
  setDesignImage,
  designText,
  setDesignText,
  activeShape,
  setActiveShape,
  onAddToCart,
  viewerRef, // Ref passed to capture R3F drag events specifically inside the preview panel
}) {
  const fileInputRef = useRef(null);

  const products = [
    { id: 'mug', label: 'Ceramic Mug', price: 269, desc: 'Premium white/black gloss' },
    { id: 'keychain', label: 'Metal Keychain', price: 200, desc: 'Engraved shapes' },
    { id: 'tshirt', label: 'Custom Tshirt', price: 600, desc: '100% combed cotton' },
    { id: 'magnet', label: 'Fridge Magnet', price: 150, desc: 'Flexible printable sheet' },
  ];

  const colors = [
    { hex: '#ffffff', name: 'Pearl White' },
    { hex: '#111111', name: 'Obsidian Black' },
    { hex: '#d32f2f', name: 'Crimson Red' },
    { hex: '#1976d2', name: 'Cobalt Blue' },
    { hex: '#388e3c', name: 'Forest Green' },
    { hex: '#f50057', name: 'Hot Pink' },
  ];

  const shapes = [
    { id: 'star', label: 'Star Shape' },
    { id: 'heart', label: 'Heart Shape' },
    { id: 'oval', label: 'Oval Shape' },
    { id: 'diamond', label: 'Diamond Shape' },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDesignImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentProductInfo = products.find(p => p.id === activeProduct);

  const handleAddToCartClick = () => {
    // Generate variant label
    let variant = '';
    if (activeProduct === 'keychain') {
      variant = `${activeShape.toUpperCase()} Pendant`;
    } else if (activeProduct === 'mug') {
      variant = designColor === '#111111' ? 'Black Mug (330ml)' : 'White Mug (330ml)';
    } else {
      variant = 'Standard Custom';
    }

    onAddToCart({
      id: `${activeProduct}-${Date.now()}`,
      productType: activeProduct,
      title: currentProductInfo.label,
      variant: variant,
      price: currentProductInfo.price,
      color: colors.find(c => c.hex === designColor)?.name || 'Custom Color',
      colorHex: designColor,
      text: designText,
      image: designImage,
      shape: activeProduct === 'keychain' ? activeShape : null,
      qty: 1,
    });
  };

  return (
    <section className="section" id="customizer">
      <div className="customizer-layout">
        {/* Left Interactive 3D Viewer Placement */}
        <div className="customizer-viewer-panel glass-panel" ref={viewerRef}>
          <div className="customizer-watermark">
            <Sparkles size={14} className="neon-text" style={{ color: '#00f2fe' }} />
            <span>Interactive 3D Studio (Drag to Spin)</span>
          </div>
        </div>

        {/* Right Controls Panel */}
        <div className="customizer-controls glass-panel">
          <h2>Create Your Masterpiece</h2>
          <p>Tweak colors, add typography, upload illustrations, and preview your item instantly.</p>

          {/* Product Type Selector */}
          <div className="control-group">
            <span className="control-label">1. Choose Product</span>
            <div className="product-selector-grid">
              {products.map((p) => (
                <button
                  key={p.id}
                  className={`selector-btn ${activeProduct === p.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveProduct(p.id);
                    // Set default colors matching products
                    if (p.id === 'mug') setDesignColor('#ffffff');
                    if (p.id === 'tshirt') setDesignColor('#ffffff');
                    if (p.id === 'keychain') setDesignColor('#ffffff');
                    if (p.id === 'magnet') setDesignColor('#ffffff');
                  }}
                >
                  {p.label.split(' ')[1]}
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>₹{p.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Palette size={16} className="neon-text" style={{ color: '#7000ff' }} />
              <span className="control-label" style={{ marginBottom: 0 }}>2. Product Color</span>
            </div>
            <div className="color-picker-flex">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  className={`color-dot ${designColor === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setDesignColor(c.hex)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Keychain Shapes (Conditional rendering) */}
          {activeProduct === 'keychain' && (
            <div className="control-group">
              <span className="control-label">3. Keychain Ring Pendant Shape</span>
              <div className="shape-selector-grid">
                {shapes.map((s) => (
                  <button
                    key={s.id}
                    className={`shape-btn ${activeShape === s.id ? 'active' : ''}`}
                    onClick={() => setActiveShape(s.id)}
                  >
                    {s.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload box */}
          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Upload size={16} className="neon-text" style={{ color: '#00f2fe' }} />
              <span className="control-label" style={{ marginBottom: 0 }}>3. Upload Artwork / Photo</span>
            </div>
            <div className="image-upload-box" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageUpload}
              />
              {designImage ? (
                <>
                  <img src={designImage} alt="Preview" className="image-upload-preview" />
                  <span style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Replace Photo</span>
                </>
              ) : (
                <>
                  <Upload size={24} style={{ color: '#9ca3af' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Select design image</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Supports PNG, JPG, JPEG</span>
                </>
              )}
            </div>
          </div>

          {/* Slogan Text Input */}
          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Type size={16} className="neon-text" style={{ color: '#ff007a' }} />
              <span className="control-label" style={{ marginBottom: 0 }}>4. Add Custom Text / Name</span>
            </div>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Happy Birthday, Best Boss, Logo text"
              value={designText}
              onChange={(e) => setDesignText(e.target.value)}
            />
          </div>

          {/* Add to Cart Button */}
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '10px' }}
            onClick={handleAddToCartClick}
          >
            <ShoppingCart size={18} /> Add Design to Cart (₹{currentProductInfo.price})
          </button>
        </div>
      </div>
    </section>
  );
}
