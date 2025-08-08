import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Monitor, Presentation, Settings, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemorialData } from '../memorial/MemorialCard';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

interface EnhancedBeamerViewProps {
  memorial: MemorialData;
  onClose: () => void;
}

interface BeamerSettings {
  resolution: '720p' | '1080p';
  brightness: number;
  contrast: number;
  displayMode: 'slideshow' | 'reflection' | 'presentation';
  autoAdvance: boolean;
  slideInterval: number;
}

export const EnhancedBeamerView: React.FC<EnhancedBeamerViewProps> = ({ memorial, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<BeamerSettings>({
    resolution: '1080p',
    brightness: 100,
    contrast: 100,
    displayMode: 'slideshow',
    autoAdvance: true,
    slideInterval: 5000
  });

  // Projector-optimized slides with high contrast and large text
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
        image: memorial.photo_path || islamicArchPlaceholder,
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
    },
    {
      type: 'reflection',
      content: {
        title: 'A Moment of Reflection',
        subtitle: 'Please take a moment to remember and honor',
        name: memorial.name
      }
    }
  ];

  // Fullscreen API handling
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.warn('Fullscreen request failed:', error);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.warn('Exit fullscreen failed:', error);
      }
    }
  }, []);

  // Detect projector/external display
  const detectProjector = useCallback(() => {
    // Check for multiple screens (projector setup)
    if ('screen' in window && window.screen) {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      
      // Common projector resolutions
      if ((screenWidth === 1280 && screenHeight === 720) || 
          (screenWidth === 1920 && screenHeight === 1080)) {
        return true;
      }
    }
    return false;
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
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
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 's':
      case 'S':
        setShowSettings(!showSettings);
        break;
    }
  }, [nextSlide, prevSlide, isPlaying, onClose, toggleFullscreen, showSettings]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isPlaying && settings.autoAdvance) {
      const interval = setInterval(nextSlide, settings.slideInterval);
      return () => clearInterval(interval);
    }
  }, [isPlaying, nextSlide, settings.autoAdvance, settings.slideInterval]);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    
    // Auto-detect projector and optimize settings
    if (detectProjector()) {
      setSettings(prev => ({ ...prev, brightness: 120, contrast: 110 }));
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [detectProjector]);

  // Projector-optimized rendering function
  const renderSlide = (slide: typeof slides[0]) => {
    const baseStyle = {
      filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`,
      fontSize: settings.resolution === '1080p' ? '1em' : '0.8em'
    };

    switch (slide.type) {
      case 'title':
        return (
          <div className="text-center" style={baseStyle}>
            <motion.h1 
              className={`font-bold text-white mb-8 tracking-wider ${
                settings.resolution === '1080p' ? 'text-9xl' : 'text-7xl'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {slide.content.title}
            </motion.h1>
            <motion.h2 
              className={`font-semibold text-yellow-300 mb-6 ${
                settings.resolution === '1080p' ? 'text-7xl' : 'text-5xl'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {slide.content.name}
            </motion.h2>
            <motion.p 
              className={`text-gray-200 ${
                settings.resolution === '1080p' ? 'text-4xl' : 'text-3xl'
              }`}
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
          <div className="flex flex-col items-center" style={baseStyle}>
            <motion.div 
              className={`rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-400 mb-8 ${
                settings.resolution === '1080p' ? 'w-96 h-96' : 'w-80 h-80'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <img 
                src={slide.content.image} 
                alt={slide.content.caption}
                className="w-full h-full object-cover"
                style={{ filter: `brightness(${Math.min(settings.brightness + 10, 150)}%) contrast(${Math.min(settings.contrast + 5, 150)}%)` }}
              />
            </motion.div>
            <motion.h3 
              className={`font-semibold text-yellow-300 ${
                settings.resolution === '1080p' ? 'text-6xl' : 'text-5xl'
              }`}
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
          <div className="text-center max-w-5xl" style={baseStyle}>
            <motion.h2 
              className={`font-bold text-white mb-12 ${
                settings.resolution === '1080p' ? 'text-7xl' : 'text-6xl'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {slide.content.title}
            </motion.h2>
            <motion.p 
              className={`leading-relaxed text-gray-200 italic ${
                settings.resolution === '1080p' ? 'text-4xl' : 'text-3xl'
              }`}
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
          <div className="text-center max-w-6xl" style={baseStyle}>
            <motion.h2 
              className={`font-bold text-white mb-12 ${
                settings.resolution === '1080p' ? 'text-7xl' : 'text-6xl'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {slide.content.title}
            </motion.h2>
            <motion.p 
              className={`leading-relaxed text-gray-200 italic ${
                settings.resolution === '1080p' ? 'text-5xl' : 'text-4xl'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {slide.content.quote}
            </motion.p>
          </div>
        );

      case 'reflection':
        return (
          <div className="text-center" style={baseStyle}>
            <motion.h2 
              className={`font-bold text-white mb-8 ${
                settings.resolution === '1080p' ? 'text-8xl' : 'text-6xl'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {slide.content.title}
            </motion.h2>
            <motion.p 
              className={`text-gray-300 mb-12 ${
                settings.resolution === '1080p' ? 'text-4xl' : 'text-3xl'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {slide.content.subtitle}
            </motion.p>
            <motion.h3 
              className={`font-semibold text-yellow-300 ${
                settings.resolution === '1080p' ? 'text-7xl' : 'text-5xl'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {slide.content.name}
            </motion.h3>
            {/* Reflection pause indicator */}
            <motion.div
              className="mt-16 w-32 h-1 bg-white/30 mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 10, delay: 1 }}
            />
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
          ref={containerRef}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* High contrast background optimized for projectors */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
          
          {/* Projector-optimized particle effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-yellow-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -60, -20],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Controls - hidden in fullscreen mode */}
          {!isFullscreen && (
            <>
              <div className="absolute top-8 right-8 flex gap-4 z-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-black/80 border-white/30 text-white hover:bg-white/20"
                >
                  <Settings className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleFullscreen}
                  className="bg-black/80 border-white/30 text-white hover:bg-white/20"
                >
                  <Maximize className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/80 border-white/30 text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                  className="bg-black/80 border-white/30 text-white hover:bg-white/20"
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
                  className="bg-black/80 border-white/30 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
              </div>
              
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={nextSlide}
                  className="bg-black/80 border-white/30 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </div>
            </>
          )}

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

          {/* Slide indicators - hidden in fullscreen */}
          {!isFullscreen && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-yellow-400' 
                      : 'bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && !isFullscreen && (
            <motion.div
              className="absolute top-20 right-8 z-20 bg-black/90 border border-white/30 rounded-lg p-6 text-white min-w-[300px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Beamer Settings</h3>

              {/* Display Mode */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Display Mode</label>
                <div className="flex gap-2">
                  {(['slideshow', 'reflection', 'presentation'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettings(prev => ({ ...prev, displayMode: mode }))}
                      className={`px-3 py-1 rounded text-sm capitalize ${
                        settings.displayMode === mode
                          ? 'bg-yellow-400 text-black'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Resolution</label>
                <div className="flex gap-2">
                  {(['720p', '1080p'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setSettings(prev => ({ ...prev, resolution: res }))}
                      className={`px-3 py-1 rounded text-sm ${
                        settings.resolution === res
                          ? 'bg-yellow-400 text-black'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Advance */}
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.autoAdvance}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoAdvance: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Auto advance slides</span>
                </label>
              </div>

              {/* Slide Interval */}
              {settings.autoAdvance && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Slide Interval: {settings.slideInterval / 1000}s
                  </label>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="1000"
                    value={settings.slideInterval}
                    onChange={(e) => setSettings(prev => ({ ...prev, slideInterval: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Brightness */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Brightness: {settings.brightness}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.brightness}
                  onChange={(e) => setSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Contrast: {settings.contrast}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.contrast}
                  onChange={(e) => setSettings(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <Button
                onClick={() => setShowSettings(false)}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
              >
                Close Settings
              </Button>
            </motion.div>
          )}

          {/* Projector-optimized instructions */}
          {!isFullscreen && (
            <div className="absolute bottom-8 right-8 text-white/60 text-lg">
              <p>F for fullscreen • Space/Arrows to navigate • ESC to exit • S for settings</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
