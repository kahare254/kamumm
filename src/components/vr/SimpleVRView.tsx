import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Sphere, Box, Plane, Cylinder, useTexture } from '@react-three/drei';
import { X, Headphones, Smartphone, Monitor, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemorialData } from '../memorial/MemorialCard';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';
import * as THREE from 'three';

interface SimpleVRViewProps {
  memorial: MemorialData;
  onClose: () => void;
}

// WebXR hook that must be used inside Canvas
const useWebXRInCanvas = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { gl } = useThree();

  useEffect(() => {
    const checkSupport = async () => {
      if ('xr' in navigator && navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          setIsSupported(supported);

          if (supported && gl.xr) {
            gl.xr.enabled = true;
          }
        } catch (error) {
          console.warn('WebXR check failed:', error);
        }
      }
    };

    checkSupport();
  }, [gl]);

  const startVRSession = async () => {
    if (!isSupported || !navigator.xr) return false;

    try {
      const session = await navigator.xr.requestSession('immersive-vr');
      if (gl.xr) {
        await gl.xr.setSession(session);
        setIsActive(true);
        return true;
      }
    } catch (error) {
      console.warn('VR session start failed:', error);
    }
    return false;
  };

  const endVRSession = async () => {
    if (gl.xr && gl.xr.getSession()) {
      await gl.xr.getSession()?.end();
      setIsActive(false);
    }
  };

  return { isSupported, isActive, startVRSession, endVRSession };
};

// WebXR detection outside Canvas
const useWebXRDetection = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      if ('xr' in navigator && navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          setIsSupported(supported);
        } catch (error) {
          console.warn('WebXR check failed:', error);
        }
      }
    };

    checkSupport();
  }, []);

  return { isSupported };
};

// VR Scene with WebXR controls inside Canvas
const VRSceneWithControls: React.FC<{
  memorial: MemorialData;
  vrSessionRequested: boolean;
  onVRSessionChange: (active: boolean) => void;
}> = ({ memorial, vrSessionRequested, onVRSessionChange }) => {
  const { isSupported, isActive, startVRSession, endVRSession } = useWebXRInCanvas();

  useEffect(() => {
    if (vrSessionRequested && !isActive) {
      startVRSession().then((success) => {
        if (success) {
          onVRSessionChange(true);
        }
      });
    }
  }, [vrSessionRequested, isActive, startVRSession, onVRSessionChange]);

  useEffect(() => {
    onVRSessionChange(isActive);
  }, [isActive, onVRSessionChange]);

  return (
    <>
      <VRMemorialScene memorial={memorial} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={!isActive}
        autoRotateSpeed={0.5}
        minDistance={2}
        maxDistance={10}
      />
    </>
  );
};

// VR Memorial Scene with 360° rotation and template display
const VRMemorialScene: React.FC<{ memorial: MemorialData }> = ({ memorial }) => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const photoTexture = useTexture(memorial.photo || islamicArchPlaceholder);

  // 360° continuous rotation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;

      // Smooth 360° rotation
      groupRef.current.rotation.y = time * 0.5; // Continuous rotation

      // Gentle floating motion
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.1;
    }

    // Memorial card rotation
    if (cardRef.current) {
      const time = state.clock.elapsedTime;
      cardRef.current.rotation.y = time * 0.3; // Slower card rotation
    }
  });

  // Position camera for VR
  useEffect(() => {
    camera.position.set(0, 1.6, 3); // VR eye height
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <group ref={groupRef}>
      {/* Central Memorial Card */}
      <group ref={cardRef} position={[0, 0, 0]}>
        {/* Card Background - Main white card */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Card Border - Brown frame */}
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[2.6, 3.6, 0.05]} />
          <meshStandardMaterial color="#8B5A3C" />
        </mesh>

        {/* Title */}
        <Text
          position={[0, 1.4, 0.1]}
          fontSize={0.15}
          color="#8B5A3C"
          anchorX="center"
          anchorY="middle"
        >
          GATE OF MEMORY
        </Text>

        {/* Memorial Photo */}
        <Plane position={[0, 0.3, 0.1]} args={[0.8, 1.0]}>
          <meshBasicMaterial
            map={photoTexture}
            transparent
            opacity={0.95}
          />
        </Plane>

        {/* Photo Frame */}
        <mesh position={[0, 0.3, 0.08]}>
          <boxGeometry args={[0.9, 1.1, 0.05]} />
          <meshStandardMaterial color="#DAA520" />
        </mesh>

        {/* Memorial Text */}
        <Text
          position={[0, -0.5, 0.1]}
          fontSize={0.12}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          In Loving Memory
        </Text>

        <Text
          position={[0, -0.7, 0.1]}
          fontSize={0.16}
          color="#8B5A3C"
          anchorX="center"
          anchorY="middle"
        >
          {memorial.name}
        </Text>

        {/* Dates */}
        <Text
          position={[0, -0.9, 0.1]}
          fontSize={0.1}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          {memorial.birthDate} - {memorial.deathDate}
        </Text>

        {/* Memory Text */}
        {memorial.memoryText && (
          <Text
            position={[0, -1.1, 0.1]}
            fontSize={0.08}
            color="#555555"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            textAlign="center"
          >
            "{memorial.memoryText}"
          </Text>
        )}

        {/* QR Code */}
        <mesh position={[0, -1.4, 0.1]}>
          <boxGeometry args={[0.4, 0.4, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Simple floating particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(i) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        );
      })}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#E6F3FF" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

// Simple VR Button Component
const VRButton: React.FC<{ onStart: () => void; isSupported: boolean }> = ({ onStart, isSupported }) => {
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onStart}
      disabled={!isSupported}
      className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
    >
      <Headphones className="w-6 h-6 mr-2" />
      {isSupported ? 'Enter VR' : 'VR Not Available'}
    </Button>
  );
};

export const SimpleVRView: React.FC<SimpleVRViewProps> = ({ memorial, onClose }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPlaying, setIsPlaying] = useState(true);
  const [vrSessionRequested, setVrSessionRequested] = useState(false);
  const { isSupported: vrSupported } = useWebXRDetection();

  // Detect if mobile device
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setViewMode(isMobile ? 'mobile' : 'desktop');
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Controls */}
        <div className="absolute top-8 right-8 z-10 flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Mode Indicator */}
        <div className="absolute top-8 left-8 z-10 text-white/80 text-sm">
          <div className="flex items-center gap-2 mb-1">
            {viewMode === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            <span>{viewMode === 'mobile' ? 'Mobile VR Mode' : 'Desktop VR Mode'}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-8 right-8 z-10 text-center text-white/60 text-sm">
          <p>
            {viewMode === 'mobile' 
              ? 'Move your device to look around • Use touch to navigate'
              : 'Drag to look around • Scroll to zoom • Click VR button if headset available'
            }
          </p>
        </div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 1.6, 3], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
          performance={{ min: 0.5 }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <Suspense fallback={null}>
            {/* Lighting optimized for VR */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[0, 5, 0]} intensity={0.6} color="#FFD700" />
            <spotLight
              position={[5, 5, 5]}
              angle={0.3}
              penumbra={0.5}
              intensity={0.5}
              color="#87CEEB"
            />

            {/* Environment */}
            <Environment preset="night" />

            {/* VR Scene with WebXR Controls */}
            <VRSceneWithControls
              memorial={memorial}
              vrSessionRequested={vrSessionRequested}
              onVRSessionChange={(_active) => {
                // Handle VR session state changes if needed
              }}
            />
          </Suspense>
        </Canvas>

        {/* VR Button (bottom right) */}
        {vrSupported && (
          <div className="absolute bottom-8 right-8 z-10">
            <Button
              onClick={() => setVrSessionRequested(true)}
              disabled={vrSessionRequested}
              className="bg-primary/90 hover:bg-primary text-primary-foreground px-6 py-3 text-lg font-semibold rounded-full shadow-lg"
            >
              <Headphones className="w-5 h-5 mr-2" />
              {vrSessionRequested ? 'Starting VR...' : 'Enter VR'}
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// These components have been replaced by VRSceneWithControls and the VR button in the main component
