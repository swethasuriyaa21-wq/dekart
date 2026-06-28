import React, { useState } from 'react';
import { ShoppingCart, Edit3, Award, Sparkles } from 'lucide-react';

// Import local assets
import whiteMugImg from '../assets/white_mug.png';
import blackMugImg from '../assets/black_mug.png';
import keychainImg from '../assets/keychain.png';
import tshirtImg from '../assets/tshirt.png';
import magnetImg from '../assets/magnet.png';

export default function ProductCatalog({ onAddToCart, onSelectForCustomizer }) {
  const [filter, setFilter] = useState('all');

  const products = [
    {
      id: 'white-mug-330',
      title: 'White ceramic mug - 330ml',
      category: 'drinkware',
      price: 269,
      desc: 'Standard daily glossy white mug. Send us your images/text to print!',
      image: whiteMugImg,
      type: 'mug',
      color: '#ffffff',
      variant: 'White Mug (330ml)',
      badge: '🔥 BEST SELLER'
    },
    {
      id: 'black-mug-330',
      title: 'Black ceramic mug - 330ml',
      category: 'drinkware',
      price: 269,
      desc: 'Sleek glossy black ceramic mug. Send us your images/text to print!',
      image: blackMugImg,
      type: 'mug',
      color: '#111111',
      variant: 'Black Mug (330ml)',
      badge: '✨ 3D CUSTOM'
    },
    {
      id: 'tshirt-custom',
      title: 'Premium Custom Tshirt',
      category: 'apparel',
      price: 600,
      desc: 'Custom print tee on combed cotton. Send your custom images/text!',
      image: tshirtImg,
      type: 'tshirt',
      color: '#ffffff',
      variant: 'Custom White Tshirt',
      badge: '👕 100% COTTON'
    },
    {
      id: 'hoodie-cozy',
      title: 'Cosy Fleece Hoodie',
      category: 'apparel',
      price: 1200,
      desc: 'Ultra-soft fleece hoodie. Customizable chest/back print zones.',
      image: tshirtImg,
      type: 'hoodie',
      color: '#ffffff',
      variant: 'Cosy Hoodie',
      badge: '🔥 BEST SELLER'
    },
    {
      id: 'cap-custom',
      title: 'Baseball Custom Cap',
      category: 'apparel',
      price: 400,
      desc: 'Embroidery cap with adjustable brass buckle.',
      image: tshirtImg,
      type: 'cap',
      color: '#ffffff',
      variant: 'Baseball Cap',
      badge: '🧢 EXCLUSIVE'
    },
    {
      id: 'tote-canvas',
      title: 'Canvas Tote Bag',
      category: 'apparel',
      price: 350,
      desc: 'Thick organic cotton canvas tote. Durable handles.',
      image: tshirtImg,
      type: 'tote',
      color: '#ffffff',
      variant: 'Canvas Tote Bag',
      badge: '🛍️ ORGANIC'
    },
    {
      id: 'bottle-steel',
      title: 'Steel Insulated Bottle',
      category: 'drinkware',
      price: 800,
      desc: 'Insulated stainless steel flask. Keeps beverages hot or cold.',
      image: whiteMugImg,
      type: 'bottle',
      color: '#ffffff',
      variant: 'Insulated Bottle',
      badge: '⚡ PREMIUM STEEL'
    },
    {
      id: 'keychain-heart',
      title: 'Metal Keychain - Heart',
      category: 'keychains',
      price: 200,
      desc: 'Heart-shaped metal keychain. Double side high-gloss photo printing.',
      image: keychainImg,
      type: 'keychain',
      shape: 'heart',
      variant: 'Heart Keychain (Double-side)',
      badge: '💖 POPULAR'
    },
    {
      id: 'keychain-star',
      title: 'Metal Keychain - Star',
      category: 'keychains',
      price: 200,
      desc: 'Star-shaped metal keychain. Single side photo printing.',
      image: keychainImg,
      type: 'keychain',
      shape: 'star',
      variant: 'Star Keychain (Single-side)',
      badge: '✨ PHOTO PRINT'
    },
    {
      id: 'poster-wall',
      title: 'Wall Poster Frame',
      category: 'stationery',
      price: 250,
      desc: 'High-definition posters with top and bottom wooden hangers.',
      image: magnetImg,
      type: 'poster',
      color: '#ffffff',
      variant: 'Wall Poster',
      badge: '🎨 MATTE PRINT'
    },
    {
      id: 'notebook-spiral',
      title: 'Spiral Bound Notebook',
      category: 'stationery',
      price: 300,
      desc: 'Ruled diary with silver metal coil binding.',
      image: magnetImg,
      type: 'notebook',
      color: '#ffffff',
      variant: 'Spiral Notebook',
      badge: '📓 160 PAGES'
    },
    {
      id: 'phonecase-tough',
      title: 'Polycarbonate Phone Case',
      category: 'accessories',
      price: 450,
      desc: 'Impact-resistant phone case. Full cover print protection.',
      image: magnetImg,
      type: 'phonecase',
      color: '#ffffff',
      variant: 'Tough Phone Case',
      badge: '📱 D2C TOUGH'
    },
    {
      id: 'gift-pillow',
      title: 'Cosy Puffy Pillow',
      category: 'accessories',
      price: 500,
      desc: 'Fluffy personalized photo cushion. Perfect cozy gift.',
      image: tshirtImg,
      type: 'gift',
      color: '#ffffff',
      variant: 'Puffy Pillow',
      badge: '🎁 COZY GIFT'
    },
    {
      id: 'magnet-fridge',
      title: 'Fridge Photo Magnet',
      category: 'accessories',
      price: 150,
      desc: 'Glossy fridge magnet prints. Perfect custom gift or souvenir.',
      image: magnetImg,
      type: 'magnet',
      color: '#ffffff',
      variant: 'Fridge Magnet',
      badge: '🎁 COZY GIFT'
    }
  ];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <section className="section catalog-section" id="catalog">
      <div className="catalog-container">
        <div className="catalog-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
            <Award size={16} style={{ color: 'var(--pastel-sky)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--pastel-sky)', letterSpacing: '0.05em' }}>Fancy Custom Prints</span>
          </div>
          <h2>✨ Our <span className="neon-text">Gift Shop</span> ✨</h2>
          <p>Choose an adorable design to order directly, or open it in the 3D studio to personalize colors, text, and artwork files!</p>
        </div>

        {/* Filter Navigation */}
        <div className="catalog-filters" style={{ flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
            style={{ marginBottom: '8px' }}
          >
            All Gifts 🎁
          </button>
          <button 
            className={`btn btn-sm ${filter === 'drinkware' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('drinkware')}
            style={{ marginBottom: '8px' }}
          >
            Drinkware ☕
          </button>
          <button 
            className={`btn btn-sm ${filter === 'apparel' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('apparel')}
            style={{ marginBottom: '8px' }}
          >
            Apparel 👕
          </button>
          <button 
            className={`btn btn-sm ${filter === 'keychains' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('keychains')}
            style={{ marginBottom: '8px' }}
          >
            Keychains 🔑
          </button>
          <button 
            className={`btn btn-sm ${filter === 'stationery' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('stationery')}
            style={{ marginBottom: '8px' }}
          >
            Stationery 📓
          </button>
          <button 
            className={`btn btn-sm ${filter === 'accessories' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('accessories')}
            style={{ marginBottom: '8px' }}
          >
            Accessories 📱
          </button>
        </div>

        {/* Product Grid */}
        <div className="catalog-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-card glass-panel">
              <div className="product-image-container">
                <img src={p.image} alt={p.title} className="product-card-image" />
                <span className="product-card-badge">{p.badge}</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">{p.title}</h3>
                <p className="product-desc">{p.desc}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span className="product-price">₹{p.price}</span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Sparkles size={13} style={{ color: 'var(--pastel-sky)' }} />
                    <span>Free Shipping</span>
                  </div>
                </div>

                <div className="product-actions-flex" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ gap: '6px', fontSize: '0.72rem', fontWeight: 900, padding: '10px 8px' }}
                    onClick={() => onSelectForCustomizer(p.type, p.color || '#ffffff', p.shape || 'star')}
                  >
                    <Edit3 size={14} /> 3D CUSTOMIZE
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px', fontSize: '0.72rem', fontWeight: 900, padding: '10px 8px' }}
                    onClick={() => onAddToCart({
                      id: `${p.id}-${Date.now()}`,
                      productType: p.type,
                      title: p.title,
                      variant: p.variant,
                      price: p.price,
                      color: p.color === '#111111' ? 'Black' : 'White',
                      colorHex: p.color || '#ffffff',
                      text: '',
                      image: null,
                      shape: p.shape || null,
                      qty: 1,
                    })}
                  >
                    <ShoppingCart size={14} /> ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
