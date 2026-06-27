import React, { useState } from 'react';
import { ShoppingCart, Edit3 } from 'lucide-react';

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
      id: 'white-mug-150',
      title: 'White ceramic mug - 150ml',
      category: 'mugs',
      price: 229,
      desc: 'Adorable mini glossy white mug. Send us your images/text to print!',
      image: whiteMugImg,
      type: 'mug',
      color: '#ffffff',
      variant: 'White Mug (150ml)'
    },
    {
      id: 'white-mug-330',
      title: 'White ceramic mug - 330ml',
      category: 'mugs',
      price: 269,
      desc: 'Standard daily glossy white mug. Send us your images/text to print!',
      image: whiteMugImg,
      type: 'mug',
      color: '#ffffff',
      variant: 'White Mug (330ml)'
    },
    {
      id: 'black-mug-330',
      title: 'Black ceramic mug - 330ml',
      category: 'mugs',
      price: 269,
      desc: 'Sleek glossy black ceramic mug. Send us your images/text to print!',
      image: blackMugImg,
      type: 'mug',
      color: '#111111',
      variant: 'Black Mug (330ml)'
    },
    {
      id: 'keychain-star',
      title: 'Metal plated keychain - Star',
      category: 'keychains',
      price: 200,
      desc: 'Star-shaped metal keychain. Single side high-gloss photo printing.',
      image: keychainImg,
      type: 'keychain',
      shape: 'star',
      variant: 'Star Keychain (Single-side)'
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
      variant: 'Heart Keychain (Double-side)'
    },
    {
      id: 'keychain-oval-single',
      title: 'Metal plated keychain - Oval',
      category: 'keychains',
      price: 200,
      desc: 'Oval-shaped metal keychain. Single side high-gloss photo printing.',
      image: keychainImg,
      type: 'keychain',
      shape: 'oval',
      variant: 'Oval Keychain (Single-side)'
    },
    {
      id: 'keychain-diamond',
      title: 'Metal plated keychain - Diamond',
      category: 'keychains',
      price: 200,
      desc: 'Diamond-shaped metal keychain. Single side photo printing.',
      image: keychainImg,
      type: 'keychain',
      shape: 'diamond',
      variant: 'Diamond Keychain (Single-side)'
    },
    {
      id: 'keychain-oval-double',
      title: 'Metal Keychain - Oval (Double)',
      category: 'keychains',
      price: 200,
      desc: 'Oval-shaped metal keychain. Double side high-gloss photo printing.',
      image: keychainImg,
      type: 'keychain',
      shape: 'oval',
      variant: 'Oval Keychain (Double-side)'
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
      variant: 'Custom White Tshirt'
    },
    {
      id: 'magnet-fridge',
      title: 'Ceramic mug & Fridge magnet',
      category: 'apparel',
      price: 150,
      desc: 'Glossy fridge magnet prints. Perfect custom gift or souvenir.',
      image: magnetImg,
      type: 'magnet',
      color: '#ffffff',
      variant: 'Fridge Magnet'
    }
  ];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <section className="section catalog-section" id="catalog">
      <div className="catalog-container">
        <div className="catalog-header">
          <h2>✨ Our <span className="neon-text">Custom Shop</span> ✨</h2>
          <p>Choose an adorable design to order directly, or open it in the 3D studio to personalize colors, text, and artwork files!</p>
        </div>

        {/* Filter Navigation */}
        <div className="catalog-filters">
          <button 
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All Gifts 🎁
          </button>
          <button 
            className={`btn btn-sm ${filter === 'mugs' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('mugs')}
          >
            Cozy Mugs ☕
          </button>
          <button 
            className={`btn btn-sm ${filter === 'keychains' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('keychains')}
          >
            Keychains 🔑
          </button>
          <button 
            className={`btn btn-sm ${filter === 'apparel' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('apparel')}
          >
            Apparel & Magnets 👕
          </button>
        </div>

        {/* Product Grid */}
        <div className="catalog-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-card glass-panel">
              <div className="product-image-container">
                <img src={p.image} alt={p.title} className="product-card-image" />
                <span className="product-card-badge">₹{p.price}</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">{p.title}</h3>
                <p className="product-desc">{p.desc}</p>
                <div className="product-footer">
                  <span className="product-price">₹{p.price}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ padding: '8px 12px' }}
                      title="Personalize in 3D"
                      onClick={() => onSelectForCustomizer(p.type, p.color || '#ffffff', p.shape || 'star')}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
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
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
