import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeProduct } from './ThreeProduct';

// Twinkling Starfield particle system
function TwinklingStars() {
  const pointsRef = useRef();
  
  const [positions] = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 400; i++) {
      // Wide scattering coordinates
      pos.push((Math.random() - 0.5) * 16); 
      pos.push((Math.random() - 0.5) * 12); 
      pos.push((Math.random() - 0.5) * 10 - 2); 
    }
    return [new Float32Array(pos)];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.012;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.008) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4cc9f0"
        size={0.035}
        sizeAttenuation={true}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Orbiting individual items in a ring for the Hero storefront constellation
function OrbitingProduct({ type, angle, radius }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const currentAngle = angle + time * 0.12; // Revolving speed
    
    // Circular position
    ref.current.position.x = Math.cos(currentAngle) * radius;
    ref.current.position.z = Math.sin(currentAngle) * radius;
    
    // Staggered wavy float drift
    ref.current.position.y = Math.sin(time * 1.5 + angle * 2) * 0.12; 
    
    // Rotate models
    ref.current.rotation.y = time * 0.45 + angle;
    ref.current.rotation.x = Math.cos(time * 0.3) * 0.08;
  });

  // Small cute product scales
  return (
    <group ref={ref} scale={[0.34, 0.34, 0.34]}>
      <ThreeProduct type={type} color="#ffffff" designText={type.toUpperCase()} />
    </group>
  );
}

function MovingObject({ activeSection, activeProduct, designColor, designImage, designText, activeShape }) {
  const group = useRef();

  const productList = useMemo(() => [
    'mug', 'keychain', 'tshirt', 'magnet', 'hoodie', 'cap', 
    'tote', 'bottle', 'poster', 'sticker', 'notebook', 'phonecase'
  ], []);

  useFrame((state) => {
    if (!group.current) return;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetScale = 1;

    const isMobile = window.innerWidth <= 768;
    const time = state.clock.getElapsedTime();

    if (activeSection === 0) {
      // Hero Constellation: centered layout, slightly lower down to balance ring radius
      targetX = 0;
      targetY = isMobile ? -0.85 : -0.55;
      targetZ = 0;
      targetRotX = 0.22;
      targetRotY = time * 0.15; // slow galaxy group rotation
      targetRotZ = -state.pointer.x * 0.15; // bank coordinates
      targetScale = isMobile ? 0.72 : 1.15;
    } else if (activeSection === 1) {
      // Customizer Snap
      targetX = isMobile ? 0 : -1.15;
      targetY = isMobile ? 0.65 : -0.05;
      targetZ = 0;
      targetRotX = 0.05;
      targetRotY = time * 0.15;
      targetRotZ = 0;
      targetScale = isMobile ? 0.85 : 1.15;
    } else if (activeSection === 2) {
      // Catalog Snap
      targetX = isMobile ? 1.8 : 2.3;
      targetY = isMobile ? -0.8 : 0.8;
      targetZ = -0.8;
      targetRotX = 0.25;
      targetRotY = time * 0.4; 
      targetRotZ = -state.pointer.x * 0.2;
      targetScale = 0.55;
    } else if (activeSection === 3) {
      // Instagram Snap
      targetX = isMobile ? -1.8 : -2.3;
      targetY = isMobile ? -0.6 : 0.8;
      targetZ = -0.8;
      targetRotX = 0.15;
      targetRotY = time * 0.45;
      targetRotZ = -state.pointer.x * 0.2;
      targetScale = 0.55;
    } else {
      // Reviews Snap
      targetX = isMobile ? 1.6 : 2.3;
      targetY = isMobile ? -0.9 : 1.0;
      targetZ = -1.2;
      targetRotX = 0.2;
      targetRotY = time * 0.3;
      targetRotZ = -state.pointer.x * 0.15;
      targetScale = 0.45;
    }

    // Parallax tracking drift
    if (activeSection !== 1) {
      targetX += state.pointer.x * 0.75;
      targetY += state.pointer.y * 0.75;
    }

    // Snappy LERP coordinates matching
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.075);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.075);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.075);

    const nextScale = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.075);
    group.current.scale.set(nextScale, nextScale, nextScale);

    if (activeSection !== 1) {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.075);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.075);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotZ, 0.075);
    }
  });

  return (
    <group ref={group} dispose={null}>
      {activeSection === 0 ? (
        // 🌌 Render the entire Orbiting Merchandise Universe Constellation!
        <group>
          {productList.map((type, idx) => {
            const angle = (idx / productList.length) * Math.PI * 2;
            const radius = window.innerWidth <= 768 ? 1.25 : 2.15;
            return (
              <Float key={type} speed={1.5 + Math.random()} floatIntensity={0.3} rotationIntensity={0.2}>
                <OrbitingProduct type={type} angle={angle} radius={radius} />
              </Float>
            );
          })}
        </group>
      ) : activeSection === 1 ? (
        <Center>
          <ThreeProduct
            type={activeProduct}
            color={designColor}
            designImage={designImage}
            designText={designText}
            shape={activeShape}
          />
        </Center>
      ) : (
        <Float speed={3.0} rotationIntensity={0.2} floatIntensity={0.45}>
          <Center>
            <ThreeProduct
              type={activeProduct}
              color={designColor}
              designImage={designImage}
              designText={designText}
              shape={activeShape}
            />
          </Center>
        </Float>
      )}
    </group>
  );
}

export default function ThreeCanvas({
  activeSection = 0,
  activeProduct = 'mug',
  designColor = '#ffffff',
  designImage = null,
  designText = '',
  activeShape = 'star',
  eventSource,
}) {
  return (
    <div className={`canvas-container ${activeSection === 1 ? 'canvas-interactive' : ''}`}>
      <Canvas
        shadows
        eventSource={eventSource}
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Twinkling Starfield in background */}
        <TwinklingStars />

        {/* Ambient lighting */}
        <ambientLight intensity={1.8} color="#fffdf9" />
        
        {/* Overhead key light */}
        <directionalLight position={[0, 8, 0]} intensity={1.1} color="#f0f7ff" />
        
        {/* Main spotlights for clearcoat shininess */}
        <directionalLight
          position={[5, 6, 4]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        
        {/* Purple/Indigo Rim Light */}
        <directionalLight position={[-6, 2, -3]} intensity={2.0} color="#c8b6ff" />
        
        {/* Cyan Fill Light from side */}
        <directionalLight position={[6, -2, -3]} intensity={1.8} color="#4cc9f0" />
        
        {/* Soft point light below */}
        <pointLight position={[0, -3, 0]} intensity={1.5} color="#d8b4fe" />

        <MovingObject
          activeSection={activeSection}
          activeProduct={activeProduct}
          designColor={designColor}
          designImage={designImage}
          designText={designText}
          activeShape={activeShape}
        />

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.3}
          scale={8}
          blur={2.4}
          far={2.4}
        />

        {activeSection === 1 && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.4}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.7}
          />
        )}
      </Canvas>
    </div>
  );
}
