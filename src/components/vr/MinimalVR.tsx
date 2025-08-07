import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemorialData } from '../memorial/MemorialCard';

interface MinimalVRProps {
  memorial: MemorialData;
  onClose: () => void;
}

// Simple 3D scene with just basic shapes
const MinimalScene: React.FC<{ memorial: MemorialData }> = ({ memorial }) => {
  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {/* Memorial base - simple box */}
      <Box position={[0, 0, 0]} args={[3, 0.2, 3]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Memorial name text */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
      >
        {memorial.name}
      </Text>
      
      {/* Memory orbs as simple spheres */}
      <Box position={[2, 1, 2]} args={[0.3, 0.3, 0.3]}>
        <meshStandardMaterial color="#FF69B4" emissive="#FF69B4" emissiveIntensity={0.2} />
      </Box>
      <Box position={[-2, 1, 2]} args={[0.3, 0.3, 0.3]}>
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.2} />
      </Box>
      <Box position={[2, 1, -2]} args={[0.3, 0.3, 0.3]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </Box>
      <Box position={[-2, 1, -2]} args={[0.3, 0.3, 0.3]}>
        <meshStandardMaterial color="#98FB98" emissive="#98FB98" emissiveIntensity={0.2} />
      </Box>
      
      {/* Simple orbit controls */}
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        autoRotate={true}
        autoRotateSpeed={1}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
};

export const MinimalVR: React.FC<MinimalVRProps> = ({ memorial, onClose }) => {
  const handleSpeech = () => {
    try {
      const memoryText = memorial.memoryText || 'Forever in our hearts and memories.';
      const utterance = new SpeechSynthesisUtterance(
        `In loving memory of ${memorial.name}. ${memoryText}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech error:', error);
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
            <h2 className="text-lg font-semibold text-primary">
              🏛️ Minimal VR Memorial: {memorial.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Basic 3D memorial garden (testing version)
            </p>
          </Card>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSpeech}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              <Volume2 className="w-4 h-4" />
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

        {/* 3D Canvas - Minimal version */}
        <Canvas
          camera={{ position: [0, 3, 8], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <MinimalScene memorial={memorial} />
          </Suspense>
        </Canvas>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Card className="px-6 py-3 bg-card/90 backdrop-blur-md border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              🖱️ Drag to explore • 🔍 Scroll to zoom • 🔄 Auto-rotating memorial
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
