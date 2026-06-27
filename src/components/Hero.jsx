import React from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function Hero({ onNavigate }) {
  return (
    <section className="section hero-section" id="home">
      <div className="hero-content">
        <div className="hero-badge floating-element">
          <Sparkles size={16} />
          <span>Next-Gen 3D Custom Printing Studio</span>
        </div>
        
        <h1 className="hero-title">
          Print Your <span className="gradient-text">Imagination</span> in <span className="neon-text">3D Real-Time</span>
        </h1>
        
        <p className="hero-description">
          Create and preview your personalized mugs, metal keychains, and apparel inside our interactive 3D studio. Express your style and order directly to your door via WhatsApp.
        </p>
        
        <div className="hero-actions">
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('customizer')}
          >
            Start Customizing <ArrowRight size={18} />
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => onNavigate('catalog')}
          >
            Explore Catalog
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9ca3af' }}>
            <Zap size={16} className="neon-text" style={{ color: '#00f2fe' }} />
            <span>24h Print & Dispatch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9ca3af' }}>
            <ShieldCheck size={16} className="neon-text" style={{ color: '#7000ff' }} />
            <span>Premium Glossy Finish</span>
          </div>
        </div>
      </div>
    </section>
  );
}
