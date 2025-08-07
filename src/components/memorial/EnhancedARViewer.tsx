import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Camera, Volume2, VolumeX, Settings, Info, RotateCcw, ZoomIn, ZoomOut, Smartphone, Monitor } from 'lucide-react';
import { MemorialData } from './MemorialCard';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

interface EnhancedARViewerProps {
  memorial: MemorialData;
  onClose: () => void;
}

interface ARSettings {
  autoRotate: boolean;
  showInstructions: boolean;
  enableAudio: boolean;
  cameraControls: boolean;
  environmentLighting: 'neutral' | 'city' | 'forest' | 'studio';
  arScale: 'auto' | 'fixed';
}

export const EnhancedARViewer: React.FC<EnhancedARViewerProps> = ({ memorial, onClose }) => {
  const modelViewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isARActive, setIsARActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ARSettings>({
    autoRotate: true,
    showInstructions: true,
    enableAudio: false,
    cameraControls: true,
    environmentLighting: 'neutral',
    arScale: 'auto'
  });

  const handleSpeech = useCallback(() => {
    if (!speechEnabled) {
      const memoryText = memorial.memoryText || 'Forever in our hearts and memories.';
      const utterance = new SpeechSynthesisUtterance(
        `Welcome to the AR memorial for ${memorial.name}. Born ${memorial.birthDate}, passed away ${memorial.deathDate}. ${memoryText}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
      setSpeechEnabled(true);
      
      utterance.onend = () => setSpeechEnabled(false);
    } else {
      speechSynthesis.cancel();
      setSpeechEnabled(false);
    }
  }, [memorial, speechEnabled]);

  const generateMemorialModel = useCallback(() => {
    const photoTexture = memorial.photo || islamicArchPlaceholder;

    // Create a simple HTML-based 3D memorial since GLB models are missing
    return `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        cursor: grab;
      "
      id="memorial-3d-container"
      onmousedown="this.style.cursor='grabbing'"
      onmouseup="this.style.cursor='grab'"
      >
        <!-- Stars background -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #fff, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: twinkle 4s ease-in-out infinite alternate;
        "></div>

        <!-- Memorial Structure -->
        <div style="
          transform-style: preserve-3d;
          animation: rotate3d 20s linear infinite;
          position: relative;
        " id="memorial-structure">

          <!-- Memorial Photo -->
          <div style="
            width: 200px;
            height: 200px;
            margin: 0 auto 20px;
            position: relative;
            transform: perspective(1000px) rotateY(0deg);
            transition: transform 0.3s ease;
          ">
            <img
              src="${photoTexture}"
              alt="${memorial.name}"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 15px;
                border: 4px solid #FFD700;
                box-shadow:
                  0 0 30px rgba(255, 215, 0, 0.6),
                  0 0 60px rgba(255, 215, 0, 0.4),
                  inset 0 0 20px rgba(255, 215, 0, 0.2);
                filter: brightness(1.1) contrast(1.1);
              "
            />
            <!-- Glowing frame effect -->
            <div style="
              position: absolute;
              inset: -4px;
              border-radius: 19px;
              background: linear-gradient(45deg, #FFD700, #FFA500, #FF8C00, #FFD700);
              background-size: 400% 400%;
              animation: gradientShift 3s ease infinite;
              z-index: -1;
            "></div>
          </div>

          <!-- Memorial Text -->
          <div style="
            text-align: center;
            color: white;
            max-width: 300px;
            margin: 0 auto;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: bold;
              color: #FFD700;
              margin-bottom: 10px;
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
              font-family: serif;
            ">${memorial.name}</h2>

            <p style="
              font-size: 1.2rem;
              color: #E5E5E5;
              margin-bottom: 15px;
              font-weight: 300;
            ">${memorial.birthDate} - ${memorial.deathDate}</p>

            ${memorial.memoryText ? `
              <p style="
                font-size: 1rem;
                color: #D1D1D1;
                font-style: italic;
                line-height: 1.5;
                margin-bottom: 20px;
                max-width: 250px;
                margin-left: auto;
                margin-right: auto;
              ">"${memorial.memoryText}"</p>
            ` : ''}

            <!-- AR Button -->
            <button
              onclick="toggleAR()"
              style="
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
                color: #000;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
                transition: all 0.3s ease;
                margin-top: 10px;
              "
              onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(255, 215, 0, 0.6)'"
              onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 5px 15px rgba(255, 215, 0, 0.4)'"
            >
              🌟 ${isARActive ? 'Exit AR Memorial' : 'Enter AR Memorial'}
            </button>
          </div>
        </div>

        <!-- Interactive Controls Info -->
        <div style="
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          padding: 10px 20px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        ">
          🖱️ Drag to rotate • 🔍 Scroll to zoom • 📱 Pinch to zoom • Double-tap to reset
        </div>

        <style>
          @keyframes rotate3d {
            0% { transform: rotateY(0deg) rotateX(0deg); }
            25% { transform: rotateY(90deg) rotateX(5deg); }
            50% { transform: rotateY(180deg) rotateX(0deg); }
            75% { transform: rotateY(270deg) rotateX(-5deg); }
            100% { transform: rotateY(360deg) rotateX(0deg); }
          }

          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 1; }
          }

          #memorial-3d-container:active #memorial-structure {
            animation-play-state: paused;
          }
        </style>

        <script>
          function toggleAR() {
            const isActive = ${isARActive};
            // This would trigger the AR functionality
            console.log('AR Toggle:', !isActive);

            // Update button text
            const button = document.querySelector('button');
            if (button) {
              button.innerHTML = isActive ? '🌟 Enter AR Memorial' : '🌟 Exit AR Memorial';
            }
          }

          // Add mouse interaction for rotation and zoom control
          let isDragging = false;
          let startX = 0;
          let startY = 0;
          let currentRotationY = 0;
          let currentRotationX = 0;
          let currentScale = 1;

          const container = document.getElementById('memorial-3d-container');
          const structure = document.getElementById('memorial-structure');

          if (container && structure) {
            // Mouse drag for rotation
            container.addEventListener('mousedown', (e) => {
              isDragging = true;
              startX = e.clientX;
              startY = e.clientY;
              structure.style.animationPlayState = 'paused';
              container.style.cursor = 'grabbing';
            });

            container.addEventListener('mousemove', (e) => {
              if (!isDragging) return;

              const deltaX = e.clientX - startX;
              const deltaY = e.clientY - startY;

              currentRotationY += deltaX * 0.5;
              currentRotationX -= deltaY * 0.3;

              // Limit X rotation
              currentRotationX = Math.max(-45, Math.min(45, currentRotationX));

              structure.style.transform = \`rotateY(\${currentRotationY}deg) rotateX(\${currentRotationX}deg) scale(\${currentScale})\`;

              startX = e.clientX;
              startY = e.clientY;
            });

            container.addEventListener('mouseup', () => {
              isDragging = false;
              container.style.cursor = 'grab';
            });

            container.addEventListener('mouseleave', () => {
              isDragging = false;
              container.style.cursor = 'grab';
            });

            // Mouse wheel for zoom
            container.addEventListener('wheel', (e) => {
              e.preventDefault();

              const zoomSpeed = 0.001;
              const delta = e.deltaY * zoomSpeed;

              currentScale -= delta;
              currentScale = Math.max(0.5, Math.min(2.5, currentScale));

              structure.style.transform = \`rotateY(\${currentRotationY}deg) rotateX(\${currentRotationX}deg) scale(\${currentScale})\`;

              // Pause auto-rotation while zooming
              structure.style.animationPlayState = 'paused';

              // Resume auto-rotation after a delay
              setTimeout(() => {
                if (!isDragging) {
                  structure.style.animationPlayState = 'running';
                }
              }, 1000);
            });

            // Touch events for mobile
            let initialDistance = 0;
            let initialScale = 1;

            container.addEventListener('touchstart', (e) => {
              if (e.touches.length === 1) {
                // Single touch - rotation
                isDragging = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                structure.style.animationPlayState = 'paused';
              } else if (e.touches.length === 2) {
                // Two finger pinch - zoom
                isDragging = false;
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.sqrt(
                  Math.pow(touch2.clientX - touch1.clientX, 2) +
                  Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                initialScale = currentScale;
                structure.style.animationPlayState = 'paused';
              }
            });

            container.addEventListener('touchmove', (e) => {
              e.preventDefault();

              if (e.touches.length === 1 && isDragging) {
                // Single touch rotation
                const deltaX = e.touches[0].clientX - startX;
                const deltaY = e.touches[0].clientY - startY;

                currentRotationY += deltaX * 0.5;
                currentRotationX -= deltaY * 0.3;

                currentRotationX = Math.max(-45, Math.min(45, currentRotationX));

                structure.style.transform = \`rotateY(\${currentRotationY}deg) rotateX(\${currentRotationX}deg) scale(\${currentScale})\`;

                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
              } else if (e.touches.length === 2) {
                // Two finger pinch zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                  Math.pow(touch2.clientX - touch1.clientX, 2) +
                  Math.pow(touch2.clientY - touch1.clientY, 2)
                );

                const scaleChange = currentDistance / initialDistance;
                currentScale = initialScale * scaleChange;
                currentScale = Math.max(0.5, Math.min(2.5, currentScale));

                structure.style.transform = \`rotateY(\${currentRotationY}deg) rotateX(\${currentRotationX}deg) scale(\${currentScale})\`;
              }
            });

            container.addEventListener('touchend', (e) => {
              if (e.touches.length === 0) {
                isDragging = false;
                // Resume auto-rotation after touch ends
                setTimeout(() => {
                  structure.style.animationPlayState = 'running';
                }, 1000);
              }
            });

            // Double tap to reset
            let lastTap = 0;
            container.addEventListener('touchend', (e) => {
              const currentTime = new Date().getTime();
              const tapLength = currentTime - lastTap;
              if (tapLength < 500 && tapLength > 0) {
                // Double tap detected - reset view
                currentRotationY = 0;
                currentRotationX = 0;
                currentScale = 1;
                structure.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
                structure.style.animationPlayState = 'running';
              }
              lastTap = currentTime;
            });
          }
        </script>
      </div>
    `;

  }, [memorial, settings]);

  useEffect(() => {
    // No need to load model-viewer anymore, just set loading to false
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Auto-hide instructions after 8 seconds
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showInstructions]);



  useEffect(() => {
    // Listen for AR session events
    const handleARSessionStart = () => {
      setIsARActive(true);
      if (settings.enableAudio) {
        handleSpeech();
      }
    };

    const handleARSessionEnd = () => {
      setIsARActive(false);
    };

    if (modelViewerRef.current) {
      modelViewerRef.current.addEventListener('ar-status', (event: any) => {
        if (event.detail.status === 'session-started') {
          handleARSessionStart();
        } else if (event.detail.status === 'not-presenting') {
          handleARSessionEnd();
        }
      });
    }

    return () => {
      if (modelViewerRef.current) {
        modelViewerRef.current.removeEventListener('ar-status', handleARSessionStart);
        modelViewerRef.current.removeEventListener('ar-status', handleARSessionEnd);
      }
    };
  }, [settings.enableAudio, handleSpeech]);

  const resetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.resetTurntableRotation();
      modelViewerRef.current.jumpCameraToGoal();
    }
  };

  const updateSettings = (newSettings: Partial<ARSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  if (error) {
    return (
      <motion.div 
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="p-8 text-center max-w-md bg-card/95 backdrop-blur border-destructive/50">
          <h2 className="text-xl font-bold text-destructive mb-4">AR Viewer Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onClose} variant="outline">Close</Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-br from-black/95 via-primary/5 to-black/95 backdrop-blur-sm"
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
            <div className="bg-card/90 backdrop-blur-md rounded-xl px-4 py-3 border border-primary/20 shadow-lg">
              <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Camera className="w-5 h-5" />
                AR Memorial: {memorial.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {memorial.birthDate} - {memorial.deathDate}
              </p>
              {isARActive && (
                <p className="text-xs text-green-400 font-medium mt-1">
                  🌟 AR Session Active
                </p>
              )}
            </div>
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
              onClick={resetCamera}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              <RotateCcw className="w-4 h-4" />
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
              onClick={() => setShowInstructions(!showInstructions)}
              className="bg-card/90 backdrop-blur-md hover:bg-card border border-primary/20"
            >
              <Info className="w-4 h-4" />
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

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="absolute top-20 right-4 z-20 w-80"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
            >
              <Card className="p-4 bg-card/95 backdrop-blur-md border border-primary/20 shadow-xl">
                <h3 className="text-lg font-semibold text-primary mb-4">AR Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto Rotate</label>
                    <Button
                      variant={settings.autoRotate ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ autoRotate: !settings.autoRotate })}
                    >
                      {settings.autoRotate ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Camera Controls</label>
                    <Button
                      variant={settings.cameraControls ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ cameraControls: !settings.cameraControls })}
                    >
                      {settings.cameraControls ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Audio Narration</label>
                    <Button
                      variant={settings.enableAudio ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ enableAudio: !settings.enableAudio })}
                    >
                      {settings.enableAudio ? "On" : "Off"}
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Environment</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['neutral', 'city', 'forest', 'studio'] as const).map((env) => (
                        <Button
                          key={env}
                          variant={settings.environmentLighting === env ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSettings({ environmentLighting: env })}
                          className="capitalize"
                        >
                          {env}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions Panel */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              className="absolute bottom-4 left-4 right-4 z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <Card className="p-4 bg-card/90 backdrop-blur-md border border-primary/20 shadow-lg">
                <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  AR Memorial Instructions
                </h3>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-primary mb-2">3D View Controls:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>🖱️ Drag to rotate the memorial</li>
                      <li>🔍 Scroll wheel to zoom in/out</li>
                      <li>📱 Touch drag to rotate on mobile</li>
                      <li>🤏 Pinch to zoom on mobile</li>
                      <li>👆 Double-tap to reset view</li>
                      <li>🔄 Auto-rotation when idle</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-primary mb-2">AR Experience:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>🌟 Tap "Enter AR Memorial" button</li>
                      <li>📷 Point camera at flat surface</li>
                      <li>👆 Tap to place memorial</li>
                      <li>🚶 Walk around to explore</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    💡 For the best AR experience, ensure good lighting and a clear, flat surface.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AR Model Viewer */}
        <div className="flex-1 relative">
          {isLoading ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center text-white">
                <div className="relative">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <div className="absolute inset-0 animate-pulse">
                    <div className="w-8 h-8 bg-primary/30 rounded-full mx-auto mt-2"></div>
                  </div>
                </div>
                <p className="text-lg font-medium">Loading AR Memorial Experience...</p>
                <p className="text-sm text-white/70 mt-2">Preparing 3D model and AR capabilities</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              ref={modelViewerRef}
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              dangerouslySetInnerHTML={{
                __html: generateMemorialModel()
              }}
            />
          )}
        </div>

        {/* Memorial Information Overlay */}
        {!isARActive && (
          <motion.div
            className="absolute bottom-20 left-4 z-10"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
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
        )}

        {/* AR Status Indicator */}
        {isARActive && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="bg-green-500/90 text-white px-6 py-3 rounded-full backdrop-blur-md shadow-lg">
              <p className="text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                AR Memorial Active - Walk around to explore
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
