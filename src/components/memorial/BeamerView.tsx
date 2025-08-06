import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemorialData } from './MemorialCard';

interface BeamerViewProps {
  memorial: MemorialData;
  onClose: () => void;
}

export const BeamerView: React.FC<BeamerViewProps> = ({ memorial, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const slides = [
    {
      type: 'title',
      content: {
        title: 'In Loving Memory',
        name: memorial.name,
        dates: `${memorial.birthDate} - ${memorial.deathDate}`
      }
    },
    {
      type: 'photo',
      content: {
        image: memorial.photo,
        caption: memorial.name
      }
    },
    {
      type: 'memory',
      content: {
        title: 'Cherished Memories',
        text: memorial.memoryText
      }
    },
    {
      type: 'tribute',
      content: {
        title: 'Forever in Our Hearts',
        quote: '"Those we love never truly leave us. They live on in our hearts and memories forever."'
      }
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'p':
      case 'P':
        setIsPlaying(!isPlaying);
        break;
    }
  }, [nextSlide, prevSlide, isPlaying, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, nextSlide]);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const renderSlide = (slide: typeof slides[0]) => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="text-center">
            <motion.h1 
              className="text-8xl font-bold text-primary mb-8 tracking-wider"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {slide.content.title}
            </motion.h1>
            <motion.h2 
              className="text-6xl font-semibold text-foreground mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {slide.content.name}
            </motion.h2>
            <motion.p 
              className="text-3xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {slide.content.dates}
            </motion.p>
          </div>
        );
      
      case 'photo':
        return (
          <div className="flex flex-col items-center">
            <motion.div 
              className="w-96 h-96 rounded-full overflow-hidden shadow-heavenly border-8 border-primary/50 mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <img 
                src={slide.content.image} 
                alt={slide.content.caption}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.h3 
              className="text-5xl font-semibold text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {slide.content.caption}
            </motion.h3>
          </div>
        );
      
      case 'memory':
        return (
          <div className="text-center max-w-4xl">
            <motion.h2 
              className="text-6xl font-bold text-primary mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {slide.content.title}
            </motion.h2>
            <motion.p 
              className="text-3xl leading-relaxed text-foreground italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              "{slide.content.text}"
            </motion.p>
          </div>
        );
      
      case 'tribute':
        return (
          <div className="text-center max-w-5xl">
            <motion.h2 
              className="text-6xl font-bold text-primary mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {slide.content.title}
            </motion.h2>
            <motion.p 
              className="text-4xl leading-relaxed text-foreground italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {slide.content.quote}
            </motion.p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-memorial opacity-30" />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="absolute top-8 right-8 flex gap-4 z-10">
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
              onClick={() => setIsMuted(!isMuted)}
              className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
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

          {/* Navigation */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="lg"
              onClick={prevSlide}
              className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          </div>
          
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="lg"
              onClick={nextSlide}
              className="bg-background/80 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>

          {/* Slide content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="w-full flex items-center justify-center"
              >
                {renderSlide(slides[currentSlide])}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary' 
                    : 'bg-primary/30 hover:bg-primary/60'
                }`}
              />
            ))}
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 right-8 text-muted-foreground text-lg">
            <p>Use arrow keys or space to navigate • ESC to exit • P to pause</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};