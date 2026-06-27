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
      desc: 'Perfect small glossy white mug. Share your images/text to print.',
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
      desc: 'Standard daily coffee mug. Share your images/text to print.',
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
      desc: 'Sleek black glossy ceramic mug. Share your images/text to print.',
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
      desc: 'Single side high gloss photo printing. Star shape.',
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
      desc: 'Double side high gloss photo printing. Heart shape.',
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
      desc: 'Single side high gloss photo printing. Oval shape.',
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
      desc: 'Single side high gloss photo printing. Diamond shape.',
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
      desc: 'Double side high gloss photo printing. Oval shape.',
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
      desc: 'Share your text/images to place your custom print on combed cotton.',
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
      desc: 'Custom printed glossy fridge magnet. Perfect gift or memorabilia.',
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
          <h2>Our <span className="gradient-text">Product Catalog</span></h2>
          <p>Choose from our standard items, add directly to cart, or load them into the 3D customizer for complete personalization.</p>
        </div>

        {/* Filter Navigation */}
        <div className="catalog-filters">
          <button 
            className={`btn btn-sm ${filter === 'all' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All Products
          </button>
          <button 
            className={`btn btn-sm ${filter === 'mugs' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setFilter('mugs')}
          >
            Mugs
          </button>
          <button 
            className={`btn btn-sm ${filter === 'keychains' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setFilter('keychains')}
          >
            Keychains
          </button>
          <button 
            className={`btn btn-sm ${filter === 'apparel' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setFilter('apparel')}
          >
            Apparel & Magnets
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
                      style={{ padding: '8px' }}
                      title="Customize in 3D"
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
