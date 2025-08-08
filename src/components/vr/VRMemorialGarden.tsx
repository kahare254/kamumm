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
  Sky,
  Float,
  MeshWobbleMaterial,
  Sparkles
} from '@react-three/drei';
import { GLBMemorialModel } from '../ar/GLBMemorialModel';
import { X, Headphones, Volume2, VolumeX, Eye, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemorialData } from '../memorial/MemorialCard';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';
import * as THREE from 'three';

// Helper function to calculate age from birth and death dates
function calculateAge(birthDate: string, deathDate: string): number {
  const birth = new Date(birthDate);
  const death = new Date(deathDate);
  let age = death.getFullYear() - birth.getFullYear();
  const m = death.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && death.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

interface VRMemorialGardenProps {
  memorial: MemorialData;
  onClose: () => void;
}

// Floating Memory Orbs
const MemoryOrb: React.FC<{ position: [number, number, number]; color: string; text: string }> = ({ 
  position, 
  color, 
  text 
}) => {
  const orbRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere
          ref={orbRef}
          args={[0.3]}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <MeshWobbleMaterial
            color={color}
            transparent
            opacity={0.8}
            factor={0.6}
            speed={2}
          />
        </Sphere>
        
        {hovered && (
          <Text
            position={[0, 1, 0]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {text}
          </Text>
        )}
      </Float>
    </group>
  );
};

// Sacred Geometry Memorial
const SacredGeometryMemorial: React.FC<{ memorial: MemorialData }> = ({ memorial }) => {
  const groupRef = useRef<THREE.Group>(null);
const [photoTexture, setPhotoTexture] = useState<THREE.Texture | null>(null);

        useEffect(() => {
          const loader = new THREE.TextureLoader();

          if (memorial.photo_path) {
            loader.load(
              memorial.photo_path,
              (texture) => setPhotoTexture(texture),
              undefined,
              (err) => {
                console.error('Failed to load memorial photo, using fallback.', err);
                loader.load(islamicArchPlaceholder, setPhotoTexture);
              }
            );
          } else {
            loader.load(islamicArchPlaceholder, setPhotoTexture);
          }
        }, [memorial.photo_path]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
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
      {/* Sacred Geometry Base */}
      <group position={[0, -1, 0]}>
        {/* Hexagonal Base */}
        <Cylinder args={[3, 3, 0.2, 6]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.6}
            metalness={0.3}
          />
        </Cylinder>
        
        {/* Inner Sacred Circle */}
        <Cylinder args={[2.5, 2.5, 0.25, 32]} position={[0, 0.1, 0]}>
          <meshStandardMaterial 
            color={getMemorialColor()} 
            roughness={0.3}
            metalness={0.7}
          />
        </Cylinder>
      </group>

      {/* Memorial Pillars in Sacred Formation */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2.5;
        return (
          <Box
            key={i}
            position={[
              Math.cos(angle) * radius,
              1,
              Math.sin(angle) * radius
            ]}
            args={[0.2, 3, 0.2]}
          >
            <meshStandardMaterial 
              color={getMemorialColor()} 
              roughness={0.3}
              metalness={0.7}
            />
          </Box>
        );
      })}

      {/* Central Memorial Shrine */}
      <group position={[0, 0, 0]}>
        {/* Main Structure */}
        <Box position={[0, 1.5, 0]} args={[1.5, 3, 0.3]}>
          <meshStandardMaterial 
            color="#2C1810" 
            roughness={0.8}
            metalness={0.1}
          />
        </Box>

       {/* Memorial Photo */}
        {photoTexture && (
          <Plane position={[0, 1.5, 0.16]} args={[1.2, 1.8]}>
            <meshBasicMaterial 
              map={photoTexture} 
              transparent
              opacity={0.95}
            />
          </Plane>
        )}


        {/* Golden Frame */}
        <Box position={[0, 1.5, 0.15]} args={[1.3, 1.9, 0.05]}>
          <meshStandardMaterial 
            color="#FFD700" 
            roughness={0.2}
            metalness={0.8}
          />
        </Box>

        {/* Crown/Top Decoration */}
        <Cylinder position={[0, 3.2, 0]} args={[0.8, 0.6, 0.4, 8]}>
          <meshStandardMaterial 
            color="#FFD700" 
            roughness={0.2}
            metalness={0.8}
          />
        </Cylinder>
      </group>

      {/* Floating Name */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          font="/fonts/Inter-Bold.woff"
        >
          {memorial.name}
        </Text>
      </Float>

      {/* Dates with Life Span Display */}
      <group position={[0, -1.8, 0]}>
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {memorial.birthDate} - {memorial.deathDate}
        </Text>
        
        {memorial.birthDate && memorial.deathDate && (
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {`${calculateAge(memorial.birthDate, memorial.deathDate)} years of beautiful life`}
          </Text>
        )}
      </group>

      {/* Memory Text with Decorative Elements */}
      {memorial.memoryText && (
        <group position={[0, -2.5, 0]}>
          {/* Decorative Line */}
          <Box position={[0, 0.3, 0]} args={[4, 0.02, 0.01]}>  
            <meshStandardMaterial color="#FFD700" />  
          </Box>
          
          <Text
            position={[0, 0, 0]}
            fontSize={0.18}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            maxWidth={8}
            textAlign="center"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            "{memorial.memoryText}"
          </Text>
          
          {/* Decorative Line */}
          <Box position={[0, -0.3, 0]} args={[4, 0.02, 0.01]}>  
            <meshStandardMaterial color="#FFD700" />  
          </Box>
        </group>
      )}

      {/* Sparkles Effect */}
      <Sparkles
        count={100}
        scale={[10, 10, 10]}
        size={3}
        speed={0.4}
        opacity={0.6}
        color="#FFD700"
      />
    </group>
  );
};

// Immersive Garden Environment
const GardenEnvironment: React.FC = () => {
  return (
    <>
      {/* Ground */}
      <Plane 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        args={[100, 100]}
      >
        <meshStandardMaterial 
          color="#1a4d1a" 
          roughness={0.9}
          metalness={0.1}
        />
      </Plane>

      {/* Mystical Trees */}
      {[...Array(25)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 15 + Math.random() * 10;
        return (
          <group
            key={`mystical-tree-${i}`}
            position={[
              Math.cos(angle) * radius,
              -1,
              Math.sin(angle) * radius
            ]}
          >
            {/* Trunk */}
            <Cylinder args={[0.3, 0.5, 4]} position={[0, 2, 0]}>
              <meshStandardMaterial color="#4A4A4A" />
            </Cylinder>
            
            {/* Mystical Leaves */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
              <Sphere args={[2]} position={[0, 5, 0]}>
                <MeshWobbleMaterial
                  color="#228B22"
                  factor={0.3}
                  speed={1}
                />
              </Sphere>
            </Float>
            
            {/* Tree Light */}
            <pointLight
              position={[0, 5, 0]}
              intensity={0.3}
              color="#90EE90"
              distance={10}
            />
          </group>
        );
      })}

      {/* Floating Islands */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 25;
        const height = 8 + Math.sin(i) * 3;
        return (
          <Float key={`island-${i}`} speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group
              position={[
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
              ]}
            >
              <Sphere args={[3]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#654321" />
              </Sphere>
              <Cylinder args={[2.5, 2.5, 0.5]} position={[0, 3, 0]}>
                <meshStandardMaterial color="#228B22" />
              </Cylinder>
            </group>
          </Float>
        );
      })}
    </>
  );
};

export const VRMemorialGarden: React.FC<VRMemorialGardenProps> = ({ memorial, onClose }) => {
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showMemoryOrbs, setShowMemoryOrbs] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleSpeech = () => {
    try {
      if (!speechEnabled) {
        const memoryText = memorial.memoryText || 'Forever in our hearts and memories.';
        const utterance = new SpeechSynthesisUtterance(
          `Welcome to the sacred memorial garden for ${memorial.name}. Born ${memorial.birthDate}, passed away ${memorial.deathDate}. ${memoryText} May their memory be a blessing.`
        );
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
        setSpeechEnabled(true);

        setTimeout(() => setSpeechEnabled(false), 15000);
      } else {
        speechSynthesis.cancel();
        setSpeechEnabled(false);
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  const memoryOrbs = memorial.memoryText
    ? memorial.memoryText.split(/[.!?]+/).filter(s => s.trim().length > 0).flatMap((sentence, i) => 
        Array.from({ length: 3 }).map((_, j) => {
          const angle = (i * 3 + j) / 15 * Math.PI * 2;
          const radius = 4 + Math.random() * 6;
          return {
            position: [Math.cos(angle) * radius, 2 + Math.random() * 4, Math.sin(angle) * radius] as [number, number, number],
            color: ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98', '#FFA07A', '#BA55D3', '#ADD8E6', '#F0E68C'][ (i * 3 + j) % 8],
            text: sentence.trim(),
          };
        })
      )
    : [
        { position: [4, 3, 2] as [number, number, number], color: "#FF69B4", text: "Love" },
        { position: [-3, 4, -1] as [number, number, number], color: "#87CEEB", text: "Joy" },
        { position: [2, 5, -4] as [number, number, number], color: "#FFD700", text: "Hope" },
        { position: [-4, 3, 3] as [number, number, number], color: "#98FB98", text: "Peace" },
        { position: [5, 4, -3] as [number, number, number], color: "#FFA07A", text: "Courage" },
        { position: [-5, 5, 2] as [number, number, number], color: "#BA55D3", text: "Wisdom" },
      ];

  // Error fallback component
  if (hasError) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className="p-8 bg-card/90 backdrop-blur-md border border-primary/20 max-w-md mx-auto">
            <div className="text-center space-y-4">
              <div className="text-4xl">⚠️</div>
              <h3 className="text-xl font-semibold text-primary">VR Experience Error</h3>
              <p className="text-muted-foreground">
                The 3D VR experience encountered an error. Please try refreshing the page.
              </p>
              <Button onClick={onClose} className="mt-4">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

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
              <Heart className="w-5 h-5" />
              Sacred Memorial Garden: {memorial.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              A place of eternal remembrance and peace
            </p>
          </Card>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowMemoryOrbs(!showMemoryOrbs)}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              <Star className="w-4 h-4" />
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
              onClick={onClose}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* 3D Canvas */}
        <div
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%' }}
        >
          <Canvas
            camera={{ position: [0, 5, 12], fov: 75 }}
            style={{ background: 'transparent' }}
            performance={{ min: 0.5 }}
            dpr={Math.min(window.devicePixelRatio, 2)}
            onCreated={({ gl }) => {
              try {
                gl.setSize(window.innerWidth, window.innerHeight);
              } catch (error) {
                console.error('Canvas creation error:', error);
                setHasError(true);
              }
            }}
          >
            <Suspense fallback={null}>
              {/* Environment */}
              <Sky sunPosition={[100, 20, 100]} />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <Environment preset="night" />
              <fog attach="fog" args={['#2a2a3a', 10, 60]} />

              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={0.6}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[0, 8, 0]} intensity={1} color="#FFD700" />

              {/* Garden Environment */}
              <GardenEnvironment />

              {/* Sacred Memorial */}
              {memorial.arAnimationUrl ? (
                <GLBMemorialModel memorial={memorial} />
              ) : (
                <SacredGeometryMemorial memorial={memorial} />
              )}

              {/* Memory Orbs */}
              {showMemoryOrbs && memoryOrbs.map((orb, i) => (
                <MemoryOrb
                  key={i}
                  position={orb.position}
                  color={orb.color}
                  text={orb.text}
                />
              ))}

              {/* Controls */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                autoRotate={true}
                autoRotateSpeed={0.2}
                minDistance={5}
                maxDistance={25}
                target={[0, 2, 0]}
                enableDamping={true}
                dampingFactor={0.05}
                maxPolarAngle={Math.PI / 2.2}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Card className="px-6 py-3 bg-card/90 backdrop-blur-md border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              🖱️ Drag to explore • 🔍 Scroll to zoom • ⭐ Hover over memory orbs • 🎵 Click audio for narration
            </p>
          </Card>
        </motion.div>

        {/* Memorial Info */}
        <motion.div
          className="absolute bottom-8 right-8 z-10"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 bg-card/90 backdrop-blur-md border border-primary/20 shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold text-primary mb-2">{memorial.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {memorial.birthDate} - {memorial.deathDate}
            </p>
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
