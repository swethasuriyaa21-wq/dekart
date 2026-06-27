import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Real-time Hot Steam Particles Emitter
function SteamParticles({ count = 15 }) {
  const pointsRef = useRef();

  // Create individual particle data: position, speed, phase, scale
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        y: 0.7 + Math.random() * 1.5, // staggered start heights
        xOffset: (Math.random() - 0.5) * 0.25,
        zOffset: (Math.random() - 0.5) * 0.25,
        speed: 0.25 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        scale: 0.2 + Math.random() * 0.5,
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, idx) => {
      // Rise up
      p.y += p.speed * 0.015;

      // Reset when reaching top
      if (p.y > 2.2) {
        p.y = 0.72;
        p.xOffset = (Math.random() - 0.5) * 0.25;
        p.zOffset = (Math.random() - 0.5) * 0.25;
        p.speed = 0.25 + Math.random() * 0.25;
      }

      // Wavy drift using sine waves
      const driftX = p.xOffset + Math.sin(time * 2 + p.phase) * 0.08;
      const driftZ = p.zOffset + Math.cos(time * 2 + p.phase) * 0.08;

      dummy.position.set(driftX, p.y, driftZ);

      // Fade out and expand slightly as steam rises
      const lifeRatio = (p.y - 0.7) / 1.5; // 0 to 1
      const size = p.scale * (1.0 + lifeRatio * 1.5);
      dummy.scale.set(size, size, size);

      dummy.updateMatrix();
      pointsRef.current.setMatrixAt(idx, dummy.matrix);
    });

    pointsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={pointsRef} args={[null, null, count]} castShadow={false}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial
        color="#e5e7eb"
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Helper to draw the custom upload/text design on a dynamic canvas texture
function useDesignTexture(color, designImage, designText, type) {
  const canvasRef = useRef(document.createElement('canvas'));

  const texture = useMemo(() => {
    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create canvas texture
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle guidelines
    ctx.strokeStyle = color === '#ffffff' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    const drawContent = () => {
      // Draw uploaded image
      if (designImage) {
        const img = new Image();
        img.src = designImage;
        img.onload = () => {
          const aspect = img.width / img.height;
          let drawWidth = 260;
          let drawHeight = 260 / aspect;
          if (drawHeight > 260) {
            drawHeight = 260;
            drawWidth = 260 * aspect;
          }

          let x = (canvas.width * 0.5) - (drawWidth / 2);
          let y = (canvas.height - drawHeight) / 2;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, drawWidth, drawHeight, 16);
          ctx.clip();
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          ctx.restore();

          drawText(x + drawWidth / 2, y + drawHeight + 35);
          texture.needsUpdate = true;
        };
      } else {
        // Draw elegant default typographic mockup
        ctx.fillStyle = color === '#ffffff' ? '#111111' : '#ffffff';
        ctx.font = 'bold 36px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DOBJECT STUDIO', canvas.width / 2, canvas.height / 2 - 25);
        
        ctx.font = '22px Inter, sans-serif';
        ctx.fillStyle = color === '#ffffff' ? '#666666' : '#aaaaaa';
        ctx.fillText('Your Print Design Simulator', canvas.width / 2, canvas.height / 2 + 15);
        
        drawText(canvas.width / 2, canvas.height / 2 + 75);
        texture.needsUpdate = true;
      }
    };

    const drawText = (centerX, yPos) => {
      if (designText) {
        ctx.fillStyle = color === '#ffffff' ? '#00f2fe' : '#ffffff';
        ctx.font = 'bold 36px Outfit, sans-serif';
        ctx.textAlign = 'center';
        
        const words = designText.split(' ');
        let line = '';
        let currentY = designImage ? yPos : canvas.height / 2 + 65;
        
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > 450 && n > 0) {
            ctx.fillText(line, designImage ? centerX : canvas.width / 2, currentY);
            line = words[n] + ' ';
            currentY += 40;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, designImage ? centerX : canvas.width / 2, currentY);
      }
    };

    drawContent();
    texture.needsUpdate = true;
  }, [color, designImage, designText, texture, type]);

  return texture;
}

export function ThreeProduct({ type = 'mug', color = '#ffffff', designImage = null, designText = '', shape = 'star' }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.25) * 0.12;
      groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.15) * 0.05;
    }
  });

  const printTexture = useDesignTexture(color, designImage, designText, type);

  // Keychain Extrusions
  const heartGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.4);
    s.bezierCurveTo(0.1, 0.7, 0.6, 0.7, 0.6, 0.3);
    s.bezierCurveTo(0.6, -0.1, 0.2, -0.4, 0, -0.7);
    s.bezierCurveTo(-0.2, -0.4, -0.6, -0.1, -0.6, 0.3);
    s.bezierCurveTo(-0.6, 0.7, -0.1, 0.7, 0, 0.4);
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 });
  }, []);

  const starGeometry = useMemo(() => {
    const s = new THREE.Shape();
    const spikes = 5;
    const outerRadius = 0.65;
    const innerRadius = 0.3;
    let rot = Math.PI / 2 * 3;
    let x = 0;
    let y = 0;
    const step = Math.PI / spikes;

    s.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = Math.cos(rot) * outerRadius;
      y = Math.sin(rot) * outerRadius;
      s.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      s.lineTo(x, y);
      rot += step;
    }
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 });
  }, []);

  const ovalGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.absellipse(0, 0, 0.45, 0.65, 0, Math.PI * 2, false);
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 });
  }, []);

  const diamondGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.7);
    s.lineTo(0.5, 0);
    s.lineTo(0, -0.7);
    s.lineTo(-0.5, 0);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 });
  }, []);

  // T-Shirt Extrusion
  const tshirtGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.2, 0.85);
    s.quadraticCurveTo(0, 0.72, 0.2, 0.85);
    s.lineTo(0.65, 0.85);
    s.lineTo(0.9, 0.5);
    s.lineTo(0.68, 0.3);
    s.lineTo(0.48, 0.4);
    s.lineTo(0.48, -0.85);
    s.lineTo(-0.48, -0.85);
    s.lineTo(-0.48, 0.4);
    s.lineTo(-0.68, 0.3);
    s.lineTo(-0.9, 0.5);
    s.lineTo(-0.65, 0.85);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 });
  }, []);

  return (
    <group ref={groupRef}>
      {/* 3D Ceramic Mug */}
      {type === 'mug' && (
        <group position={[0, -0.3, 0]}>
          {/* Ceramic Cup Glazed Cylinder Body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.82, 0.82, 1.9, 48]} />
            <meshPhysicalMaterial 
              map={printTexture} 
              roughness={0.06} 
              metalness={0.02} 
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              side={THREE.DoubleSide} 
            />
          </mesh>

          {/* Glazed Handle */}
          <mesh position={[-0.8, 0.1, 0]} rotation={[0, 0, Math.PI / 2.3]} castShadow>
            <torusGeometry args={[0.42, 0.11, 16, 32, Math.PI * 1.15]} />
            <meshPhysicalMaterial 
              color={color} 
              roughness={0.06} 
              metalness={0.02} 
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>

          {/* Hot Coffee Liquid filling the mug */}
          <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.78, 32]} />
            <meshPhysicalMaterial 
              color="#2d1b10" 
              roughness={0.05} 
              metalness={0.1} 
              clearcoat={0.8}
            />
          </mesh>

          {/* Rising Steam Particles */}
          <SteamParticles count={18} />
        </group>
      )}

      {/* 3D Keychain */}
      {type === 'keychain' && (
        <group position={[0, 0.25, 0]}>
          {/* Polished Gold Ring */}
          <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.2, 0.028, 12, 32]} />
            <meshPhysicalMaterial 
              color="#d4af37" 
              metalness={0.95} 
              roughness={0.1} 
              clearcoat={1.0}
            />
          </mesh>
          
          {/* Connector link */}
          <mesh position={[0, 0.68, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.07, 0.018, 8, 16]} />
            <meshPhysicalMaterial 
              color="#d4af37" 
              metalness={0.95} 
              roughness={0.1} 
              clearcoat={1.0}
            />
          </mesh>
          
          {/* Extruded Pendant base */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            {shape === 'star' && starGeometry}
            {shape === 'heart' && heartGeometry}
            {shape === 'oval' && ovalGeometry}
            {shape === 'diamond' && diamondGeometry}
            <meshPhysicalMaterial 
              map={printTexture} 
              roughness={0.1} 
              metalness={0.15} 
              clearcoat={1.0}
            />
          </mesh>

          {/* Golden metallic border frame */}
          <mesh position={[0, 0, -0.012]} scale={[1.03, 1.03, 1.0]} castShadow>
            {shape === 'star' && starGeometry}
            {shape === 'heart' && heartGeometry}
            {shape === 'oval' && ovalGeometry}
            {shape === 'diamond' && diamondGeometry}
            <meshPhysicalMaterial 
              color="#d4af37" 
              metalness={0.95} 
              roughness={0.1} 
              clearcoat={1.0}
            />
          </mesh>
        </group>
      )}

      {/* 3D T-Shirt */}
      {type === 'tshirt' && (
        <group scale={[1.05, 1.05, 1.05]} position={[0, 0.1, 0]}>
          <mesh castShadow receiveShadow>
            {tshirtGeometry}
            <meshPhysicalMaterial 
              map={printTexture} 
              roughness={0.85} 
              metalness={0.0} 
              bumpScale={0.01}
            />
          </mesh>
        </group>
      )}

      {/* 3D Fridge Magnet */}
      {type === 'magnet' && (
        <group>
          {/* Magnet printable body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.75, 0.08]} />
            <meshPhysicalMaterial 
              map={printTexture} 
              roughness={0.1} 
              metalness={0.05} 
              clearcoat={0.9}
            />
          </mesh>
          {/* Matte rubber backing */}
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[1.3, 1.7, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}
