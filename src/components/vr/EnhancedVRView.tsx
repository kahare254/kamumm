import React, { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
// Note: @react-three/xr will be installed separately - using fallback for now
import { OrbitControls, Environment, Text, Sphere, Box } from '@react-three/drei';
import { X, Headphones, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemorialData } from '../memorial/MemorialCard';
import { WebXRManager, VRControllers, VRMovementSystem, VRTeleportation, useVRHardware } from './WebXRManager';
import { MobileVRFallback } from './MobileVRFallback';
import * as THREE from 'three';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

interface EnhancedVRViewProps {
  memorial: MemorialData;
  onClose: () => void;
}

interface VRMemorialGardenProps {
  memorial: MemorialData;
}

const VRMemorialGarden: React.FC<VRMemorialGardenProps> = ({ memorial }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [interactionState, setInteractionState] = useState<'idle' | 'hovering' | 'selected'>('idle');

  // Enhanced 360° floating animation
  React.useEffect(() => {
    const animate = () => {
      if (groupRef.current) {
        const time = Date.now() * 0.001;
        
        // Complex 360° movement pattern
        groupRef.current.position.x = Math.sin(time * 0.3) * 0.5;
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.2 + 1.5;
        groupRef.current.position.z = Math.cos(time * 0.3) * 0.5;
        
        // Gentle rotation on all axes
        groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
        groupRef.current.rotation.y += 0.005;
        groupRef.current.rotation.z = Math.cos(time * 0.15) * 0.05;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <group ref={groupRef}>
      {/* Central Memorial Sphere */}
      <Sphere args={[0.8]} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#FFD700"
          metalness={0.3}
          roughness={0.2}
          transmission={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Memorial Photo */}
      <mesh position={[0, 0, 0.81]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial>
          <primitive object={new THREE.TextureLoader().load(memorial.photo || islamicArchPlaceholder)} />
        </meshBasicMaterial>
      </mesh>

      {/* Floating Name Text */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {memorial.name}
      </Text>

      {/* Date Text */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.15}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        {memorial.birthDate} - {memorial.deathDate}
      </Text>

      {/* Memory Text */}
      {memorial.memoryText && (
        <Text
          position={[0, -1.6, 0]}
          fontSize={0.1}
          color="#DDDDDD"
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
          textAlign="center"
        >
          "{memorial.memoryText}"
        </Text>
      )}

      {/* Orbiting Memory Particles */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 0.5) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
          </mesh>
        );
      })}

      {/* Interactive Memory Boxes */}
      <Box
        args={[0.3, 0.3, 0.3]}
        position={[2, 0, 0]}
        onClick={() => setInteractionState('selected')}
        onPointerOver={() => setInteractionState('hovering')}
        onPointerOut={() => setInteractionState('idle')}
      >
        <meshStandardMaterial
          color={interactionState === 'selected' ? '#00ff00' : interactionState === 'hovering' ? '#ffff00' : '#ff6b6b'}
          emissive={interactionState !== 'idle' ? '#333333' : '#000000'}
        />
      </Box>

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d5a27" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const VRControls: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="absolute top-8 right-8 z-10 flex gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onClose}
        className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
      >
        <X className="w-6 h-6" />
      </Button>
    </div>
  );
};

export const EnhancedVRView: React.FC<EnhancedVRViewProps> = ({ memorial, onClose }) => {
  const [viewMode, setViewMode] = useState<'vr' | 'ar' | 'mobile'>('vr');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const hardware = useVRHardware();

  const handleSessionStart = () => {
    setIsSessionActive(true);
  };

  const handleSessionEnd = () => {
    setIsSessionActive(false);
  };

  // Auto-detect best mode based on hardware
  React.useEffect(() => {
    if (!hardware.isVRSupported && !hardware.isARSupported) {
      setViewMode('mobile');
    } else if (hardware.isARSupported) {
      setViewMode('ar');
    }
  }, [hardware]);

  if (viewMode === 'mobile') {
    return <MobileVRFallback memorial={memorial} onClose={onClose} />;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mode Selection */}
        <div className="absolute top-8 left-8 z-10 flex gap-4">
          <Button
            variant={viewMode === 'vr' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('vr')}
            disabled={!hardware.isVRSupported}
            className="bg-background/80"
          >
            <Headphones className="w-6 h-6 mr-2" />
            VR Mode
          </Button>
          <Button
            variant={viewMode === 'ar' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('ar')}
            disabled={!hardware.isARSupported}
            className="bg-background/80"
          >
            <Monitor className="w-6 h-6 mr-2" />
            AR Mode
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('mobile')}
            className="bg-background/80"
          >
            <Smartphone className="w-6 h-6 mr-2" />
            Mobile VR
          </Button>
        </div>

        <VRControls onClose={onClose} />

        {/* Hardware Info */}
        <div className="absolute bottom-8 left-8 z-10 text-white/80 text-sm">
          <p>Device: {hardware.deviceType}</p>
          <p>VR: {hardware.isVRSupported ? '✓' : '✗'}</p>
          <p>AR: {hardware.isARSupported ? '✓' : '✗'}</p>
        </div>

        {/* 3D Canvas with XR */}
        <Canvas
          camera={{ position: [0, 1.6, 5], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
          <XR
            referenceSpace="local-floor"
            onSessionStart={handleSessionStart}
            onSessionEnd={handleSessionEnd}
          >
            <WebXRManager onSessionStart={handleSessionStart} onSessionEnd={handleSessionEnd}>
              {/* Lighting */}
              <ambientLight intensity={0.3} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={0.8}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
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
              <Suspense fallback={null}>
                <Environment preset="night" />
              </Suspense>

              {/* Memorial Garden */}
              <Suspense fallback={null}>
                <VRMemorialGarden memorial={memorial} />
              </Suspense>

              {/* VR-specific components */}
              {isSessionActive && (
                <>
                  <VRControllers />
                  <VRMovementSystem />
                  <VRTeleportation />
                </>
              )}

              {/* Fallback controls for non-VR mode */}
              {!isSessionActive && (
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  autoRotate={false}
                  minDistance={2}
                  maxDistance={10}
                  target={[0, 0, 0]}
                />
              )}
            </WebXRManager>
          </XR>
        </Canvas>

        {/* XR Buttons */}
        <div className="absolute bottom-8 right-8 z-10 flex gap-4">
          {viewMode === 'vr' && hardware.isVRSupported && (
            <VRButton
              mode="VR"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            />
          )}
          {viewMode === 'ar' && hardware.isARSupported && (
            <ARButton
              mode="AR"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
            />
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 center-8 text-center text-white/60 text-sm">
          <p>Use controllers to move and interact • Point and click to teleport</p>
          <p>Grip buttons for grabbing • Thumbsticks for smooth movement</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
