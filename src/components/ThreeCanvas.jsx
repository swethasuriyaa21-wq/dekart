import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeProduct } from './ThreeProduct';

function MovingObject({ activeSection, activeProduct, designColor, designImage, designText, activeShape }) {
  const group = useRef();

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

    if (activeSection === 0) {
      // Hero: float right side, small and cute
      targetX = isMobile ? 0 : 1.35;
      targetY = isMobile ? -0.45 : 0.05;
      targetZ = 0;
      targetRotX = 0.2;
      targetRotY = -0.45;
      targetRotZ = -0.05;
      targetScale = isMobile ? 0.75 : 1.05;
    } else if (activeSection === 1) {
      // Customizer: snaps into left side frame, slightly larger but still cute
      targetX = isMobile ? 0 : -1.15;
      targetY = isMobile ? 0.65 : -0.05;
      targetZ = 0;
      targetRotX = 0.05;
      targetRotY = state.clock.getElapsedTime() * 0.12;
      targetRotZ = 0;
      targetScale = isMobile ? 0.85 : 1.15;
    } else if (activeSection === 2) {
      // Catalog: float at the top-right margin, small background ornament
      targetX = isMobile ? 1.8 : 2.3;
      targetY = isMobile ? -0.8 : 0.8;
      targetZ = -0.8;
      targetRotX = 0.3;
      targetRotY = state.clock.getElapsedTime() * 0.18;
      targetRotZ = -0.1;
      targetScale = 0.55;
    } else if (activeSection === 3) {
      // Instagram: float at the top-left margin
      targetX = isMobile ? -1.8 : -2.3;
      targetY = isMobile ? -0.6 : 0.8;
      targetZ = -0.8;
      targetRotX = 0.15;
      targetRotY = state.clock.getElapsedTime() * 0.22;
      targetRotZ = 0.1;
      targetScale = 0.55;
    } else {
      // Customer Feedback: float at the far top-right margin, very small and cute
      targetX = isMobile ? 1.6 : 2.3;
      targetY = isMobile ? -0.9 : 1.0;
      targetZ = -1.2;
      targetRotX = 0.2;
      targetRotY = state.clock.getElapsedTime() * 0.1;
      targetRotZ = 0.05;
      targetScale = 0.45;
    }

    // Dynamic, flexible cursor parallax (wider float range)
    if (activeSection !== 1) {
      targetX += state.pointer.x * 0.75;
      targetY += state.pointer.y * 0.75;
    }

    // Smooth LERP (slightly faster for snappy responsive feel)
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
      {activeSection === 1 ? (
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
}) {
  return (
    <div className={`canvas-container ${activeSection === 1 ? 'canvas-interactive' : ''}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Soft, warm ambient light */}
        <ambientLight intensity={1.9} color="#fffcf9" />
        
        {/* Overhead soft warm light */}
        <directionalLight
          position={[0, 8, 0]}
          intensity={1.2}
          color="#fff6e6"
        />
        
        {/* Key Directional Light for glaze shine */}
        <directionalLight
          position={[5, 6, 4]}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Pastel Rose Rim Light from behind */}
        <directionalLight
          position={[-5, 3, -4]}
          intensity={1.5}
          color="#ffc9d2"
        />
        
        {/* Soft Apricot Point Light below */}
        <pointLight position={[0, -2, 0]} intensity={1.8} color="#ffe5d9" />

        <MovingObject
          activeSection={activeSection}
          activeProduct={activeProduct}
          designColor={designColor}
          designImage={designImage}
          designText={designText}
          activeShape={activeShape}
        />

        {/* Soft shadow map under product */}
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.3}
          scale={7}
          blur={2.2}
          far={2.2}
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
