import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeProduct } from './ThreeProduct';

function MovingObject({ activeSection, activeProduct, designColor, designImage, designText, activeShape }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    // Define targets based on activeSection
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetScale = 1;

    const isMobile = window.innerWidth <= 768;

    if (activeSection === 0) {
      // Hero: float right
      targetX = isMobile ? 0 : 1.3;
      targetY = isMobile ? -0.4 : 0.1;
      targetZ = 0;
      targetRotX = 0.25;
      targetRotY = -0.5;
      targetRotZ = -0.05;
      targetScale = isMobile ? 1.0 : 1.35;
    } else if (activeSection === 1) {
      // Customizer: center-left, larger
      targetX = isMobile ? 0 : -1.1;
      targetY = isMobile ? 0.7 : 0;
      targetZ = 0;
      targetRotX = 0.05;
      // Let it spin very slowly when activeSection is customizer if user isn't clicking, 
      // but OrbitControls will take precedence when they drag
      targetRotY = state.clock.getElapsedTime() * 0.1;
      targetRotZ = 0;
      targetScale = isMobile ? 1.15 : 1.45;
    } else if (activeSection === 2) {
      // Catalog: right-back
      targetX = isMobile ? 1.8 : 2.0;
      targetY = isMobile ? -0.8 : -0.2;
      targetZ = -0.5;
      targetRotX = 0.4;
      targetRotY = state.clock.getElapsedTime() * 0.2;
      targetRotZ = -0.2;
      targetScale = 0.8;
    } else if (activeSection === 3) {
      // Instagram Reels: left-back
      targetX = isMobile ? -1.8 : -2.0;
      targetY = isMobile ? -0.6 : 0.3;
      targetZ = -1.0;
      targetRotX = 0.15;
      targetRotY = state.clock.getElapsedTime() * 0.25;
      targetRotZ = 0.1;
      targetScale = 0.75;
    } else {
      // Feedback: centered-back
      targetX = 0;
      targetY = isMobile ? -1.0 : -0.4;
      targetZ = -1.5;
      targetRotX = 0.2;
      targetRotY = state.clock.getElapsedTime() * 0.1;
      targetRotZ = 0;
      targetScale = 0.85;
    }

    // Add mouse parallax only if not in customizer mode to avoid fighting with OrbitControls
    if (activeSection !== 1) {
      targetX += state.pointer.x * 0.35;
      targetY += state.pointer.y * 0.35;
    }

    // Smooth LERP (linear interpolation)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.07);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.07);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.07);

    const nextScale = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.07);
    group.current.scale.set(nextScale, nextScale, nextScale);

    if (activeSection !== 1) {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.07);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.07);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotZ, 0.07);
    }
  });

  return (
    <group ref={group} dispose={null}>
      {activeSection === 1 ? (
        // When in Customizer, center the model to rotation anchor
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
        // Add a gentle floating animation elsewhere
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
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
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Lights */}
        <ambientLight intensity={1.5} />
        
        {/* Directional Key Light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light */}
        <directionalLight
          position={[-5, 3, 2]}
          intensity={1.0}
        />
        
        {/* Back Light / Rim Light */}
        <directionalLight
          position={[0, 4, -5]}
          intensity={1.5}
          color="#7000ff" // Purple glow behind the product for neon vibes
        />
        
        {/* Underneath glow */}
        <pointLight position={[0, -2, 0]} intensity={1.5} color="#00f2fe" />

        <MovingObject
          activeSection={activeSection}
          activeProduct={activeProduct}
          designColor={designColor}
          designImage={designImage}
          designText={designText}
          activeShape={activeShape}
        />

        {/* Orbit controls enabled only in customizer for 3D exploration */}
        {activeSection === 1 && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.8}
          />
        )}
      </Canvas>
    </div>
  );
}
