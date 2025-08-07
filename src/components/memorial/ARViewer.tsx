import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, ZoomIn, ZoomOut, Camera, Smartphone, Volume2, VolumeX, Settings, Info } from 'lucide-react';
import { MemorialData } from './MemorialCard';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

interface ARViewerProps {
  memorial: MemorialData;
  onClose: () => void;
}

interface ARSettings {
  autoRotate: boolean;
  showInstructions: boolean;
  enableAudio: boolean;
  cameraControls: boolean;
  environmentLighting: 'neutral' | 'city' | 'forest' | 'studio';
}

export const ARViewer: React.FC<ARViewerProps> = ({ memorial, onClose }) => {
  const modelViewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!window.customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(script);
      
      script.onload = () => {
        setIsLoading(false);
      };
      
      script.onerror = () => {
        setError('Failed to load AR viewer');
        setIsLoading(false);
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const resetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.resetTurntableRotation();
    }
  };

  const zoomIn = () => {
    if (modelViewerRef.current) {
      const currentFov = modelViewerRef.current.getCameraTarget();
      // Implement zoom functionality
    }
  };

  const zoomOut = () => {
    if (modelViewerRef.current) {
      // Implement zoom functionality
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-4">AR Viewer Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onClose}>Close</Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-card/10 backdrop-blur">
        <div>
          <h2 className="text-xl font-bold text-white">AR Memorial View</h2>
          <p className="text-white/70">{memorial.name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCamera}
            className="text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            className="text-white hover:bg-white/10"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            className="text-white hover:bg-white/10"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AR Model Viewer */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading AR Experience...</p>
            </div>
          </div>
        ) : (
          <div
            ref={modelViewerRef}
            // @ts-ignore
            dangerouslySetInnerHTML={{
              __html: `
                <model-viewer
                  src="/models/memorial-gate.glb"
                  alt="AR Memorial for ${memorial.name}"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  auto-rotate
                  auto-rotate-delay="3000"
                  rotation-per-second="30deg"
                  environment-image="neutral"
                  poster="/images/memorial-poster.jpg"
                  style="width: 100%; height: 100%; background: transparent;"
                  class="w-full h-full"
                >
                  <button slot="ar-button" style="position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: none; cursor: pointer;">
                    View in AR
                  </button>
                </model-viewer>
              `
            }}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-card/10 backdrop-blur">
        <div className="text-center text-white/80 text-sm space-y-1">
          <p>🔄 Drag to rotate • 📱 Tap "View in AR" for mobile AR experience</p>
          <p>🌟 Point your camera at a flat surface when in AR mode</p>
        </div>
      </div>
    </motion.div>
  );
};