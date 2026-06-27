import React, { useRef, useState } from 'react';
import { Heart, MessageCircle, Send, Play, Volume2, VolumeX, Instagram, Eye } from 'lucide-react';

export default function InstagramFeed() {
  const [muted, setMuted] = useState(true);

  // Simulated Instagram Reels data
  const reels = [
    {
      id: 1,
      videoUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e339d6ffec64da32f11181283e7&profile_id=139&oauth2_token_id=57447761',
      caption: 'Unboxing our new custom sublimation glossy mugs! ☕️ Double-tap if you love this design! #sublimation #custommug #mugprinting',
      likes: '1,248',
      comments: '58',
      views: '12.4K',
      username: 'dobject_printings'
    },
    {
      id: 2,
      videoUrl: 'https://player.vimeo.com/external/482276537.sd.mp4?s=d00e1cf594a11f26f29dfdfa6dbfbe53e34b9d31&profile_id=165&oauth2_token_id=57447761',
      caption: 'Watch the magic happen! T-shirt print detailing on premium combed cotton. DM for corporate bulk orders. 👕✨ #tshirtprinting #customshirts #branding',
      likes: '840',
      comments: '32',
      views: '7.8K',
      username: 'dobject_printings'
    },
    {
      id: 3,
      videoUrl: 'https://player.vimeo.com/external/517602124.sd.mp4?s=340156d98e1e779a1f26038a8e32c8e3cf28b2be&profile_id=165&oauth2_token_id=57447761',
      caption: 'Custom metal keychain laser engraving! The perfect personalized gift for heart, star, or oval shapes. 🔑⭐ #laserengraving #customkeychain #gifts',
      likes: '954',
      comments: '41',
      views: '9.2K',
      username: 'dobject_printings'
    },
    {
      id: 4,
      videoUrl: 'https://player.vimeo.com/external/459389137.sd.mp4?s=7b925b4ff44ef30221356f9a0c49cc8b7204f128&profile_id=165&oauth2_token_id=57447761',
      caption: 'Corporate branding mugs ready for dispatch! 📦 High glossy 330ml ceramic. Message us on WhatsApp to place your order! #corporategifts #custommugs',
      likes: '1,502',
      comments: '76',
      views: '15.1K',
      username: 'dobject_printings'
    }
  ];

  return (
    <section className="section instagram-section" id="instagram">
      <div className="catalog-container">
        <div className="catalog-header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Instagram size={28} className="neon-text" style={{ color: '#ff007a' }} />
            <h2 style={{ margin: 0 }}>Follow Us on <span className="neon-text">Instagram</span></h2>
          </div>
          <p>
            Check out our latest printing projects, behind-the-scenes crafting reels, and product drops. Visit{' '}
            <a 
              href="https://www.instagram.com/dobject_printings?igsh=MXYxZ3kweGgwNndqcQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#00f2fe', fontWeight: 600, textDecoration: 'underline' }}
            >
              @dobject_printings
            </a>
          </p>
        </div>

        {/* Global Mute control for the page */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setMuted(!muted)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{muted ? 'Muted' : 'Unmuted'}</span>
          </button>
        </div>

        {/* Reels Grid */}
        <div className="instagram-grid">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} muted={muted} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Single Reel card with playing/hover controls
function ReelCard({ reel, muted }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay blocked:', err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCardClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true));
      }
    }
  };

  return (
    <div 
      className="reel-card glass-panel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className="reel-video-container">
        <video
          ref={videoRef}
          className="reel-video"
          src={reel.videoUrl}
          loop
          muted={muted}
          playsInline
        />
        
        {/* Play Overlay */}
        {!isPlaying && (
          <div className="reel-play-btn">
            <Play size={24} style={{ color: '#00f2fe', fill: '#00f2fe' }} />
          </div>
        )}

        {/* UI Overlay */}
        <div className="reel-overlay">
          {/* Header */}
          <div className="reel-header">
            <div className="reel-logo">
              <Instagram />
            </div>
            <div className="reel-views">
              <Eye size={12} />
              <span>{reel.views}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="reel-footer">
            <div className="reel-profile">
              <div className="reel-avatar">
                DP
              </div>
              <span className="reel-username">dobject_printings</span>
              <span style={{ 
                background: '#00f2fe', 
                color: '#000', 
                fontSize: '0.6rem', 
                fontWeight: 800, 
                padding: '2px 4px', 
                borderRadius: '4px' 
              }}>
                VERIFIED
              </span>
            </div>

            <p className="reel-caption">{reel.caption}</p>

            <div className="reel-actions">
              <div className="reel-action-item">
                <Heart size={14} style={{ fill: '#ff007a', color: '#ff007a' }} />
                <span>{reel.likes}</span>
              </div>
              <div className="reel-action-item">
                <MessageCircle size={14} style={{ fill: '#fff', color: '#fff' }} />
                <span>{reel.comments}</span>
              </div>
              <div className="reel-action-item">
                <Send size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
