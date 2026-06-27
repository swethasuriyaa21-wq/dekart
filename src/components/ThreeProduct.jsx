import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

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

    // Draw grid or print guidelines for details (subtle aesthetic)
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 64) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    const drawContent = () => {
      // Draw uploaded image
      if (designImage) {
        const img = new Image();
        img.src = designImage;
        img.onload = () => {
          // Center and scale image
          const aspect = img.width / img.height;
          let drawWidth = 240;
          let drawHeight = 240 / aspect;
          if (drawHeight > 240) {
            drawHeight = 240;
            drawWidth = 240 * aspect;
          }

          // Positioning based on product type
          let x = (canvas.width - drawWidth) / 2;
          let y = (canvas.height - drawHeight) / 2;
          
          if (type === 'mug') {
            // For mug, wrap around front (middle-right of the flat texture)
            x = (canvas.width * 0.5) - (drawWidth / 2);
          }

          // Rounded corners for the image card
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, drawWidth, drawHeight, 12);
          ctx.clip();
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          ctx.restore();

          // Render text AFTER image completes loading
          drawText(x + drawWidth / 2, y + drawHeight + 35);
          texture.needsUpdate = true;
        };
      } else {
        // Draw default placeholder text/icon if nothing is uploaded
        ctx.fillStyle = color === '#ffffff' ? '#333333' : '#cccccc';
        ctx.font = 'bold 36px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DOBJECT PRINTINGS', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '24px Inter, sans-serif';
        ctx.fillText('Your Design Here', canvas.width / 2, canvas.height / 2 + 20);
        
        drawText(canvas.width / 2, canvas.height / 2 + 80);
        texture.needsUpdate = true;
      }
    };

    const drawText = (centerX, yPos) => {
      if (designText) {
        ctx.fillStyle = color === '#ffffff' ? '#111111' : '#ffffff';
        ctx.font = 'bold 32px Outfit, sans-serif';
        ctx.textAlign = 'center';
        
        // Wrap text if too long
        const words = designText.split(' ');
        let line = '';
        let currentY = designImage ? yPos : canvas.height / 2 + 50;
        
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > 400 && n > 0) {
            ctx.fillText(line, designImage ? centerX : canvas.width / 2, currentY);
            line = words[n] + ' ';
            currentY += 36;
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

  // Subtle rotation over time
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
      groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.08;
    }
  });

  const printTexture = useDesignTexture(color, designImage, designText, type);

  // Procedural geometries
  // Heart Shape for keychain
  const heartGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.4);
    s.bezierCurveTo(0.1, 0.7, 0.6, 0.7, 0.6, 0.3);
    s.bezierCurveTo(0.6, -0.1, 0.2, -0.4, 0, -0.7);
    s.bezierCurveTo(-0.2, -0.4, -0.6, -0.1, -0.6, 0.3);
    s.bezierCurveTo(-0.6, 0.7, -0.1, 0.7, 0, 0.4);
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 });
  }, []);

  // Star Shape
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
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 });
  }, []);

  // Oval Shape
  const ovalGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.absellipse(0, 0, 0.45, 0.65, 0, Math.PI * 2, false);
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 });
  }, []);

  // Diamond Shape
  const diamondGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.7);
    s.lineTo(0.5, 0);
    s.lineTo(0, -0.7);
    s.lineTo(-0.5, 0);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 });
  }, []);

  // Extruded T-Shirt Geometry
  const tshirtGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.2, 0.85);
    s.quadraticCurveTo(0, 0.72, 0.2, 0.85); // Neck collar
    s.lineTo(0.65, 0.85); // Right shoulder
    s.lineTo(0.9, 0.5); // Right sleeve outer
    s.lineTo(0.68, 0.3); // Right sleeve cuff
    s.lineTo(0.48, 0.4); // Underarm right
    s.lineTo(0.48, -0.85); // Hem right
    s.lineTo(-0.48, -0.85); // Hem bottom
    s.lineTo(-0.48, 0.4); // Underarm left
    s.lineTo(-0.68, 0.3); // Left sleeve cuff
    s.lineTo(-0.9, 0.5); // Left sleeve outer
    s.lineTo(-0.65, 0.85); // Left shoulder
    s.closePath();

    return new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 });
  }, []);

  return (
    <group ref={groupRef}>
      {/* 3D Ceramic Mug */}
      {type === 'mug' && (
        <group>
          {/* Cylinder cup body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.85, 0.85, 2.0, 32]} />
            <meshStandardMaterial 
              map={printTexture} 
              roughness={0.15} 
              metalness={0.1} 
              side={THREE.DoubleSide} 
            />
          </mesh>
          {/* Handle */}
          <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.45, 0.12, 16, 32, Math.PI * 1.05]} />
            <meshStandardMaterial color={color} roughness={0.15} metalness={0.1} />
          </mesh>
          {/* Inner Liquid or hollow rim (procedural dark inner shadow cylinder) */}
          <mesh position={[0, 0.99, 0]}>
            <cylinderGeometry args={[0.81, 0.81, 0.02, 32]} />
            <meshStandardMaterial color="#1a120b" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* 3D Keychain */}
      {type === 'keychain' && (
        <group position={[0, 0.3, 0]}>
          {/* Metal Ring (top) */}
          <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.22, 0.03, 8, 24]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Chain connector */}
          <mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.08, 0.02, 8, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Pendant based on active shape */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            {shape === 'star' && starGeometry}
            {shape === 'heart' && heartGeometry}
            {shape === 'oval' && ovalGeometry}
            {shape === 'diamond' && diamondGeometry}
            {/* The pendant face uses a special mapping coordinate system or maps the canvas directly */}
            <meshStandardMaterial 
              map={printTexture} 
              roughness={0.2} 
              metalness={0.3} 
            />
          </mesh>

          {/* Golden metal border for a premium look */}
          <mesh position={[0, 0, -0.01]} scale={[1.04, 1.04, 1.0]} castShadow>
            {shape === 'star' && starGeometry}
            {shape === 'heart' && heartGeometry}
            {shape === 'oval' && ovalGeometry}
            {shape === 'diamond' && diamondGeometry}
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* 3D T-Shirt */}
      {type === 'tshirt' && (
        <group scale={[1.1, 1.1, 1.1]}>
          <mesh castShadow receiveShadow>
            {tshirtGeometry}
            <meshStandardMaterial 
              map={printTexture} 
              roughness={0.8} 
              metalness={0.1} 
            />
          </mesh>
        </group>
      )}

      {/* 3D Fridge Magnet */}
      {type === 'magnet' && (
        <group>
          {/* Main Magnet body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.8, 0.08]} />
            <meshStandardMaterial 
              map={printTexture} 
              roughness={0.15} 
              metalness={0.1} 
            />
          </mesh>
          {/* Black Rubber Magnet Backing */}
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[1.35, 1.75, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.0} />
          </mesh>
        </group>
      )}
    </group>
  );
}
