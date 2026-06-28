import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { ThreeProduct } from './ThreeProduct';
import { Sparkles, Printer } from 'lucide-react';

export default function LoadingScreen({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 400); // Wait for progress bar fill
          setTimeout(() => onFinished(), 1200); // Complete fade transition
          return 100;
        }
        // Staggered increments for realistic loading feel
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div 
      className="loading-overlay" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#04040d',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'Outfit', sans-serif"
      }}
    >
      {/* Immersive background aura */}
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(76,201,240,0.15) 0%, rgba(114,9,183,0.05) 50%, rgba(0,0,0,0) 100%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite'
        }}
      />

      {/* Mini 3D Rotating Mug Canvas */}
      <div style={{ width: '220px', height: '220px', marginBottom: '24px' }}>
        <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }}>
          <ambientLight intensity={1.5} color="#fffcf9" />
          <directionalLight position={[2, 5, 2]} intensity={2.0} />
          <pointLight position={[0, -2, 0]} intensity={1.5} color="#c8b6ff" />
          <Center>
            <group rotation={[0.2, 0, 0]}>
              <ThreeProduct type="mug" color="#ffffff" designText="LOADING" />
            </group>
          </Center>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={12} />
        </Canvas>
      </div>

      {/* Logo and Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#4cc9f0' }}>
        <Printer size={28} className="neon-text" style={{ filter: 'drop-shadow(0 0 8px #4cc9f0)' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: 0 }}>
          dobject studio
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '32px' }}>
        <Sparkles size={13} style={{ color: '#c8b6ff' }} />
        <span>Initializing Merchandise Universe</span>
      </div>

      {/* Progress Bar Container */}
      <div 
        style={{
          width: '280px',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div 
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4cc9f0 0%, #c8b6ff 50%, #3a86ff 100%)',
            boxShadow: '0 0 10px rgba(76, 201, 240, 0.6)',
            borderRadius: '10px',
            transition: 'width 0.15s ease-out'
          }}
        />
      </div>

      {/* Percentage Text */}
      <div 
        style={{
          marginTop: '12px',
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '0.05em'
        }}
      >
        {progress}%
      </div>
    </div>
  );
}
