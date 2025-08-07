import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Sphere } from '@react-three/drei';
import { X, Smartphone, RotateCcw, Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemorialData } from '../memorial/MemorialCard';
import * as THREE from 'three';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

interface MobileVRFallbackProps {
  memorial: MemorialData;
  onClose: () => void;
}

interface GyroscopeData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

// Mobile VR Camera Controller using device orientation
const MobileVRCamera: React.FC<{ gyroData: GyroscopeData; isActive: boolean }> = ({ 
  gyroData, 
  isActive 
}) => {
  const { camera } = useThree();
  const initialOrientation = useRef<GyroscopeData>({ alpha: null, beta: null, gamma: null });
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (isActive && gyroData.alpha !== null && !hasInitialized) {
      initialOrientation.current = { ...gyroData };
      setHasInitialized(true);
    }
  }, [gyroData, isActive, hasInitialized]);

  useFrame(() => {
    if (isActive && hasInitialized && gyroData.alpha !== null && initialOrientation.current.alpha !== null) {
      // Convert device orientation to camera rotation
      const alpha = THREE.MathUtils.degToRad(gyroData.alpha - initialOrientation.current.alpha!);
      const beta = THREE.MathUtils.degToRad(gyroData.beta! - (initialOrientation.current.beta! || 0));
      const gamma = THREE.MathUtils.degToRad(gyroData.gamma! - (initialOrientation.current.gamma! || 0));

      // Apply rotation to camera
      camera.rotation.set(beta, alpha, -gamma);
    }
  });

  return null;
};

// Touch gesture handler for mobile interactions
const MobileTouchHandler: React.FC<{ onMove: (deltaX: number, deltaY: number) => void }> = ({ onMove }) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setIsMoving(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart && isMoving && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;
      onMove(deltaX * 0.01, deltaY * 0.01);
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setIsMoving(false);
  };

  return (
    <div
      className="absolute inset-0 touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ zIndex: 1 }}
    />
  );
};

// Mobile VR Memorial Scene
const MobileVRScene: React.FC<{ memorial: MemorialData; gyroData: GyroscopeData; isGyroActive: boolean }> = ({ 
  memorial, 
  gyroData, 
  isGyroActive 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Position camera for mobile VR experience
  useEffect(() => {
    camera.position.set(0, 1.6, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      groupRef.current.rotation.y += 0.002;
    }
  });

  const handleCameraMove = (deltaX: number, deltaY: number) => {
    if (!isGyroActive) {
      camera.rotation.y -= deltaX;
      camera.rotation.x -= deltaY;
      
      // Clamp vertical rotation
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }
  };

  return (
    <>
      <MobileVRCamera gyroData={gyroData} isActive={isGyroActive} />
      <MobileTouchHandler onMove={handleCameraMove} />
      
      <group ref={groupRef}>
        {/* Central Memorial */}
        <Sphere args={[0.6]} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#FFD700"
            metalness={0.2}
            roughness={0.3}
            transmission={0.1}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Memorial Photo */}
        <mesh position={[0, 0, 0.61]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial>
            <primitive object={new THREE.TextureLoader().load(memorial.photo || islamicArchPlaceholder)} />
          </meshBasicMaterial>
        </mesh>

        {/* Name Text */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {memorial.name}
        </Text>

        {/* Dates */}
        <Text
          position={[0, -1, 0]}
          fontSize={0.12}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
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
            maxWidth={3}
            textAlign="center"
          >
            "{memorial.memoryText}"
          </Text>
        )}

        {/* Floating particles optimized for mobile */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 1.5;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 0.3) * 0.3,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial color="#87CEEB" transparent opacity={0.6} />
            </mesh>
          );
        })}
      </group>
    </>
  );
};

export const MobileVRFallback: React.FC<MobileVRFallbackProps> = ({ memorial, onClose }) => {
  const [gyroData, setGyroData] = useState<GyroscopeData>({ alpha: null, beta: null, gamma: null });
  const [isGyroActive, setIsGyroActive] = useState(false);
  const [isGyroSupported, setIsGyroSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Check for gyroscope support
  useEffect(() => {
    if (typeof DeviceOrientationEvent !== 'undefined') {
      setIsGyroSupported(true);
    }
  }, []);

  // Request device orientation permission (iOS 13+)
  const requestGyroPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
      try {
        // @ts-ignore - iOS specific API
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          enableGyroscope();
        }
      } catch (error) {
        console.warn('Gyroscope permission denied:', error);
      }
    } else {
      // Android or older iOS
      setPermissionGranted(true);
      enableGyroscope();
    }
  };

  const enableGyroscope = () => {
    if (isGyroSupported) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        setGyroData({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });
      };

      window.addEventListener('deviceorientation', handleOrientation);
      setIsGyroActive(true);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  };

  const toggleGyroscope = () => {
    if (isGyroActive) {
      setIsGyroActive(false);
    } else if (permissionGranted) {
      enableGyroscope();
    } else {
      requestGyroPermission();
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
        {/* Mobile VR Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleGyroscope}
            className={`bg-background/80 ${isGyroActive ? 'border-green-500' : 'border-primary'}`}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-background/80 border-primary"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile VR Info */}
        <div className="absolute top-4 left-4 z-10 text-white/80 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Mobile VR Mode</span>
          </div>
          <div className="text-white/60">
            {isGyroActive ? '📱 Gyroscope Active' : '👆 Touch to Look Around'}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-center text-white/60 text-sm">
          <p>
            {isGyroActive 
              ? 'Move your device to look around • Tap gyroscope button to disable'
              : 'Drag to look around • Tap gyroscope button to use device orientation'
            }
          </p>
        </div>

        {/* 3D Canvas optimized for mobile */}
        <Canvas
          camera={{ position: [0, 1.6, 3], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
          performance={{ min: 0.5 }} // Lower performance threshold for mobile
          dpr={Math.min(window.devicePixelRatio, 2)} // Limit pixel ratio for performance
        >
          {/* Optimized lighting for mobile */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight position={[0, 3, 0]} intensity={0.4} color="#FFD700" />

          {/* Environment with lower quality for mobile */}
          <Environment preset="night" />

          {/* Mobile VR Scene */}
          <MobileVRScene memorial={memorial} gyroData={gyroData} isGyroActive={isGyroActive} />

          {/* Fallback orbit controls when gyroscope is disabled */}
          {!isGyroActive && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              autoRotate={false}
              minDistance={2}
              maxDistance={6}
              target={[0, 0, 0]}
              enableDamping={true}
              dampingFactor={0.05}
            />
          )}
        </Canvas>
      </motion.div>
    </AnimatePresence>
  );
};
