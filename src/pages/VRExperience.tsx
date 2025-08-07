import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Headphones, Heart, Star, Sparkles, Menu, ChevronDown, Camera, Projector } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemorialData } from '@/components/memorial/MemorialCard';
import { CSS3DVR } from '@/components/vr/CSS3DVR';
import { VRMemorialGarden } from '@/components/vr/VRMemorialGarden';
import { VRErrorBoundary } from '@/components/vr/VRErrorBoundary';
import { EnhancedARViewer } from '@/components/memorial/EnhancedARViewer';
import { EnhancedBeamerView } from '@/components/beamer/EnhancedBeamerView';

const VRExperience: React.FC = () => {
  const [selectedVR, setSelectedVR] = useState<string | null>('vr-garden'); // Show VR by default
  const [selectedMode, setSelectedMode] = useState<'vr' | 'ar' | 'beamer'>('vr');

  // Sample memorial data for demo
  const sampleMemorial: MemorialData = {
    id: 'vr-demo-memorial',
    name: 'Sarah Johnson',
    birthDate: '1985-03-15',
    deathDate: '2023-11-20',
    photo: '/lovable-uploads/97f52ec1-ca70-49d3-9242-069944655158.png',
    memoryText: 'A loving mother, devoted wife, and cherished friend. Her kindness and warmth touched everyone she met. Forever in our hearts.',
    cardType: 'female',
    arAnimationUrl: `/models/memorial-gate-${'female'}.glb`,
    gpsLocation: {
      lat: 40.7589,
      lng: -73.9851,
      name: 'Memorial Garden, New York'
    }
  };

  const vrExperience = {
    id: 'vr-garden',
    title: 'Sacred Memorial Garden VR',
    description: 'Immersive VR experience with sacred geometry, memory orbs, and mystical environments',
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
    features: [
      'Sacred Geometry Memorial Base',
      'Interactive Memory Orbs (Love, Joy, Hope, Peace)',
      'Mystical Floating Islands',
      'WebXR Support for VR Headsets',
      'Spatial Audio Narration',
      'Islamic Architectural Design',
      'Cross-Platform Compatibility',
      'Touch and Gesture Controls'
    ],
    action: () => setSelectedVR('vr-garden')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
                <Headphones className="w-10 h-10" />
                VR Memorial Experience
              </h1>
              <p className="text-muted-foreground mt-2">
                Immerse yourself in sacred virtual reality memorial experiences
              </p>
            </div>
          </div>

          {/* VR/AR/Beamer Mode Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">View Mode:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 min-w-[120px]"
                >
                  {selectedMode === 'vr' && <Headphones className="w-4 h-4" />}
                  {selectedMode === 'ar' && <Camera className="w-4 h-4" />}
                  {selectedMode === 'beamer' && <Projector className="w-4 h-4" />}
                  {selectedMode === 'vr' && 'VR Mode'}
                  {selectedMode === 'ar' && 'AR Mode'}
                  {selectedMode === 'beamer' && 'Beamer Mode'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => setSelectedMode('vr')}
                  className="cursor-pointer"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  <div>
                    <div className="font-medium">VR Memorial Garden</div>
                    <div className="text-xs text-muted-foreground">Sacred VR experience with memory orbs</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedMode('ar')}
                  className="cursor-pointer"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  <div>
                    <div className="font-medium">AR Experience</div>
                    <div className="text-xs text-muted-foreground">Augmented reality memorial viewing</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedMode('beamer')}
                  className="cursor-pointer"
                >
                  <Projector className="w-4 h-4 mr-2" />
                  <div>
                    <div className="font-medium">Beamer Mode</div>
                    <div className="text-xs text-muted-foreground">Projector presentation view</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* VR Experience Option */}
        <div className="max-w-2xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={vrExperience.action}>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${vrExperience.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                  <vrExperience.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-4">{vrExperience.title}</h3>
                <p className="text-muted-foreground mb-6 text-lg">{vrExperience.description}</p>

                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {vrExperience.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="group-hover:bg-primary/90 px-8 py-3 text-lg"
                  onClick={vrExperience.action}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enter VR Memorial Garden
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>




      </motion.div>

      {/* Experience Modal - Shows VR/AR/Beamer based on selected mode */}
      {selectedVR === 'vr-garden' && (
        <>
          {selectedMode === 'vr' && (
            <VRErrorBoundary onClose={() => window.history.back()}>
              <VRMemorialGarden
                memorial={sampleMemorial}
                onClose={() => window.history.back()}
              />
            </VRErrorBoundary>
          )}

          {selectedMode === 'ar' && (
            <EnhancedARViewer
              memorial={sampleMemorial}
              onClose={() => window.history.back()}
            />
          )}

          {selectedMode === 'beamer' && (
            <EnhancedBeamerView
              memorial={sampleMemorial}
              onClose={() => window.history.back()}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VRExperience;
