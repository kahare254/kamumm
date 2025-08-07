import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Smartphone, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';
import { MemorialData } from '../memorial/MemorialCard';
import { EnhancedARViewer } from '../memorial/EnhancedARViewer';
import { WebXRARViewer } from './WebXRARViewer';

interface ARManagerProps {
  memorial: MemorialData;
  onClose: () => void;
}

interface ARCapabilities {
  webXR: boolean;
  modelViewer: boolean;
  camera: boolean;
  deviceMotion: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
}

export const ARManager: React.FC<ARManagerProps> = ({ memorial, onClose }) => {
  const [capabilities, setCapabilities] = useState<ARCapabilities>({
    webXR: false,
    modelViewer: false,
    camera: false,
    deviceMotion: false,
    isIOS: false,
    isAndroid: false,
    isMobile: false
  });
  const [selectedMode, setSelectedMode] = useState<'auto' | 'model-viewer' | 'webxr' | 'fallback'>('auto');
  const [isLoading, setIsLoading] = useState(true);
  const [showModeSelection, setShowModeSelection] = useState(true);

  useEffect(() => {
    const detectCapabilities = async () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      let webXRSupported = false;
      let cameraSupported = false;
      let deviceMotionSupported = false;
      let modelViewerSupported = false;

      // Check WebXR support
      if ('xr' in navigator) {
        try {
          // @ts-ignore
          webXRSupported = await navigator.xr.isSessionSupported('immersive-ar');
        } catch (e) {
          webXRSupported = false;
        }
      }

      // Check camera access
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          cameraSupported = true;
          stream.getTracks().forEach(track => track.stop());
        } catch (e) {
          cameraSupported = false;
        }
      }

      // Check device motion
      if ('DeviceMotionEvent' in window) {
        deviceMotionSupported = true;
      }

      // Check model-viewer support
      modelViewerSupported = 'customElements' in window;

      setCapabilities({
        webXR: webXRSupported,
        modelViewer: modelViewerSupported,
        camera: cameraSupported,
        deviceMotion: deviceMotionSupported,
        isIOS,
        isAndroid,
        isMobile
      });

      // Auto-select best mode
      if (webXRSupported) {
        setSelectedMode('webxr');
      } else if (modelViewerSupported && (isIOS || isAndroid)) {
        setSelectedMode('model-viewer');
      } else {
        setSelectedMode('fallback');
      }

      setIsLoading(false);
    };

    detectCapabilities();
  }, []);

  const renderModeSelection = () => (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="p-6 max-w-2xl w-full bg-card/95 backdrop-blur-md border-primary/20">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Choose AR Experience Mode
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          Select the best AR experience for your device and {memorial.name}'s memorial
        </p>

        <div className="grid gap-4">
          {/* WebXR Mode */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMode === 'webxr' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-primary/30 hover:border-primary/50'
            }`}
            onClick={() => setSelectedMode('webxr')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-semibold text-primary">WebXR AR (Recommended)</h3>
                  <p className="text-sm text-muted-foreground">
                    Full immersive AR with hand tracking and spatial anchoring
                  </p>
                </div>
              </div>
              {capabilities.webXR ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          </div>

          {/* Model Viewer Mode */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMode === 'model-viewer' 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-primary/30 hover:border-primary/50'
            }`}
            onClick={() => setSelectedMode('model-viewer')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-primary">Model Viewer AR</h3>
                  <p className="text-sm text-muted-foreground">
                    Compatible AR using Google's Model Viewer
                  </p>
                </div>
              </div>
              {capabilities.modelViewer && capabilities.camera ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          </div>

          {/* 3D Fallback Mode */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMode === 'fallback' 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-primary/30 hover:border-primary/50'
            }`}
            onClick={() => setSelectedMode('fallback')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-primary">3D Memorial View</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive 3D memorial with full controls
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Device Capabilities */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-primary mb-2">Your Device Capabilities:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {capabilities.webXR ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <span>WebXR Support</span>
            </div>
            <div className="flex items-center gap-2">
              {capabilities.camera ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <span>Camera Access</span>
            </div>
            <div className="flex items-center gap-2">
              {capabilities.deviceMotion ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <span>Motion Sensors</span>
            </div>
            <div className="flex items-center gap-2">
              {capabilities.isMobile ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Monitor className="w-4 h-4 text-blue-500" />
              )}
              <span>{capabilities.isMobile ? 'Mobile Device' : 'Desktop'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setShowModeSelection(false)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Start AR Experience
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const renderARExperience = () => {
    switch (selectedMode) {
      case 'webxr':
        return <WebXRARViewer memorial={memorial} onClose={onClose} />;
      case 'model-viewer':
        return <EnhancedARViewer memorial={memorial} onClose={onClose} />;
      case 'fallback':
      default:
        return <WebXRARViewer memorial={memorial} onClose={onClose} />;
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Detecting AR Capabilities</h3>
          <p className="text-sm text-white/70">Preparing the best experience for your device...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {showModeSelection ? renderModeSelection() : renderARExperience()}
    </AnimatePresence>
  );
};
