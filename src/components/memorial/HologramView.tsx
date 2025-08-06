
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box } from '@react-three/drei';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemorialData } from './MemorialCard';
import * as THREE from 'three';

interface HologramViewProps {
  memorial: MemorialData;
  onClose: () => void;
}

const HolographicAvatar: React.FC<{ memorial: MemorialData; animate: boolean }> = ({ 
  memorial, 
  animate 
}) => {
  const avatarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (avatarRef.current && animate) {
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const getAvatarColor = () => {
    switch (memorial.cardType) {
      case 'male': return '#4A90E2';
      case 'female': return '#E24A90';
      case 'child': return '#E2A04A';
      default: return '#DAA520';
    }
  };

  return (
    <group ref={avatarRef}>
      {/* Avatar Head */}
      <Sphere position={[0, 1.5, 0]} args={[0.3]}>
        <meshStandardMaterial 
          color={getAvatarColor()} 
          transparent 
          opacity={0.7}
        />
      </Sphere>
      
      {/* Avatar Body */}
      <Box position={[0, 0.8, 0]} args={[0.5, 1, 0.3]}>
        <meshStandardMaterial 
          color={getAvatarColor()} 
          transparent 
          opacity={0.6}
        />
      </Box>

      {/* Holographic Aura */}
      <Sphere position={[0, 1, 0]} args={[1.5]}>
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
};

export const HologramView: React.FC<HologramViewProps> = ({ memorial, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeech = () => {
    if (!speechEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `In loving memory of ${memorial.name}. ${memorial.memoryText}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
      setSpeechEnabled(true);
    } else {
      speechSynthesis.cancel();
      setSpeechEnabled(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-background/95 to-card/95 backdrop-blur border-primary/30">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-primary/20">
              <h2 className="text-xl font-semibold text-primary">
                Holographic Memorial
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSpeech}
                  className="text-primary hover:text-primary-foreground hover:bg-primary"
                >
                  {speechEnabled ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-primary hover:text-primary-foreground hover:bg-primary"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Hologram Display */}
            <div className="h-96 bg-gradient-to-b from-primary/5 to-transparent relative">
              <Canvas
                camera={{ position: [0, 2, 5], fov: 60 }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.3} />
                <directionalLight 
                  position={[5, 5, 5]} 
                  intensity={0.6} 
                  color="#FFD700" 
                />
                <pointLight 
                  position={[0, 3, 0]} 
                  intensity={0.8} 
                  color="#DAA520" 
                  distance={8} 
                />
                
                <HolographicAvatar memorial={memorial} animate={isPlaying} />
                
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  autoRotate={isPlaying}
                  autoRotateSpeed={1}
                  minDistance={3}
                  maxDistance={8}
                />
              </Canvas>

              {/* Hologram scanlines effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                    style={{ top: `${i * 5}%` }}
                    animate={{
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Memorial Information */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-primary mb-2">
                {memorial.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {memorial.birthDate} - {memorial.deathDate}
              </p>
              <p className="text-sm memorial-text italic">
                {memorial.memoryText}
              </p>
              
              {memorial.gpsLocation && (
                <p className="text-xs text-muted-foreground mt-4">
                  Remembered at: {memorial.gpsLocation.name}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 p-4 border-t border-primary/20">
              <Button
                variant="outline"
                onClick={handlePlayPause}
                className="bg-primary/10 border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {isPlaying ? 'Pause' : 'Play'} Animation
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
