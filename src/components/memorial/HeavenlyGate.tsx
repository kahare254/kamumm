import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HeavenlyGateProps {
  animate?: boolean;
}

const GateStructure: React.FC<{ animate: boolean }> = ({ animate }) => {
  const gateRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gateRef.current && animate) {
      gateRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
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