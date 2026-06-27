import React, { useRef } from 'react';
import { Upload, ShoppingCart, Type, Palette, Sparkles, Image as ImageIcon } from 'lucide-react';

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
  viewerRef,
}) {
  const fileInputRef = useRef(null);

  const products = [
    { id: 'mug', label: 'Ceramic Mug', price: 269 },
    { id: 'keychain', label: 'Metal Keychain', price: 200 },
    { id: 'tshirt', label: 'Custom Tshirt', price: 600 },
    { id: 'magnet', label: 'Fridge Magnet', price: 150 },
  ];

  // Cute Pastel Colors array
  const colors = [
    { hex: '#ffffff', name: 'Pearl White' },
    { hex: '#ff758f', name: 'Strawberry Pink' },
    { hex: '#80ed99', name: 'Fresh Mint' },
    { hex: '#ffb703', name: 'Butter Yellow' },
    { hex: '#4cc9f0', name: 'Sky Blue' },
    { hex: '#c8b6ff', name: 'Lavender' },
    { hex: '#111111', name: 'Obsidian Black' },
  ];

  const shapes = [
    { id: 'star', label: 'Star' },
    { id: 'heart', label: 'Heart' },
    { id: 'oval', label: 'Oval' },
    { id: 'diamond', label: 'Diamond' },
  ];

  // Cute Pastel design presets
  const designPresets = [
    {
      label: '☕ But First, Coffee',
      text: 'BUT FIRST, COFFEE ☕',
      color: '#111111',
      shape: 'oval',
    },
    {
      label: '🎉 Happy Birthday',
      text: 'HAPPY BIRTHDAY TO YOU 🎉',
      color: '#ff758f',
      shape: 'heart',
    },
    {
      label: '🚀 Creative Soul',
      text: 'CREATIVE SOUL 🚀',
      color: '#4cc9f0',
      shape: 'star',
    },
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

  const applyPreset = (preset) => {
    setDesignText(preset.text);
    setDesignColor(preset.color);
    setActiveShape(preset.shape);
    setDesignImage(null);
  };

  const currentProductInfo = products.find(p => p.id === activeProduct);

  const handleAddToCartClick = () => {
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
            <Sparkles size={14} style={{ color: '#ff758f' }} />
            <span>Interactive 3D Studio (Drag to Rotate)</span>
          </div>
        </div>

        {/* Right Controls Panel (Studio Sidebar) */}
        <div className="customizer-controls glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sparkles size={20} style={{ color: '#ff758f' }} />
            <h2 style={{ margin: 0 }}>Design Workspace</h2>
          </div>
          <p>Tweak colors, select shapes, upload graphics, or click design presets below to see the WebGL model update in real-time.</p>

          {/* 1. Product Selection */}
          <div className="control-group">
            <span className="control-label">1. Select Product Model</span>
            <div className="product-selector-grid">
              {products.map((p) => (
                <button
                  key={p.id}
                  className={`selector-btn ${activeProduct === p.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveProduct(p.id);
                    if (p.id === 'mug') setDesignColor('#ffffff');
                    if (p.id === 'tshirt') setDesignColor('#ffffff');
                    if (p.id === 'keychain') setDesignColor('#ffffff');
                    if (p.id === 'magnet') setDesignColor('#ffffff');
                  }}
                >
                  {p.label.split(' ')[1]}
                  <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>₹{p.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color Selection */}
          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Palette size={15} style={{ color: '#ff758f' }} />
              <span className="control-label" style={{ marginBottom: 0 }}>2. Glaze / Base Color</span>
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

          {/* 3. Keychain Shapes */}
          {activeProduct === 'keychain' && (
            <div className="control-group">
              <span className="control-label">3. Ring Pendant shape</span>
              <div className="shape-selector-grid">
                {shapes.map((s) => (
                  <button
                    key={s.id}
                    className={`shape-btn ${activeShape === s.id ? 'active' : ''}`}
                    onClick={() => setActiveShape(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Preset Graphic Templates */}
          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ImageIcon size={15} style={{ color: '#ff758f' }} />
              <span className="control-label" style={{ marginBottom: 0 }}>3. Quick Design Presets</span>
            </div>
            <div className="preset-grid">
              {designPresets.map((preset, index) => (
                <button
                  key={index}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Custom Image Uploader */}
          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Upload size={15} style={{ color: '#ff758f' }} />
              <span className="control-label" style={{ marginBottom: 0 }}>4. Upload Custom Photo</span>
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
                  <span style={{ fontSize: '0.85rem', color: '#ff758f', fontWeight: 600 }}>Change Graphic</span>
                </>
              ) : (
                <>
                  <Upload size={22} style={{ color: '#ff758f' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Select Photo File</span>
                </>
              )}
            </div>
          </div>

          {/* 6. Typography Text Input */}
          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Type size={15} style={{ color: '#ff758f' }} />
              <span className="control-label" style={{ marginBottom: 0 }}>5. Add Slogan / Name</span>
            </div>
            <input
              type="text"
              className="glass-input"
              placeholder="Type custom text here..."
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
