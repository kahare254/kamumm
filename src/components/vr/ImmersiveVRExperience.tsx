import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Text, 
  Sphere, 
  Box, 
  Plane, 
  Cylinder, 
  useTexture,
  Stars,
  Cloud,
  Sky
} from '@react-three/drei';
import { X, Headphones, Volume2, VolumeX, Settings, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemorialData } from '../memorial/MemorialCard';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';
import * as THREE from 'three';

interface ImmersiveVRExperienceProps {
  memorial: MemorialData;
  onClose: () => void;
}

// Enhanced WebXR hook for VR
const useEnhancedWebXR = () => {
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
      const session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['hand-tracking', 'local-floor', 'bounded-floor']
      });
      
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

// Immersive Memorial Garden Scene
const MemorialGardenScene: React.FC<{ memorial: MemorialData; isVRActive: boolean }> = ({ 
  memorial, 
  isVRActive 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const photoTexture = useTexture(memorial.photo || islamicArchPlaceholder);

  useFrame((state) => {
    if (groupRef.current && !isVRActive) {
      // Gentle floating motion when not in VR
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
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
    <group ref={groupRef}>
      {/* Ground/Floor */}
      <Plane 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        args={[50, 50]}
      >
        <meshStandardMaterial 
          color="#2d5a27" 
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Memorial Garden Base */}
      <Cylinder position={[0, -1.8, 0]} args={[3, 3, 0.4, 16]}>
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.7}
          metalness={0.2}
        />
      </Cylinder>

      {/* Islamic Memorial Gate Structure */}
      <group position={[0, 0, 0]}>
        {/* Left Pillar */}
        <Box position={[-2, 0, 0]} args={[0.4, 4, 0.4]}>
          <meshStandardMaterial 
            color={getMemorialColor()} 
            roughness={0.3}
            metalness={0.7}
          />
        </Box>

        {/* Right Pillar */}
        <Box position={[2, 0, 0]} args={[0.4, 4, 0.4]}>
          <meshStandardMaterial 
            color={getMemorialColor()} 
            roughness={0.3}
            metalness={0.7}
          />
        </Box>

        {/* Arch Top */}
        <Cylinder position={[0, 2, 0]} args={[0.2, 0.2, 4.8, 16]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial 
            color={getMemorialColor()} 
            roughness={0.3}
            metalness={0.7}
          />
        </Cylinder>

        {/* Decorative Islamic Arch */}
        <Cylinder position={[0, 2.3, 0]} args={[0.15, 0.15, 5.2, 16]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial 
            color="#FFD700" 
            roughness={0.2}
            metalness={0.8}
          />
        </Cylinder>

        {/* Memorial Photo */}
        <Plane position={[0, 0.5, 0.21]} args={[2.5, 3]}>
          <meshBasicMaterial 
            map={photoTexture} 
            transparent
            opacity={0.95}
          />
        </Plane>

        {/* Photo Frame */}
        <Box position={[0, 0.5, 0.2]} args={[2.7, 3.2, 0.1]}>
          <meshStandardMaterial 
            color="#FFD700" 
            roughness={0.2}
            metalness={0.8}
          />
        </Box>
      </group>

      {/* Memorial Name - Floating Above */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        font="/fonts/Inter-Bold.woff"
      >
        {memorial.name}
      </Text>

      {/* Dates */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
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
          position={[0, -3, 0]}
          fontSize={0.15}
          color="#DDDDDD"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          "{memorial.memoryText}"
        </Text>
      )}

      {/* GPS Location */}
      {memorial.gpsLocation && (
        <Text
          position={[0, -3.5, 0]}
          fontSize={0.1}
          color="#AAAAAA"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          📍 {memorial.gpsLocation.name}
        </Text>
      )}

      {/* Floating Light Orbs */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 5 + Math.sin(i) * 1;
        const height = Math.sin(i * 3) * 2 + 2;
        return (
          <Sphere
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
            args={[0.1]}
          >
            <meshBasicMaterial 
              color="#FFD700" 
              transparent 
              opacity={0.8}
            />
          </Sphere>
        );
      })}

      {/* Garden Elements */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 8;
        return (
          <group
            key={`tree-${i}`}
            position={[
              Math.cos(angle) * radius,
              -1,
              Math.sin(angle) * radius
            ]}
          >
            {/* Tree Trunk */}
            <Cylinder args={[0.2, 0.3, 2]} position={[0, 1, 0]}>
              <meshStandardMaterial color="#8B4513" />
            </Cylinder>
            {/* Tree Leaves */}
            <Sphere args={[1.5]} position={[0, 3, 0]}>
              <meshStandardMaterial color="#228B22" />
            </Sphere>
          </group>
        );
      })}
    </group>
  );
};

// VR Scene with Controls
const VRSceneWithControls: React.FC<{ 
  memorial: MemorialData; 
  vrSessionRequested: boolean;
  onVRSessionChange: (active: boolean) => void;
}> = ({ memorial, vrSessionRequested, onVRSessionChange }) => {
  const { isSupported, isActive, startVRSession } = useEnhancedWebXR();

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
      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ambient Clouds */}
      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} />
      
      {/* Memorial Garden Scene */}
      <MemorialGardenScene memorial={memorial} isVRActive={isActive} />
      
      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={!isActive}
        autoRotateSpeed={0.3}
        minDistance={3}
        maxDistance={15}
        target={[0, 0, 0]}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

export const ImmersiveVRExperience: React.FC<ImmersiveVRExperienceProps> = ({ 
  memorial, 
  onClose 
}) => {
  const [vrSessionRequested, setVrSessionRequested] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleSpeech = () => {
    if (!speechEnabled) {
      const memoryText = memorial.memoryText || 'Forever in our hearts and memories.';
      const utterance = new SpeechSynthesisUtterance(
        `Welcome to the immersive VR memorial for ${memorial.name}. Born ${memorial.birthDate}, passed away ${memorial.deathDate}. ${memoryText}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
      setSpeechEnabled(true);
      
      setTimeout(() => setSpeechEnabled(false), 10000);
    } else {
      speechSynthesis.cancel();
      setSpeechEnabled(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-900 via-purple-900 to-black"
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
          <Card className="px-4 py-3 bg-card/90 backdrop-blur-md border-primary/20">
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              Immersive VR Memorial: {memorial.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {memorial.birthDate} - {memorial.deathDate}
            </p>
            {isVRActive && (
              <p className="text-xs text-green-400 font-medium mt-1">
                🥽 VR Session Active
              </p>
            )}
          </Card>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
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
        <Canvas
          camera={{ position: [0, 2, 8], fov: 75 }}
          style={{ background: 'transparent' }}
          performance={{ min: 0.5 }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <Suspense fallback={null}>
            {/* Enhanced Lighting */}
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

            {/* VR Scene */}
            <VRSceneWithControls 
              memorial={memorial} 
              vrSessionRequested={vrSessionRequested}
              onVRSessionChange={setIsVRActive}
            />
          </Suspense>
        </Canvas>

        {/* VR Button */}
        <motion.div
          className="absolute bottom-8 right-8 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Button
            onClick={() => setVrSessionRequested(true)}
            disabled={vrSessionRequested}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
          >
            <Headphones className="w-6 h-6 mr-2" />
            {vrSessionRequested ? 'Starting VR...' : 'Enter VR'}
          </Button>
        </motion.div>

        {/* Memorial Information */}
        <motion.div
          className="absolute bottom-8 left-8 z-10"
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
      </motion.div>
    </AnimatePresence>
  );
};
