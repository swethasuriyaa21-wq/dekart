import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Cute 3D Heart-Shaped Steam Particles Emitter
function SteamParticles({ count = 12 }) {
  const meshRef = useRef();

  // Tiny heart shape path
  const heartShapeGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.06);
    s.bezierCurveTo(0.02, 0.11, 0.1, 0.11, 0.1, 0.05);
    s.bezierCurveTo(0.1, -0.01, 0.03, -0.06, 0, -0.11);
    s.bezierCurveTo(-0.03, -0.06, -0.1, -0.01, -0.1, 0.05);
    s.bezierCurveTo(-0.1, 0.11, -0.02, 0.11, 0, 0.06);
    
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.015,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.005
    });
  }, []);

  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        y: 0.72 + Math.random() * 1.5,
        xOffset: (Math.random() - 0.5) * 0.2,
        zOffset: (Math.random() - 0.5) * 0.2,
        speed: 0.2 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 0.5,
        spinSpeedX: (Math.random() - 0.5) * 1.5,
        spinSpeedY: 1.0 + Math.random() * 2.0,
        spinSpeedZ: (Math.random() - 0.5) * 1.5
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, idx) => {
      p.y += p.speed * 0.012;
      if (p.y > 2.0) {
        p.y = 0.72;
        p.xOffset = (Math.random() - 0.5) * 0.2;
        p.zOffset = (Math.random() - 0.5) * 0.2;
        p.speed = 0.2 + Math.random() * 0.2;
      }

      const driftX = p.xOffset + Math.sin(time * 1.8 + p.phase) * 0.06;
      const driftZ = p.zOffset + Math.cos(time * 1.8 + p.phase) * 0.06;

      dummy.position.set(driftX, p.y, driftZ);
      dummy.rotation.set(time * p.spinSpeedX, time * p.spinSpeedY, time * p.spinSpeedZ);
      const lifeRatio = (p.y - 0.72) / 1.28;
      const size = p.scale * (0.8 + Math.sin(lifeRatio * Math.PI) * 0.5) * Math.max(0, 1 - lifeRatio);
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(idx, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[heartShapeGeometry, null, count]}>
      <meshBasicMaterial
        color="#c8b6ff" 
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

// Helper to draw the custom design on the dynamic canvas texture
function useDesignTexture(color, designImage, designText, type) {
  const canvasRef = useRef(document.createElement('canvas'));

  const texture = useMemo(() => {
    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 512;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background color
    ctx.fillStyle = color === '#ffffff' ? '#FFFDF9' : color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic grid overlay for Awwwards layout texture
    ctx.strokeStyle = 'rgba(76,201,240,0.06)'; 
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    const drawContent = () => {
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
          ctx.roundRect(x, y, drawWidth, drawHeight, 20); 
          ctx.clip();
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          ctx.restore();

          // Border outline
          ctx.strokeStyle = 'rgba(76,201,240,0.25)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.roundRect(x, y, drawWidth, drawHeight, 20);
          ctx.stroke();

          drawText(x + drawWidth / 2, y + drawHeight + 40);
          texture.needsUpdate = true;
        };
      } else {
        // High-end typography template
        ctx.fillStyle = '#4cc9f0'; 
        ctx.font = '900 44px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ DOBJECT MERCH ✨', canvas.width / 2, canvas.height / 2 - 25);
        
        ctx.font = '600 22px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Premium Custom Merchandise', canvas.width / 2, canvas.height / 2 + 15);
        
        drawText(canvas.width / 2, canvas.height / 2 + 75);
        texture.needsUpdate = true;
      }
    };

    const drawText = (centerX, yPos) => {
      if (designText) {
        ctx.fillStyle = '#c8b6ff'; 
        ctx.font = '900 36px Outfit, sans-serif';
        ctx.textAlign = 'center';
        
        const words = designText.split(' ');
        let line = '';
        let currentY = designImage ? yPos : canvas.height / 2 + 70;
        
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
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.25) * 0.08;
      groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.15) * 0.04;
    }
  });

  const printTexture = useDesignTexture(color, designImage, designText, type);

  // Memoize Geometries for keychains and t-shirts to resolve React child crashes
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

  const selectedShapeGeometry = useMemo(() => {
    if (shape === 'star') return starGeometry;
    if (shape === 'heart') return heartGeometry;
    if (shape === 'oval') return ovalGeometry;
    return diamondGeometry;
  }, [shape, starGeometry, heartGeometry, ovalGeometry, diamondGeometry]);

  // Hoodie shape extrusion
  const hoodieGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.24, 0.85);
    s.quadraticCurveTo(0, 0.75, 0.24, 0.85);
    s.lineTo(0.7, 0.85);
    s.lineTo(0.92, 0.1); // long sleeves
    s.lineTo(0.78, -0.05);
    s.lineTo(0.55, 0.25);
    s.lineTo(0.55, -0.9);
    s.lineTo(-0.55, -0.9);
    s.lineTo(-0.55, 0.25);
    s.lineTo(-0.78, -0.05);
    s.lineTo(-0.92, 0.1);
    s.lineTo(-0.7, 0.85);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.13, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 });
  }, []);

  return (
    <group ref={groupRef}>
      {/* 1. Ceramic Mug */}
      {type === 'mug' && (
        <group position={[0, -0.35, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.82, 0.82, 1.9, 48]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.05} clearcoat={1.0} clearcoatRoughness={0.04} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-0.8, 0.1, 0]} rotation={[0, 0, Math.PI / 2.3]} castShadow>
            <torusGeometry args={[0.42, 0.11, 16, 32, Math.PI * 1.15]} />
            <meshPhysicalMaterial color={color === '#ffffff' ? '#FFFDF9' : color} roughness={0.05} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.78, 32]} />
            <meshPhysicalMaterial color="#3d2314" roughness={0.05} clearcoat={0.9} />
          </mesh>
          <SteamParticles count={8} />
        </group>
      )}

      {/* 2. Keychain */}
      {type === 'keychain' && (
        <group position={[0, 0.25, 0]}>
          <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.2, 0.028, 12, 32]} />
            <meshPhysicalMaterial color="#c8b6ff" metalness={0.9} roughness={0.15} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, 0.68, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.07, 0.018, 8, 16]} />
            <meshPhysicalMaterial color="#c8b6ff" metalness={0.9} roughness={0.15} clearcoat={1.0} />
          </mesh>
          <mesh geometry={selectedShapeGeometry} position={[0, 0, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial map={printTexture} roughness={0.08} clearcoat={1.0} clearcoatRoughness={0.05} />
          </mesh>
          <mesh geometry={selectedShapeGeometry} position={[0, 0, -0.012]} scale={[1.03, 1.03, 1.0]} castShadow>
            <meshPhysicalMaterial color="#c8b6ff" metalness={0.9} roughness={0.15} clearcoat={1.0} />
          </mesh>
        </group>
      )}

      {/* 3. T-Shirt */}
      {type === 'tshirt' && (
        <group scale={[1.05, 1.05, 1.05]} position={[0, 0.1, 0]}>
          <mesh geometry={tshirtGeometry} castShadow receiveShadow>
            <meshPhysicalMaterial map={printTexture} roughness={0.85} metalness={0.0} />
          </mesh>
        </group>
      )}

      {/* 4. Fridge Magnet */}
      {type === 'magnet' && (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.75, 0.08]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.08} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[1.3, 1.7, 0.02]} />
            <meshStandardMaterial color="#2d2d2d" roughness={0.95} />
          </mesh>
        </group>
      )}

      {/* 5. Cozy Hoodie */}
      {type === 'hoodie' && (
        <group scale={[0.95, 0.95, 0.95]} position={[0, 0.1, 0]}>
          {/* Main hoodie body */}
          <mesh geometry={hoodieGeometry} castShadow receiveShadow>
            <meshPhysicalMaterial map={printTexture} roughness={0.92} metalness={0.0} />
          </mesh>
          {/* Cozy Hood behind neck */}
          <mesh position={[0, 0.86, -0.16]} scale={[1.0, 1.1, 0.9]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshPhysicalMaterial color={color === '#ffffff' ? '#FFFDF9' : color} roughness={0.92} />
          </mesh>
        </group>
      )}

      {/* 6. Custom Cap */}
      {type === 'cap' && (
        <group position={[0, -0.15, 0]} rotation={[0.1, 0, 0]}>
          {/* Dome / Crown */}
          <mesh castShadow>
            <sphereGeometry args={[0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.9} />
          </mesh>
          {/* Cap Visor / Brim */}
          <mesh position={[0, -0.03, 0.55]} rotation={[0.12, 0, 0]} castShadow>
            <boxGeometry args={[0.78, 0.028, 0.5]} />
            <meshPhysicalMaterial color={color === '#ffffff' ? '#FFFDF9' : color} roughness={0.9} />
          </mesh>
          {/* Top cap button */}
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshPhysicalMaterial color="#c8b6ff" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* 7. Tote Bag */}
      {type === 'tote' && (
        <group position={[0, -0.1, 0]}>
          {/* Flat bag body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.6, 0.12]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.88} />
          </mesh>
          {/* Front Strap */}
          <mesh position={[0, 0.8, 0.07]} rotation={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.3, 0.025, 8, 24, Math.PI]} />
            <meshPhysicalMaterial color="#c8b6ff" roughness={0.88} />
          </mesh>
          {/* Back Strap */}
          <mesh position={[0, 0.8, -0.07]} rotation={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.3, 0.025, 8, 24, Math.PI]} />
            <meshPhysicalMaterial color="#c8b6ff" roughness={0.88} />
          </mesh>
        </group>
      )}

      {/* 8. Steel Bottle */}
      {type === 'bottle' && (
        <group position={[0, -0.5, 0]}>
          {/* Main Flask Body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.38, 1.4, 32]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.12} clearcoat={1.0} />
          </mesh>
          {/* Bottle Neck */}
          <mesh position={[0, 0.82, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.24, 32]} />
            <meshPhysicalMaterial color={color === '#ffffff' ? '#FFFDF9' : color} roughness={0.12} clearcoat={1.0} />
          </mesh>
          {/* Metallic Cap */}
          <mesh position={[0, 0.98, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.16, 32]} />
            <meshPhysicalMaterial color="#c8b6ff" metalness={0.9} roughness={0.1} clearcoat={1.0} />
          </mesh>
        </group>
      )}

      {/* 9. Wall Poster */}
      {type === 'poster' && (
        <group>
          {/* Vertical printable plane */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.9, 0.02]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.18} clearcoat={0.9} />
          </mesh>
          {/* Wooden Top Frame rod */}
          <mesh position={[0, 0.96, 0.015]} castShadow>
            <boxGeometry args={[1.42, 0.05, 0.04]} />
            <meshPhysicalMaterial color="#2b1e15" roughness={0.6} />
          </mesh>
          {/* Wooden Bottom Frame rod */}
          <mesh position={[0, -0.96, 0.015]} castShadow>
            <boxGeometry args={[1.42, 0.05, 0.04]} />
            <meshPhysicalMaterial color="#2b1e15" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* 10. Die-cut Sticker */}
      {type === 'sticker' && (
        <group>
          {/* Round sticker sheet */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.012, 48]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.06} clearcoat={1.0} side={THREE.DoubleSide} />
          </mesh>
          {/* Thick border outline */}
          <mesh scale={[1.05, 1.0, 1.05]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.008, 48]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.06} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 11. Spiral Notebook */}
      {type === 'notebook' && (
        <group position={[0.05, 0, 0]}>
          {/* Notebook cover booklet */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.6, 0.08]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.6} />
          </mesh>
          {/* Spiral binding rings along left edge */}
          <group position={[-0.62, 0, 0]}>
            {[-0.7, -0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.7].map((yPos, idx) => (
              <mesh key={idx} position={[0, yPos, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.06, 0.015, 8, 16]} />
                <meshPhysicalMaterial color="#c8b6ff" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* 12. Phone Case */}
      {type === 'phonecase' && (
        <group>
          {/* Phone cover shell */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.82, 1.65, 0.09]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.08} clearcoat={1.0} />
          </mesh>
          {/* Camera black module plate */}
          <mesh position={[-0.22, 0.52, 0.05]} castShadow>
            <boxGeometry args={[0.26, 0.38, 0.02]} />
            <meshPhysicalMaterial color="#1a1a1a" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 13. Puffy Pillow (Personalized Gift) */}
      {type === 'gift' && (
        <group scale={[1.15, 1.15, 0.52]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.62, 32, 32]} />
            <meshPhysicalMaterial map={printTexture} roughness={0.85} />
          </mesh>
        </group>
      )}

      {/* 14. Custom Flyer Page */}
      {type === 'flyer' && (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.7, 0.012]} />
            <meshPhysicalMaterial 
              map={printTexture} 
              roughness={0.18} 
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
