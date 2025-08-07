import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Plane, Text, useTexture } from '@react-three/drei';
import { MemorialData } from '../memorial/MemorialCard';
import * as THREE from 'three';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

interface ProceduralMemorialModelProps {
  memorial: MemorialData;
  animate?: boolean;
  scale?: number;
}

export const ProceduralMemorialModel: React.FC<ProceduralMemorialModelProps> = ({ 
  memorial, 
  animate = true,
  scale = 1 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const photoTexture = useTexture(memorial.photo || islamicArchPlaceholder);

  // Animation
  useFrame((state) => {
    if (groupRef.current && animate) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  // Colors based on memorial type
  const colors = useMemo(() => {
    const baseColors = {
      male: { primary: '#4A90E2', secondary: '#2E5BDA', accent: '#FFD700' },
      female: { primary: '#E24A90', secondary: '#DA2E7B', accent: '#FFD700' },
      child: { primary: '#E2A04A', secondary: '#DA7B2E', accent: '#FFD700' },
    };
    return baseColors[memorial.cardType] || baseColors.male;
  }, [memorial.cardType]);

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Base Platform */}
      <Cylinder position={[0, -0.6, 0]} args={[1.5, 1.5, 0.2, 16]}>
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.8}
          metalness={0.1}
        />
      </Cylinder>

      {/* Decorative Base Ring */}
      <Cylinder position={[0, -0.45, 0]} args={[1.6, 1.6, 0.05, 32]}>
        <meshStandardMaterial 
          color={colors.accent} 
          roughness={0.2}
          metalness={0.8}
        />
      </Cylinder>

      {/* Left Pillar */}
      <group position={[-0.8, 0.5, 0]}>
        <Box args={[0.25, 2.5, 0.25]}>
          <meshStandardMaterial 
            color={colors.primary} 
            roughness={0.3}
            metalness={0.7}
          />
        </Box>
        {/* Pillar Capital */}
        <Box position={[0, 1.35, 0]} args={[0.35, 0.2, 0.35]}>
          <meshStandardMaterial 
            color={colors.accent} 
            roughness={0.2}
            metalness={0.8}
          />
        </Box>
      </group>

      {/* Right Pillar */}
      <group position={[0.8, 0.5, 0]}>
        <Box args={[0.25, 2.5, 0.25]}>
          <meshStandardMaterial 
            color={colors.primary} 
            roughness={0.3}
            metalness={0.7}
          />
        </Box>
        {/* Pillar Capital */}
        <Box position={[0, 1.35, 0]} args={[0.35, 0.2, 0.35]}>
          <meshStandardMaterial 
            color={colors.accent} 
            roughness={0.2}
            metalness={0.8}
          />
        </Box>
      </group>

      {/* Arch Top */}
      <Cylinder position={[0, 1.75, 0]} args={[0.15, 0.15, 1.8, 16]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color={colors.primary} 
          roughness={0.3}
          metalness={0.7}
        />
      </Cylinder>

      {/* Decorative Arch Elements */}
      <Cylinder position={[0, 1.85, 0]} args={[0.08, 0.08, 2, 16]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color={colors.accent} 
          roughness={0.2}
          metalness={0.8}
        />
      </Cylinder>

      {/* Memorial Photo Frame */}
      <group position={[0, 0.3, 0.13]}>
        {/* Frame */}
        <Box args={[1.3, 1.6, 0.05]}>
          <meshStandardMaterial 
            color={colors.accent} 
            roughness={0.2}
            metalness={0.8}
          />
        </Box>
        {/* Photo */}
        <Plane position={[0, 0, 0.03]} args={[1.2, 1.5]}>
          <meshBasicMaterial 
            map={photoTexture} 
            transparent
            opacity={0.95}
          />
        </Plane>
      </group>

      {/* Islamic Pattern Decorations */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.2;
        return (
          <Sphere
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.3,
              Math.sin(angle) * radius
            ]}
            args={[0.05]}
          >
            <meshStandardMaterial 
              color={colors.accent} 
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
        );
      })}

      {/* Floating Name Text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {memorial.name}
      </Text>

      {/* Dates Text */}
      <Text
        position={[0, -0.9, 0]}
        fontSize={0.12}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {memorial.birthDate} - {memorial.deathDate}
      </Text>

      {/* Memory Text */}
      {memorial.memoryText && (
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.08}
          color="#DDDDDD"
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
          textAlign="center"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          "{memorial.memoryText}"
        </Text>
      )}

      {/* Holographic Aura */}
      <Sphere position={[0, 0.5, 0]} args={[2]}>
        <meshBasicMaterial 
          color={colors.accent} 
          transparent 
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Ambient Light Particles */}
      {[...Array(15)].map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 2 + Math.sin(i) * 0.5;
        const height = Math.sin(i * 2) * 1.5;
        return (
          <Sphere
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
            args={[0.02]}
          >
            <meshBasicMaterial 
              color={colors.accent} 
              transparent 
              opacity={0.7}
            />
          </Sphere>
        );
      })}

      {/* Ground Shadow Plane */}
      <Plane 
        position={[0, -0.7, 0]} 
        args={[4, 4]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.2}
        />
      </Plane>
    </group>
  );
};

// Simplified version for performance-constrained devices
export const SimpleMemorialModel: React.FC<ProceduralMemorialModelProps> = ({ 
  memorial, 
  animate = true,
  scale = 1 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const photoTexture = useTexture(memorial.photo || islamicArchPlaceholder);

  useFrame((state) => {
    if (groupRef.current && animate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const color = memorial.cardType === 'male' ? '#4A90E2' : 
               memorial.cardType === 'female' ? '#E24A90' : '#E2A04A';

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Simple Base */}
      <Cylinder position={[0, -0.5, 0]} args={[1, 1, 0.2, 8]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>

      {/* Simple Pillars */}
      <Box position={[-0.6, 0.5, 0]} args={[0.2, 2, 0.2]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Box position={[0.6, 0.5, 0]} args={[0.2, 2, 0.2]}>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Simple Top */}
      <Box position={[0, 1.5, 0]} args={[1.4, 0.2, 0.2]}>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Photo */}
      <Plane position={[0, 0.5, 0.11]} args={[1, 1.2]}>
        <meshBasicMaterial map={photoTexture} />
      </Plane>

      {/* Name */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {memorial.name}
      </Text>
    </group>
  );
};
