import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Heart, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemorialData } from '../memorial/MemorialCard';

interface CSS3DVRProps {
  memorial: MemorialData;
  onClose: () => void;
}

export const CSS3DVR: React.FC<CSS3DVRProps> = ({ memorial, onClose }) => {
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showOrbs, setShowOrbs] = useState(true);

  // Auto-rotate the memorial
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

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

  const memoryOrbs = [
    { name: "Love", color: "bg-pink-500", icon: "💖", position: "top-1/4 left-1/4" },
    { name: "Joy", color: "bg-blue-500", icon: "😊", position: "top-1/4 right-1/4" },
    { name: "Hope", color: "bg-yellow-500", icon: "⭐", position: "bottom-1/4 left-1/4" },
    { name: "Peace", color: "bg-green-500", icon: "🕊️", position: "bottom-1/4 right-1/4" }
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-900 via-purple-900 to-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated stars background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

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
              CSS 3D VR Experience - Compatible with all browsers
            </p>
          </Card>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowOrbs(!showOrbs)}
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

        {/* 3D Memorial Scene using CSS transforms */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
          <motion.div
            className="relative"
            style={{
              transform: `rotateY(${rotation}deg) rotateX(10deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Sacred Geometry Memorial Base */}
            <motion.div
              className="relative w-64 h-64 mx-auto"
              initial={{ scale: 0, rotateY: 0 }}
              animate={{ scale: 1, rotateY: rotation }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Hexagonal base */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800 transform rotate-45 rounded-lg shadow-2xl border-4 border-amber-400/30">
                <div className="absolute inset-4 bg-gradient-to-br from-amber-700 to-amber-900 rounded border-2 border-amber-300/20">
                  <div className="absolute inset-2 bg-gradient-to-br from-amber-800 to-amber-950 rounded flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🏛️</div>
                      <div className="text-lg font-bold">{memorial.name}</div>
                      <div className="text-sm opacity-80">{memorial.birthDate} - {memorial.deathDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Memory Orbs floating around */}
            {showOrbs && memoryOrbs.map((orb, i) => (
              <motion.div
                key={i}
                className={`absolute w-16 h-16 ${orb.color} rounded-full shadow-lg border-2 border-white/30 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform`}
                style={{
                  transform: `translate3d(${Math.cos(rotation * 0.02 + i * Math.PI / 2) * 200}px, ${Math.sin(rotation * 0.01 + i) * 50 - 100}px, ${Math.sin(rotation * 0.02 + i * Math.PI / 2) * 100}px)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 + i * 0.2 }}
                whileHover={{ scale: 1.2 }}
                title={orb.name}
              >
                {orb.icon}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Memorial Text */}
        <motion.div
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Card className="p-6 bg-card/90 backdrop-blur-md border border-primary/20 text-center">
            <p className="text-foreground/90 italic text-lg leading-relaxed">
              "{memorial.memoryText}"
            </p>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Card className="px-6 py-3 bg-card/90 backdrop-blur-md border border-primary/20">
            <p className="text-sm text-muted-foreground text-center flex items-center gap-4">
              <Sparkles className="w-4 h-4" />
              CSS 3D VR Memorial Garden - Auto-rotating 360° experience
              <Sparkles className="w-4 h-4" />
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
