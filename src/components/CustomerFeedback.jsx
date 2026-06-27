import React from 'react';
import { Star, Quote, ShoppingBag, MessageSquare } from 'lucide-react';

export default function CustomerFeedback() {
  const reviews = [
    {
      id: 1,
      name: 'Aniket Sharma',
      source: 'Verified Amazon Buyer',
      icon: <ShoppingBag size={14} />,
      text: 'Mug quality is outstanding! The print is extremely sharp and has a beautiful glossy shine that doesn’t fade even after several microwave runs. Shared my logo on WhatsApp and got it delivered in 2 days.',
      stars: 5,
      date: 'June 2026'
    },
    {
      id: 2,
      name: 'Pooja Roy',
      source: 'Instagram DM Customer',
      icon: <MessageSquare size={14} />,
      text: 'Purchased the star-shaped metal keychain as a gift. It looks so premium, polished, and heavy. The photo printed on it is clear and doesn’t scratch easily. The packaging was neat.',
      stars: 5,
      date: 'May 2026'
    },
    {
      id: 3,
      name: 'Deepak Kumar',
      source: 'Verified Amazon Buyer',
      icon: <ShoppingBag size={14} />,
      text: 'Ordered a customized Dora T-shirt for my daughter’s birthday. She absolutely loved it! The fabric is super soft combed cotton, and the design print colors are very vibrant. Highly recommended!',
      stars: 5,
      date: 'June 2026'
    },
    {
      id: 4,
      name: 'Neha Malhotra',
      source: 'Instagram Client',
      icon: <MessageSquare size={14} />,
      text: 'The fridge magnet print is top-notch. Thick backing magnet that sticks strongly on the fridge. A perfect customized souvenir for friends. Ordering process via WhatsApp is super easy.',
      stars: 5,
      date: 'April 2026'
    },
    {
      id: 5,
      name: 'Rohan Gupta',
      source: 'Verified Buyer',
      icon: <ShoppingBag size={14} />,
      text: 'Great customer service! I was confused about white vs black mug options but they simulated the designs for me. The black mug looks extremely classy and print is 10/10.',
      stars: 5,
      date: 'June 2026'
    }
  ];

  return (
    <section className="section feedback-section" id="feedback">
      <div className="feedback-container">
        <div className="catalog-header">
          <h2>Customer <span className="gradient-text">Feedback</span></h2>
          <p>What our clients say about the printing finish, quality, and quick dispatch times from Amazon and Instagram direct orders.</p>
        </div>

        <div className="feedback-grid">
          {reviews.map((r) => (
            <div key={r.id} className="feedback-card glass-panel">
              <div style={{ position: 'absolute', top: '24px', right: '30px', opacity: 0.15, color: '#00f2fe' }}>
                <Quote size={40} />
              </div>

              <div className="feedback-stars">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>

              <p className="feedback-text">"{r.text}"</p>

              <div className="feedback-user">
                <div className="user-avatar">
                  {r.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="user-details">
                  <h4>{r.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#9ca3af' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {r.icon}
                      {r.source}
                    </span>
                    <span>•</span>
                    <span>{r.date}</span>
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
