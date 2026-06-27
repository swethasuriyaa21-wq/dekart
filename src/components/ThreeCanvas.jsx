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
      // Hero: float right
      targetX = isMobile ? 0 : 1.35;
      targetY = isMobile ? -0.4 : 0.05;
      targetZ = 0;
      targetRotX = 0.25;
      targetRotY = -0.55;
      targetRotZ = -0.05;
      targetScale = isMobile ? 1.05 : 1.45;
    } else if (activeSection === 1) {
      // Customizer: center-left, larger
      targetX = isMobile ? 0 : -1.15;
      targetY = isMobile ? 0.7 : -0.05;
      targetZ = 0;
      targetRotX = 0.05;
      targetRotY = state.clock.getElapsedTime() * 0.12;
      targetRotZ = 0;
      targetScale = isMobile ? 1.2 : 1.55;
    } else if (activeSection === 2) {
      // Catalog: right-back
      targetX = isMobile ? 1.8 : 2.1;
      targetY = isMobile ? -0.8 : -0.25;
      targetZ = -0.6;
      targetRotX = 0.45;
      targetRotY = state.clock.getElapsedTime() * 0.2;
      targetRotZ = -0.2;
      targetScale = 0.9;
    } else if (activeSection === 3) {
      // Instagram Reels: left-back
      targetX = isMobile ? -1.8 : -2.1;
      targetY = isMobile ? -0.6 : 0.25;
      targetZ = -1.0;
      targetRotX = 0.2;
      targetRotY = state.clock.getElapsedTime() * 0.25;
      targetRotZ = 0.1;
      targetScale = 0.8;
    } else {
      // Feedback: centered-back
      targetX = 0;
      targetY = isMobile ? -1.0 : -0.45;
      targetZ = -1.5;
      targetRotX = 0.25;
      targetRotY = state.clock.getElapsedTime() * 0.1;
      targetRotZ = 0;
      targetScale = 0.95;
    }

    // Add mouse parallax only if not in customizer mode to avoid fighting with OrbitControls
    if (activeSection !== 1) {
      targetX += state.pointer.x * 0.35;
      targetY += state.pointer.y * 0.35;
    }

    // Smooth LERP transitions
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
        <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.4}>
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
        {/* Ambient base lighting */}
        <ambientLight intensity={1.8} />
        
        {/* Soft overhead light */}
        <directionalLight
          position={[0, 10, 0]}
          intensity={1.5}
        />
        
        {/* Directional Key Light with shadows */}
        <directionalLight
          position={[5, 6, 4]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Soft Indigo Fill Light */}
        <directionalLight
          position={[-6, 2, 2]}
          intensity={1.2}
          color="#a5b4fc"
        />
        
        {/* Neon Purple Back Rim Light */}
        <directionalLight
          position={[0, 4, -6]}
          intensity={2.2}
          color="#7000ff"
        />
        
        {/* Spotlight directed at bottom for glowing ring */}
        <pointLight position={[0, -2, 0]} intensity={2.0} color="#00f2fe" />

        <MovingObject
          activeSection={activeSection}
          activeProduct={activeProduct}
          designColor={designColor}
          designImage={designImage}
          designText={designText}
          activeShape={activeShape}
        />

        {/* Soft, performant table-contact shadow underneath the floating object */}
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.45}
          scale={7}
          blur={2.0}
          far={2.5}
        />

        {/* Orbit controls enabled only in customizer */}
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
