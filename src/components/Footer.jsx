import React from 'react';
import { Instagram, ShoppingBag, Mail, MapPin, Printer } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={20} className="neon-text" style={{ color: '#00f2fe' }} />
            <span className="gradient-text">dobject printings</span>
          </h3>
          <p>
            Your premier personalized printing studio. We craft high-quality custom ceramic mugs, metal keychains, custom t-shirts, and fridge magnets tailored to your designs.
          </p>
          <div className="footer-socials">
            <a 
              href="https://www.instagram.com/dobject_printings?igsh=MXYxZ3kweGgwNndqcQ==" 
              className="social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://www.amazon.in/l/27943762031?me=A1WMO5SCN5AMUW" 
              className="social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Amazon Store"
            >
              <ShoppingBag size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
            <li><a href="#customizer" onClick={(e) => { e.preventDefault(); onNavigate('customizer'); }}>3D Customizer</a></li>
            <li><a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>Product Grid</a></li>
            <li><a href="#instagram" onClick={(e) => { e.preventDefault(); onNavigate('instagram'); }}>Instagram Reels</a></li>
            <li><a href="#feedback" onClick={(e) => { e.preventDefault(); onNavigate('feedback'); }}>Customer Reviews</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Get In Touch</h4>
          <ul>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#9ca3af', fontSize: '0.9rem' }}>
              <MapPin size={16} style={{ flexShrink: 0, marginTop: '4px', color: '#7000ff' }} />
              <span>Dobject Printings, Chennai, Tamil Nadu, India</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '0.9rem' }}>
              <Mail size={16} style={{ color: '#00f2fe' }} />
              <span>contact@dobjectprintings.com</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '0.9rem' }}>
              <ShoppingBag size={16} style={{ color: '#ff007a' }} />
              <a 
                href="https://www.amazon.in/l/27943762031?me=A1WMO5SCN5AMUW" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                Shop on Amazon.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Dobject Printings. All Rights Reserved.</span>
        <span>Crafting Quality Customized Memories</span>
      </div>
    </footer>
  );
}
