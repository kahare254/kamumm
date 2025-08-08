import React, { useState, useEffect } from 'react';
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
  const [memorials, setMemorials] = useState<MemorialData[]>([]);

  const [selectedMemorial, setSelectedMemorial] = useState<MemorialData | null>(null);

  useEffect(() => {
  const fetchMemorials = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/memorials');
      const data = await res.json();
      if (res.ok) {
        setMemorials(data.memorials);
      } else {
        console.error('Error fetching memorials:', data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  fetchMemorials();
}, []);

 const handleCreateMemorial = async (data: Partial<MemorialData>) => {
  try {
    const response = await fetch('http://localhost:5000/api/memorials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        birth_date: data.birthDate,
        death_date: data.deathDate,
        memory_text: data.memoryText,
        card_type: data.cardType,
        photo_path: data.photo_path, 
        gps_latitude: data.gpsLocation?.lat,
        gps_longitude: data.gpsLocation?.lng,
        gps_location_name: data.gpsLocation?.name,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Memorial card created successfully!');
      console.log('Saved Memorial:', result);
    } else {
      alert('Error creating memorial: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred.');
  }

  setShowForm(false);
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
                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedMemorial) {
                        setSelectedMode('vr');
                        setShowVR(true);
                      } else {
                        alert('Please select a memorial first.');
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">VR Memorial Garden</div>
                      <div className="text-xs text-muted-foreground">Sacred VR experience with memory orbs</div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedMemorial) {
                        setSelectedMode('ar');
                        setShowEnhancedAR(true);
                      } else {
                        alert('Please select a memorial first.');
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">AR Experience</div>
                      <div className="text-xs text-muted-foreground">Augmented reality memorial viewing</div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedMemorial) {
                        setSelectedMode('beamer');
                        setShowBeamer(true);
                      } else {
                        alert('Please select a memorial first.');
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Projector className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">Beamer Mode</div>
                      <div className="text-xs text-muted-foreground">Projector presentation view</div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedMemorial) {
                        setSelectedMode('ar');
                        setShowARManager(true);
                      } else {
                        alert('Please select a memorial first.');
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">Hologram View</div>
                      <div className="text-xs text-muted-foreground">Interactive holographic experience</div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedMemorial) {
                        setShowNFT(true);
                      } else {
                        alert('Please select a memorial first.');
                      }
                    }}
                    className="cursor-pointer"
                  >
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
            {memorials.map(memorial => (

          <motion.div
            key={memorial.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`flex justify-center mb-4 cursor-pointer ${selectedMemorial?.id === memorial.id ? 'ring-4 ring-purple-500 rounded-xl' : ''}`}
            onClick={() => setSelectedMemorial(memorial)}
          >
            <MemorialCard memorial={memorial} showAR={false} />
          </motion.div>

          ))}
        </section>



      </div>

      {/* Working Modal Components from MemorialCard */}

     {/* Enhanced Beamer View */}
        {showBeamer && selectedMemorial && (
          <EnhancedBeamerView
            memorial={selectedMemorial}
            onClose={() => {
              setShowBeamer(false);
              setSelectedMemorial(null);
            }}
          />
        )}

        {/* VR Memorial Garden */}
        {showVR && selectedMemorial && (
          <VRErrorBoundary onClose={() => {
            setShowVR(false);
            setSelectedMemorial(null);
          }}>
            <VRMemorialGarden
              memorial={selectedMemorial}
              onClose={() => {
                setShowVR(false);
                setSelectedMemorial(null);
              }}
            />
          </VRErrorBoundary>
        )}

        {/* Enhanced AR View */}
        {showEnhancedAR && selectedMemorial && (
          <EnhancedARViewer
            memorial={selectedMemorial}
            onClose={() => {
              setShowEnhancedAR(false);
              setSelectedMemorial(null);
            }}
          />
        )}

        {/* AR Manager */}
        {showARManager && selectedMemorial && (
          <ARManager
            memorial={selectedMemorial}
            onClose={() => {
              setShowARManager(false);
              setSelectedMemorial(null);
            }}
          />
        )}

        {/* NFT Token Placeholder */}
        {showNFT && selectedMemorial && (
          <NFTTokenPlaceholder
            memorialId={selectedMemorial.id}
            onClose={() => {
              setShowNFT(false);
              setSelectedMemorial(null);
            }}
          />
        )}

    </div>
  );
};

export default Index;
