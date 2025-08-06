import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HeavenlyGateProps {
  animate?: boolean;
}

const GateStructure: React.FC<{ animate: boolean }> = ({ animate }) => {
  const gateRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create particle system for heavenly effect
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (gateRef.current && animate) {
      gateRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.01;
        if (positions[i] > 8) positions[i] = 0;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={gateRef}>
      {/* Gate Pillars */}
      <mesh position={[-2, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Gate Top */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[4.6, 0.3, 0.3]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Decorative Elements */}
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Heavenly Light */}
      <mesh position={[0, 3, -1]}>
        <planeGeometry args={[3, 6]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.2} 
        />
      </mesh>
      
      {/* Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={particlePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#FFD700" 
          size={0.05} 
          transparent 
          opacity={0.6}
        />
      </points>
      
      {/* Ethereal Text */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="#DAA520"
        anchorX="center"
        anchorY="middle"
      >
        In Eternal Memory
      </Text>
    </group>
  );
};

export const HeavenlyGate: React.FC<HeavenlyGateProps> = ({ animate = false }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FFD700" />
        <pointLight position={[0, 8, 0]} intensity={1} color="#FFD700" distance={10} />
        
        <GateStructure animate={animate} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={animate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};