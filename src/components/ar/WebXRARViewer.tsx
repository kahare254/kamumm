import React, { useState, useRef, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Sphere, Box, Plane, useTexture } from '@react-three/drei';
import { X, Camera, Volume2, VolumeX, Settings, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemorialData } from '../memorial/MemorialCard';
import * as THREE from 'three';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

interface WebXRARViewerProps {
  memorial: MemorialData;
  onClose: () => void;
}

// AR Memorial Scene Component
const ARMemorialScene: React.FC<{ memorial: MemorialData; isARActive: boolean }> = ({ 
  memorial, 
  isARActive 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const photoTexture = useTexture(memorial.photo || islamicArchPlaceholder);

  useFrame((state) => {
    if (groupRef.current && !isARActive) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const getMemorialColor = () => {
    switch (memorial.cardType) {
      case 'male': return '#4A90E2';
      case 'female': return '#E24A90';
      case 'child': return '#E2A04A';
      default: return '#DAA520';
    }
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Memorial Base */}
      <Box position={[0, -0.5, 0]} args={[2, 0.2, 2]}>
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.8}
          metalness={0.1}
        />
      </Box>

      {/* Memorial Gate/Arch */}
      <group position={[0, 0.5, 0]}>
        {/* Left Pillar */}
        <Box position={[-0.8, 0, 0]} args={[0.2, 2, 0.2]}>
          <meshStandardMaterial 
            color={getMemorialColor()} 
            roughness={0.3}
            metalness={0.7}
          />
        </Box>

        {/* Right Pillar */}
        <Box position={[0.8, 0, 0]} args={[0.2, 2, 0.2]}>
          <meshStandardMaterial 
            color={getMemorialColor()} 
            roughness={0.3}
            metalness={0.7}
          />
        </Box>

        {/* Top Arch */}
        <Box position={[0, 1, 0]} args={[1.8, 0.2, 0.2]}>
          <meshStandardMaterial 
            color={getMemorialColor()} 
            roughness={0.3}
            metalness={0.7}
          />
        </Box>

        {/* Memorial Photo */}
        <Plane position={[0, 0.3, 0.11]} args={[1, 1.2]}>
          <meshBasicMaterial 
            map={photoTexture} 
            transparent
            opacity={0.9}
          />
        </Plane>

        {/* Holographic Aura */}
        <Sphere position={[0, 0.5, 0]} args={[1.5]}>
          <meshBasicMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </Sphere>
      </group>

      {/* Floating Name Text */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {memorial.name}
      </Text>

      {/* Dates Text */}
      <Text
        position={[0, -0.8, 0]}
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
          position={[0, -1.2, 0]}
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

      {/* Ambient Particles */}
      {[...Array(20)].map((_, i) => (
        <Sphere
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            Math.random() * 4,
            (Math.random() - 0.5) * 6
          ]}
          args={[0.02]}
        >
          <meshBasicMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  );
};

// Loading Component
const ARLoadingScreen: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="text-center text-white">
      <div className="relative mb-4">
        <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <div className="absolute inset-0 animate-pulse">
          <div className="w-10 h-10 bg-primary/30 rounded-full mx-auto mt-3"></div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Initializing AR Memorial</h3>
      <p className="text-sm text-white/70">Preparing immersive experience...</p>
    </div>
  </div>
);

export const WebXRARViewer: React.FC<WebXRARViewerProps> = ({ memorial, onClose }) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check for WebXR AR support
    if ('xr' in navigator) {
      // @ts-ignore
      navigator.xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setIsARSupported(supported);
        setIsLoading(false);
      }).catch(() => {
        setIsARSupported(false);
        setIsLoading(false);
      });
    } else {
      setIsARSupported(false);
      setIsLoading(false);
    }
  }, []);

  const handleSpeech = () => {
    if (!speechEnabled) {
      const memoryText = memorial.memoryText || 'Forever in our hearts and memories.';
      const utterance = new SpeechSynthesisUtterance(
        `Welcome to the AR memorial for ${memorial.name}. ${memoryText}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
      setSpeechEnabled(true);
      
      utterance.onend = () => setSpeechEnabled(false);
    } else {
      speechSynthesis.cancel();
      setSpeechEnabled(false);
    }
  };

  const startARSession = async () => {
    if (!isARSupported) return;
    
    try {
      setIsARActive(true);
      // WebXR AR session logic would go here
      // This is a placeholder for actual WebXR implementation
    } catch (error) {
      console.error('Failed to start AR session:', error);
      setIsARActive(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ARLoadingScreen />
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-br from-black/95 via-primary/5 to-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header Controls */}
        <motion.div 
          className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Card className="px-4 py-3 bg-card/90 backdrop-blur-md border-primary/20">
              <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Camera className="w-5 h-5" />
                WebXR AR Memorial: {memorial.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {memorial.birthDate} - {memorial.deathDate}
              </p>
              {isARActive && (
                <p className="text-xs text-green-400 font-medium mt-1">
                  🌟 AR Session Active
                </p>
              )}
            </Card>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSpeech}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              {speechEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* 3D Canvas */}
        <div className="w-full h-full">
          <Canvas
            camera={{ position: [0, 2, 5], fov: 75 }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              {/* Lighting */}
              <ambientLight intensity={0.4} />
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
              <Environment preset="night" />

              {/* Memorial Scene */}
              <ARMemorialScene memorial={memorial} isARActive={isARActive} />

              {/* Controls */}
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={!isARActive}
                autoRotateSpeed={0.5}
                minDistance={3}
                maxDistance={10}
                maxPolarAngle={Math.PI / 2}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* AR Controls */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-4">
            {isARSupported ? (
              <Button
                onClick={startARSession}
                disabled={isARActive}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
              >
                {isARActive ? '🌟 AR Active' : '🚀 Start AR Experience'}
              </Button>
            ) : (
              <Card className="px-6 py-3 bg-card/90 backdrop-blur-md border-yellow-500/50">
                <p className="text-sm text-yellow-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  AR not supported on this device. Enjoy the 3D view!
                </p>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Memorial Information */}
        <motion.div
          className="absolute bottom-4 left-4 z-10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 bg-card/90 backdrop-blur-md border border-primary/20 shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold text-primary mb-2">{memorial.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {memorial.birthDate} - {memorial.deathDate}
            </p>
            {memorial.memoryText && (
              <p className="text-sm italic text-foreground/80 mb-3">
                "{memorial.memoryText}"
              </p>
            )}
            {memorial.gpsLocation && (
              <p className="text-xs text-muted-foreground">
                📍 {memorial.gpsLocation.name}
              </p>
            )}
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="absolute top-20 left-4 z-10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Card className="p-4 bg-card/90 backdrop-blur-md border border-primary/20 shadow-lg max-w-md">
            <h4 className="font-semibold text-primary mb-2">WebXR AR Instructions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>🖱️ Drag to rotate the memorial in 3D</li>
              <li>🔍 Scroll to zoom in and out</li>
              <li>🚀 Click "Start AR" for immersive experience</li>
              <li>📱 Move your device to explore in AR</li>
              <li>🎵 Use audio button for narration</li>
            </ul>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
