import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemorialData } from '../memorial/MemorialCard';

interface SimpleVRTestProps {
  memorial: MemorialData;
  onClose: () => void;
}

const SimpleScene: React.FC<{ memorial: MemorialData }> = ({ memorial }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* Simple memorial box */}
      <Box position={[0, 0, 0]} args={[2, 3, 0.2]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Memorial name */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {memorial.name}
      </Text>
      
      {/* Simple memory orbs */}
      <Box position={[3, 2, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#FF69B4" />
      </Box>
      <Box position={[-3, 2, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box position={[0, 4, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
      <Box position={[0, -1, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#98FB98" />
      </Box>
      
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
};

export const SimpleVRTest: React.FC<SimpleVRTestProps> = ({ memorial, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close button */}
        <motion.div
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 2, 8], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
          <Suspense fallback={null}>
            <SimpleScene memorial={memorial} />
          </Suspense>
        </Canvas>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="px-6 py-3 bg-card/90 backdrop-blur-md border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              🖱️ Drag to explore • 🔍 Scroll to zoom • Simple VR Test
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
