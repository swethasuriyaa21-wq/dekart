import React from 'react';
import { ArrowRight, Sparkles, Heart, Gift, Smile } from 'lucide-react';

export default function Hero({ onNavigate }) {
  return (
    <section className="section hero-section" id="home">
      <div className="hero-content">
        <div className="hero-badge floating-element">
          <Sparkles size={14} />
          <span>✨ Cozy 3D Custom Gift Studio ✨</span>
        </div>
        
        <h1 className="hero-title">
          Bring Your <span className="neon-text">Imagination</span> to Life in <span className="gradient-text">3D Preview!</span>
        </h1>
        
        <p className="hero-description">
          Design adorable personalized ceramic mugs, custom metal keychains, and screen-printed cotton tees right here in our interactive 3D studio. Preview instantly and order via WhatsApp! 🌸
        </p>
        
        <div className="hero-actions">
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('customizer')}
          >
            Start Designing <ArrowRight size={18} />
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => onNavigate('catalog')}
          >
            Explore Catalog 🎁
          </button>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4a5568', fontWeight: 600 }}>
            <Gift size={16} style={{ color: '#ff758f' }} />
            <span>Cozy Personalized Packaging</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4a5568', fontWeight: 600 }}>
            <Smile size={16} style={{ color: '#80ed99' }} />
            <span>Happy Customer Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
