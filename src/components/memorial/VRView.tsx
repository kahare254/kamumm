import React, { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Plane, Text, Environment } from '@react-three/drei';
import { X, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemorialData } from './MemorialCard';
import * as THREE from 'three';

interface VRViewProps {
  memorial: MemorialData;
  onClose: () => void;
}

interface MemorialGardenProps {
  memorial: MemorialData;
}

const MemorialGarden: React.FC<MemorialGardenProps> = ({ memorial }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation for the memorial elements
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Position camera for better VR experience
  React.useEffect(() => {
    camera.position.set(0, 2, 5);
  }, [camera]);

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <Plane 
        args={[20, 20]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
      >
        <meshStandardMaterial 
          color="#2D5016" 
          transparent 
          opacity={0.8}
        />
      </Plane>

      {/* Memorial pedestal */}
      <Box args={[2, 0.5, 2]} position={[0, -0.5, 0]}>
        <meshStandardMaterial 
          color="#8B7355" 
          metalness={0.3}
          roughness={0.7}
        />
      </Box>

      {/* Central memorial sphere (representing the person) */}
      <Sphere args={[0.8]} position={[0, 1, 0]}>
        <meshStandardMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.7}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Floating memorial text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {memorial.name}
      </Text>

      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="#DAA520"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
      >
        {memorial.birthDate} - {memorial.deathDate}
      </Text>

      <Text
        position={[0, 3.2, 0]}
        fontSize={0.15}
        color="#B8860B"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
      >
        {memorial.memoryText}
      </Text>

      {/* Heavenly pillars */}
      {[-3, 3].map((x, index) => (
        <group key={index} position={[x, 0, -2]}>
          <Box args={[0.3, 4, 0.3]} position={[0, 1, 0]}>
            <meshStandardMaterial 
              color="#F5F5DC" 
              metalness={0.1}
              roughness={0.8}
            />
          </Box>
          {/* Pillar top */}
          <Box args={[0.6, 0.2, 0.6]} position={[0, 3.1, 0]}>
            <meshStandardMaterial 
              color="#F5F5DC" 
              metalness={0.2}
              roughness={0.7}
            />
          </Box>
        </group>
      ))}

      {/* Virtual candles */}
      {([
        [-2, 0.5, 1],
        [2, 0.5, 1],
        [-1.5, 0.5, 2],
        [1.5, 0.5, 2]
      ] as [number, number, number][]).map((position, index) => (
        <group key={index} position={position}>
          {/* Candle body */}
          <Box args={[0.1, 0.6, 0.1]}>
            <meshStandardMaterial color="#FFFACD" />
          </Box>
          {/* Flame */}
          <Sphere args={[0.05]} position={[0, 0.35, 0]}>
            <meshStandardMaterial 
              color="#FF4500" 
              emissive="#FF4500"
              emissiveIntensity={0.8}
            />
          </Sphere>
        </group>
      ))}

      {/* Floating light orbs */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4;
        return (
          <Sphere 
            key={i}
            args={[0.1]} 
            position={[
              Math.cos(angle) * radius,
              2 + Math.sin(i * 0.7) * 0.5,
              Math.sin(angle) * radius
            ] as [number, number, number]}
          >
            <meshStandardMaterial 
              color="#87CEEB" 
              transparent 
              opacity={0.6}
              emissive="#87CEEB"
              emissiveIntensity={0.3}
            />
          </Sphere>
        );
      })}
    </group>
  );
};

const VRControls: React.FC = () => {
  const { gl, camera } = useThree();
  
  React.useEffect(() => {
    // Check for WebXR support and initialize VR session
    if ('xr' in navigator) {
      // @ts-ignore - WebXR types may not be fully available
      navigator.xr?.isSessionSupported('immersive-vr').then((supported: boolean) => {
        if (supported) {
          gl.xr.enabled = true;
        }
      });
    }
  }, [gl]);

  return null;
};

export const VRView: React.FC<VRViewProps> = ({ memorial, onClose }) => {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);

  React.useEffect(() => {
    // Check WebXR support
    if ('xr' in navigator) {
      // @ts-ignore - WebXR types may not be fully available
      navigator.xr?.isSessionSupported('immersive-vr').then((supported: boolean) => {
        setIsVRSupported(supported);
      });
    }
  }, []);

  const enterVR = async () => {
    if (!isVRSupported) return;
    
    try {
      // @ts-ignore - WebXR types may not be fully available
      const session = await navigator.xr?.requestSession('immersive-vr');
      setIsVRActive(true);
    } catch (error) {
      console.warn('Failed to start VR session:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Controls overlay */}
        <div className="absolute top-8 right-8 z-10 flex gap-4">
          {isVRSupported && (
            <Button
              variant="outline"
              size="lg"
              onClick={enterVR}
              className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Headphones className="w-6 h-6 mr-2" />
              Enter VR
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* VR status indicator */}
        <div className="absolute top-8 left-8 z-10">
          <div className="bg-background/80 rounded-lg p-4 border border-primary/30">
            <h3 className="text-lg font-semibold text-primary mb-2">VR Memorial Experience</h3>
            <p className="text-sm text-muted-foreground">
              {isVRSupported 
                ? 'VR headset detected. Click "Enter VR" for immersive experience.'
                : 'Enjoy the 3D memorial garden. VR headset not detected.'
              }
            </p>
            {isVRActive && (
              <p className="text-sm text-green-600 mt-2">✓ VR session active</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-8 z-10">
          <div className="bg-background/80 rounded-lg p-4 border border-primary/30 max-w-md">
            <h4 className="font-semibold text-primary mb-2">Controls:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Mouse: Look around</li>
              <li>• Scroll: Zoom in/out</li>
              <li>• Drag: Orbit around memorial</li>
              {isVRSupported && <li>• VR: Use hand controllers to navigate</li>}
            </ul>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas 
          camera={{ position: [0, 2, 5], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #98FB98 100%)' }}
        >
          <VRControls />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />
          
          {/* Environment */}
          <Suspense fallback={null}>
            <Environment preset="sunset" />
          </Suspense>
          
          {/* Memorial garden */}
          <Suspense fallback={null}>
            <MemorialGarden memorial={memorial} />
          </Suspense>
          
          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            maxDistance={15}
            minDistance={2}
            maxPolarAngle={Math.PI / 2}
            target={[0, 1, 0]}
          />
        </Canvas>
      </motion.div>
    </AnimatePresence>
  );
};