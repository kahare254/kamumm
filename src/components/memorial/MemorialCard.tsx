import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, Share2, Download, Projector, Headphones, Menu, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HeavenlyGate } from './HeavenlyGate';
import { QRCodeGenerator } from './QRCodeGenerator';

import { CSS3DVR } from '../vr/CSS3DVR';
import { VRErrorBoundary } from '../vr/VRErrorBoundary';
import { EnhancedBeamerView } from '../beamer/EnhancedBeamerView';
import { EnhancedARViewer } from './EnhancedARViewer';
import { ARManager } from '../ar/ARManager';
import islamicArchPlaceholder from '../../assets/islamic-arch-placeholder.jpg';

export interface MemorialData {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string;
  photo: string;
  memoryText: string;
  cardType: 'male' | 'female' | 'child';
  qrCode?: string;
  nfcData?: string;
  gpsLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
}

interface MemorialCardProps {
  memorial: MemorialData;
  showAR?: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  onShowBeamer?: () => void;
  onShowVR?: () => void;
  onShowQR?: () => void;
}

export const MemorialCard = ({
  memorial,
  showAR = false,
  onShare,
  onDownload,
  onShowBeamer,
  onShowVR,
  onShowQR
}: MemorialCardProps) => {
  const [showQR, setShowQR] = useState(false);
  const [showBeamer, setShowBeamer] = useState(false);
  const [showVR, setShowVR] = useState(false);
  const [showEnhancedAR, setShowEnhancedAR] = useState(false);
  const [showARManager, setShowARManager] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0
    },
    hover: {
      y: -5
    }
  };

  const getCardGradient = () => {
    switch (memorial.cardType) {
      case 'male':
        return 'bg-gradient-to-br from-blue-100 via-primary-light to-primary/20';
      case 'female':
        return 'bg-gradient-to-br from-pink-100 via-primary-light to-primary/20';
      case 'child':
        return 'bg-gradient-to-br from-yellow-100 via-primary-light to-primary/20';
      default:
        return 'bg-gradient-memorial';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="relative max-w-md mx-auto"
    >

      <Card className={`relative overflow-hidden shadow-strong border-2 border-primary/30 ${getCardGradient()}`}>
        {/* Heavenly Gate Background */}
        <div className="absolute inset-0 opacity-20">
          <HeavenlyGate animate={showAR} />
        </div>



        {/* Main Card Content */}
        <div className="relative p-8 text-center">
          {/* Title */}
          <motion.h1 
            className="text-3xl font-bold text-primary mb-6 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            GATE OF MEMORY
          </motion.h1>

          {/* Photo Container */}
          <motion.div 
            className="relative mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-32 h-40 mx-auto rounded-lg overflow-hidden shadow-lg border-4 border-primary/50">
              <img
                src={memorial.photo || islamicArchPlaceholder}
                alt={memorial.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* AR overlay effect */}
            {showAR && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse" />
            )}
          </motion.div>

          {/* Memorial Text */}
          <motion.div 
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">
              In Loving Memory
            </h2>
            <h3 className="text-2xl font-bold text-primary mb-3">
              of {memorial.name}
            </h3>

          </motion.div>



          {/* QR Code Section */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1, type: "spring" }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground flex-1">
                Scan QR code with your camera to view hologram
              </p>
              <div className="w-20 h-20 flex-shrink-0">
                <QRCodeGenerator
                  data={`${window.location.origin}/memorial/${memorial.id}`}
                  size={80}
                />
              </div>
            </div>
          </motion.div>


        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </Card>

      {/* Share and Print Buttons - Below Template */}
      <motion.div
        className="flex gap-3 justify-center mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="bg-primary/10 border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="bg-primary/10 border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Download className="w-4 h-4 mr-1" />
          Print
        </Button>
      </motion.div>

      {/* Enhanced Beamer View */}
      {showBeamer && (
        <EnhancedBeamerView
          memorial={memorial}
          onClose={() => setShowBeamer(false)}
        />
      )}

      {/* VR Memorial Garden */}
      {showVR && (
        <VRErrorBoundary onClose={() => setShowVR(false)}>
          <CSS3DVR
            memorial={memorial}
            onClose={() => setShowVR(false)}
          />
        </VRErrorBoundary>
      )}

      {/* Enhanced AR View */}
      {showEnhancedAR && (
        <EnhancedARViewer
          memorial={memorial}
          onClose={() => setShowEnhancedAR(false)}
        />
      )}

      {/* AR Manager */}
      {showARManager && (
        <ARManager
          memorial={memorial}
          onClose={() => setShowARManager(false)}
        />
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full text-center"
          >
            <h2 className="text-2xl font-bold text-primary mb-4">QR Code</h2>
            <p className="text-muted-foreground mb-6">
              Scan with your camera to view hologram
            </p>
            <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
              <QRCodeGenerator
                data={`${window.location.origin}/memorial/${memorial.id}`}
                size={192}
              />
            </div>
            <Button
              onClick={() => setShowQR(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};