import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Eye, Headphones, ChevronDown, Camera, Projector, Sparkles, Gem } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemorialForm } from '@/components/memorial/MemorialForm';
import { MemorialCard, MemorialData } from '@/components/memorial/MemorialCard';
import { VRMemorialGarden } from '@/components/vr/VRMemorialGarden';
import { VRErrorBoundary } from '@/components/vr/VRErrorBoundary';
import { EnhancedARViewer } from '@/components/memorial/EnhancedARViewer';
import { EnhancedBeamerView } from '@/components/beamer/EnhancedBeamerView';
import { ARManager } from '@/components/ar/ARManager';
import { NFTTokenPlaceholder } from '@/components/memorial/NFTTokenPlaceholder';



const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'vr' | 'ar' | 'beamer'>('vr');

  // Working modal states from MemorialCard
  const [showVR, setShowVR] = useState(false);
  const [showEnhancedAR, setShowEnhancedAR] = useState(false);
  const [showBeamer, setShowBeamer] = useState(false);
  const [showARManager, setShowARManager] = useState(false);
  const [showNFT, setShowNFT] = useState(false);
  const [sampleMemorial] = useState<MemorialData>({
    id: 'sample',
    name: 'Naomi N.',
    birthDate: '1945-03-15',
    deathDate: '2024-01-10',
    photo: '/lovable-uploads/97f52ec1-ca70-49d3-9242-069944655158.png',
    memoryText: 'A beautiful soul who brought joy and warmth to everyone she met. Her legacy of love and compassion will live on forever in our hearts.',
    cardType: 'female',
    gpsLocation: {
      lat: 40.7589,
      lng: -73.9851,
      name: 'Memorial Garden, New York'
    }
  });

  const handleCreateMemorial = (data: Partial<MemorialData>) => {
    console.log('Creating memorial:', data);
    // Here you would typically save to your backend
    setShowForm(false);
    // For now, just show a success message
    alert('Memorial card created successfully!');
  };



  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-ethereal">
        <MemorialForm 
          onSubmit={handleCreateMemorial}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ethereal">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation Section */}
        <section className="w-full px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-between items-center w-full"
          >
            {/* Create Memorial - Far Left */}
            <div className="flex-shrink-0">
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg text-lg px-8 py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Memorial
              </Button>
            </div>

            {/* Right Side Buttons */}
            <div className="flex gap-4 flex-shrink-0">
              <Link to="/memorial/naomi-n">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </Link>

              {/* Options Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-6 py-4 text-lg"
                  >
                    <span className="mr-2">Default</span>
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => { setSelectedMode('vr'); setShowVR(true); }} className="cursor-pointer">
                    <Headphones className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">VR Memorial Garden</div>
                      <div className="text-xs text-muted-foreground">Sacred VR experience with memory orbs</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSelectedMode('ar'); setShowEnhancedAR(true); }} className="cursor-pointer">
                    <Camera className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">AR Experience</div>
                      <div className="text-xs text-muted-foreground">Augmented reality memorial viewing</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSelectedMode('beamer'); setShowBeamer(true); }} className="cursor-pointer">
                    <Projector className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">Beamer Mode</div>
                      <div className="text-xs text-muted-foreground">Projector presentation view</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSelectedMode('ar'); setShowARManager(true); }} className="cursor-pointer">
                    <Sparkles className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">Hologram View</div>
                      <div className="text-xs text-muted-foreground">Interactive holographic experience</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowNFT(true)} className="cursor-pointer">
                    <Gem className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">NFT Token</div>
                      <div className="text-xs text-muted-foreground">View memorial as NFT</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </section>

        {/* Sample Memorial Card */}
        <section className="container mx-auto px-4 py-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center"
          >
            <MemorialCard memorial={sampleMemorial} showAR={false} />
          </motion.div>
        </section>



      </div>

      {/* Working Modal Components from MemorialCard */}

      {/* Enhanced Beamer View */}
      {showBeamer && (
        <EnhancedBeamerView
          memorial={sampleMemorial}
          onClose={() => setShowBeamer(false)}
        />
      )}{/* VR Memorial Garden */}
      {showVR && (
        <VRErrorBoundary onClose={() => setShowVR(false)}>
          <VRMemorialGarden
            memorial={sampleMemorial}
            onClose={() => setShowVR(false)}
          />
        </VRErrorBoundary>
      )}

      {/* Enhanced AR View */}
      {showEnhancedAR && (
        <EnhancedARViewer
          memorial={sampleMemorial}
          onClose={() => setShowEnhancedAR(false)}
        />
      )}

      {/* AR Manager */}
      {showARManager && (
        <ARManager
          memorial={sampleMemorial}
          onClose={() => setShowARManager(false)}
        />
      )}

      {/* NFT Token Placeholder */}
      {showNFT && (
        <NFTTokenPlaceholder
          memorialId={sampleMemorial.id}
          onClose={() => setShowNFT(false)}
        />
      )}
    </div>
  );
};

export default Index;
