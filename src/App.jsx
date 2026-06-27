import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingCart, Printer } from 'lucide-react';

// Subcomponents
import ThreeCanvas from './components/ThreeCanvas';
import Hero from './components/Hero';
import Customizer from './components/Customizer';
import ProductCatalog from './components/ProductCatalog';
import InstagramFeed from './components/InstagramFeed';
import CustomerFeedback from './components/CustomerFeedback';
import Cart from './components/Cart';
import Footer from './components/Footer';

export default function App() {
  // Navigation & Scroll
  const [activeSection, setActiveSection] = useState(0);
  const viewerRef = useRef(null); // Capture drag events inside customizer panel
  const appRef = useRef(null); // Capture global pointer events across the website

  // 3D Customizer State
  const [activeProduct, setActiveProduct] = useState('mug');
  const [designColor, setDesignColor] = useState('#ffffff');
  const [designImage, setDesignImage] = useState(null);
  const [designText, setDesignText] = useState('');
  const [activeShape, setActiveShape] = useState('star');

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Setup intersection observer to track current scroll section
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const options = {
      root: null,
      threshold: 0.35, // Trigger when 35% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          let index = 0;
          if (id === 'home') index = 0;
          else if (id === 'customizer') index = 1;
          else if (id === 'catalog') index = 2;
          else if (id === 'instagram') index = 3;
          else if (id === 'feedback') index = 4;
          
          setActiveSection(index);
        }
      });
    }, options);

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  // Navigation click handler
  const handleNavigate = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Select item from catalog to customize in 3D
  const handleSelectForCustomizer = (type, color, shape) => {
    setActiveProduct(type);
    setDesignColor(color);
    if (shape) setActiveShape(shape);
    
    // Clear custom uploaded media on product switch to avoid mapping confusion
    setDesignImage(null);
    setDesignText('');

    // Scroll to customizer
    handleNavigate('customizer');
  };

  // Add Item to Cart
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      // Check if duplicate item exists
      const existingIndex = prev.findIndex(
        (i) => i.productType === item.productType && 
               i.colorHex === item.colorHex && 
               i.shape === item.shape &&
               i.text === item.text &&
               i.image === item.image &&
               i.variant === item.variant
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        return updated;
      } else {
        return [...prev, item];
      }
    });

    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#7000ff', '#ff007a', '#ffffff']
    });

    // Auto-open cart drawer
    setCartOpen(true);
  };

  // Cart Handlers
  const handleUpdateQty = (itemId, newQty) => {
    setCartItems((prev) => 
      prev.map((i) => (i.id === itemId ? { ...i, qty: newQty } : i))
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return (
    <div className="app-container" ref={appRef}>
      {/* Fixed Background 3D Canvas */}
      <ThreeCanvas
        activeSection={activeSection}
        activeProduct={activeProduct}
        designColor={designColor}
        designImage={designImage}
        designText={designText}
        activeShape={activeShape}
        eventSource={appRef}
      />

      {/* Navigation Navbar */}
      <nav className="navbar">
        <a href="#home" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} className="navbar-logo">
          <Printer size={22} className="neon-text" style={{ color: '#00f2fe' }} />
          <span>dobject printings</span>
        </a>

        <ul className="navbar-links">
          <li>
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>Home</a>
          </li>
          <li>
            <a href="#customizer" onClick={(e) => { e.preventDefault(); handleNavigate('customizer'); }}>3D Studio</a>
          </li>
          <li>
            <a href="#catalog" onClick={(e) => { e.preventDefault(); handleNavigate('catalog'); }}>Catalog</a>
          </li>
          <li>
            <a href="#instagram" onClick={(e) => { e.preventDefault(); handleNavigate('instagram'); }}>Instagram</a>
          </li>
          <li>
            <a href="#feedback" onClick={(e) => { e.preventDefault(); handleNavigate('feedback'); }}>Reviews</a>
          </li>
        </ul>

        <div className="navbar-actions">
          <div className="cart-icon-container" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={20} style={{ color: '#fff' }} />
            {cartItems.length > 0 && (
              <span className="cart-count">
                {cartItems.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Slide-out Cart Panel */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
      />

      {/* Scrollable Layout Content */}
      <div className="content-container">
        <Hero onNavigate={handleNavigate} />
        
        <Customizer
          activeProduct={activeProduct}
          setActiveProduct={setActiveProduct}
          designColor={designColor}
          setDesignColor={setDesignColor}
          designImage={designImage}
          setDesignImage={setDesignImage}
          designText={designText}
          setDesignText={setDesignText}
          activeShape={activeShape}
          setActiveShape={setActiveShape}
          onAddToCart={handleAddToCart}
          viewerRef={viewerRef}
        />

        <ProductCatalog 
          onAddToCart={handleAddToCart}
          onSelectForCustomizer={handleSelectForCustomizer}
        />

        <InstagramFeed />

        <CustomerFeedback />

        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
