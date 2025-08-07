import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Smartphone, Monitor, ArrowLeft, Play } from 'lucide-react';
import { MemorialCard, MemorialData } from '@/components/memorial/MemorialCard';
import { ARManager } from '@/components/ar/ARManager';
import { EnhancedARViewer } from '@/components/memorial/EnhancedARViewer';
import { WebXRARViewer } from '@/components/ar/WebXRARViewer';

const ARDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [showARManager, setShowARManager] = useState(false);
  const [showEnhancedAR, setShowEnhancedAR] = useState(false);
  const [showWebXRAR, setShowWebXRAR] = useState(false);

  // Sample memorial data for demo
  const sampleMemorial: MemorialData = {
    id: 'demo-memorial',
    name: 'Sarah Johnson',
    birthDate: '1985-03-15',
    deathDate: '2023-11-20',
    photo: '/lovable-uploads/97f52ec1-ca70-49d3-9242-069944655158.png',
    memoryText: 'A loving mother, devoted wife, and cherished friend. Her kindness and warmth touched everyone she met. Forever in our hearts.',
    cardType: 'female',
    gpsLocation: {
      lat: 40.7589,
      lng: -73.9851,
      name: 'Memorial Garden, New York'
    }
  };

  const demoOptions = [
    {
      id: 'ar-manager',
      title: 'Full AR Manager',
      description: 'Complete AR experience with device detection and mode selection',
      icon: Camera,
      color: 'from-blue-500 to-purple-600',
      action: () => setShowARManager(true)
    },
    {
      id: 'enhanced-ar',
      title: 'Enhanced AR Viewer',
      description: 'Model Viewer based AR with advanced controls and settings',
      icon: Smartphone,
      color: 'from-green-500 to-blue-500',
      action: () => setShowEnhancedAR(true)
    },
    {
      id: 'webxr-ar',
      title: 'WebXR AR Experience',
      description: 'Immersive WebXR AR with 3D memorial and spatial tracking',
      icon: Monitor,
      color: 'from-purple-500 to-pink-500',
      action: () => setShowWebXRAR(true)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-primary">AR Memorial Demo</h1>
            <p className="text-muted-foreground mt-2">
              Experience the future of memorial viewing with augmented reality
            </p>
          </div>
        </div>

        {/* Demo Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {demoOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={option.action}>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">{option.title}</h3>
                <p className="text-muted-foreground mb-4">{option.description}</p>
                <Button className="w-full group-hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sample Memorial Card */}
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 bg-card/50 backdrop-blur border-primary/20">
            <h2 className="text-xl font-semibold text-primary mb-4 text-center">
              Sample Memorial Card
            </h2>
            <MemorialCard
              memorial={sampleMemorial}
              onShowHologram={() => console.log('Hologram clicked')}
              onShowBeamer={() => console.log('Beamer clicked')}
              onShowVR={() => console.log('VR clicked')}
              onShowQR={() => console.log('QR clicked')}
              onShare={() => console.log('Share clicked')}
              onDownload={() => console.log('Download clicked')}
            />
          </Card>
        </motion.div>

        {/* Features List */}
        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-8 bg-card/30 backdrop-blur border-primary/20">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              AR Memorial Features
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">AR Capabilities</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✨ WebXR immersive AR support</li>
                  <li>📱 Model Viewer AR for mobile devices</li>
                  <li>🎯 Automatic device capability detection</li>
                  <li>🌟 Spatial anchoring and tracking</li>
                  <li>👋 Hand gesture recognition (WebXR)</li>
                  <li>🔊 Spatial audio narration</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Memorial Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>🏛️ 3D memorial gate architecture</li>
                  <li>🖼️ Dynamic photo integration</li>
                  <li>📝 Floating memorial text</li>
                  <li>🎨 Customizable themes by memorial type</li>
                  <li>✨ Holographic particle effects</li>
                  <li>🌙 Islamic architectural influences</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Device Compatibility</h4>
              <p className="text-sm text-muted-foreground">
                The AR system automatically detects your device capabilities and provides the best possible experience:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• <strong>iOS Safari:</strong> ARKit integration via Model Viewer</li>
                <li>• <strong>Android Chrome:</strong> ARCore support with WebXR fallback</li>
                <li>• <strong>Desktop:</strong> Interactive 3D memorial with full controls</li>
                <li>• <strong>VR Headsets:</strong> Immersive WebXR experience</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* AR Viewers */}
      {showARManager && (
        <ARManager
          memorial={sampleMemorial}
          onClose={() => setShowARManager(false)}
        />
      )}

      {showEnhancedAR && (
        <EnhancedARViewer
          memorial={sampleMemorial}
          onClose={() => setShowEnhancedAR(false)}
        />
      )}

      {showWebXRAR && (
        <WebXRARViewer
          memorial={sampleMemorial}
          onClose={() => setShowWebXRAR(false)}
        />
      )}
    </div>
  );
};

export default ARDemo;
