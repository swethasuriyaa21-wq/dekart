import React from 'react';
import { X, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem
}) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal; // Free delivery

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;

    // Build WhatsApp Message
    let text = `*📦 NEW CUSTOM ORDER - DOBJECT PRINTINGS*\n`;
    text += `===================================\n\n`;

    cartItems.forEach((item, index) => {
      text += `*${index + 1}. ${item.title}*\n`;
      text += `   • *Variant:* ${item.variant}\n`;
      text += `   • *Color:* ${item.color}\n`;
      if (item.shape) {
        text += `   • *Shape:* ${item.shape.toUpperCase()}\n`;
      }
      if (item.text) {
        text += `   • *Custom Text/Name:* "${item.text}"\n`;
      }
      if (item.image) {
        text += `   • *Custom Artwork:* [Design attached below]\n`;
      }
      text += `   • *Quantity:* ${item.qty}\n`;
      text += `   • *Price:* ₹${item.price} each (Total: ₹${item.price * item.qty})\n`;
      text += `-----------------------------------\n\n`;
    });

    text += `*💰 TOTAL ORDER VALUE:* *₹${total}*\n`;
    text += `===================================\n\n`;
    text += `Hello! I just designed some items on your website. I am sending this to place my order. I will share my design photos/artwork below in this chat!`;

    const encodedText = encodeURIComponent(text);
    
    // Replace with target WhatsApp Business Number. We use a placeholder that the user can configure.
    const businessPhoneNumber = '919000000000'; // Default placeholder, easy to replace
    const whatsappUrl = `https://wa.me/${businessPhoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Dark overlay backdrop */}
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />

      {/* Slide-out Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>
            <ShoppingCart size={22} className="neon-text" style={{ color: '#00f2fe' }} />
            <span>Your Cart</span>
          </h2>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={48} />
              <p>Your shopping cart is empty</p>
              <button 
                className="btn btn-outline btn-sm"
                onClick={onClose}
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-preview">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="cart-item-img" />
                  ) : (
                    // Simple text representation if no image uploaded
                    <ShoppingCart size={24} style={{ opacity: 0.3 }} />
                  )}
                </div>

                <div className="cart-item-details">
                  <div>
                    <h4 className="cart-item-title">{item.title}</h4>
                    <span className="cart-item-variant">{item.variant}</span>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                      <span>Color: {item.color}</span>
                      {item.text && <span style={{ marginLeft: '10px' }}>Text: "{item.text}"</span>}
                    </div>
                  </div>

                  <div className="cart-item-qty">
                    <button 
                      className="qty-btn"
                      onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                    >
                      -
                    </button>
                    <span className="qty-val">{item.qty}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-right">
                  <button 
                    className="cart-item-remove"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="cart-item-price">₹{item.price * item.qty}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="cart-summary-line">
              <span>Delivery Charge</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
            </div>
            <div className="cart-total-line">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={handleCheckoutWhatsApp}
            >
              Order via WhatsApp <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
