import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, Share2, Download, Projector, Headphones } from 'lucide-react';
import { HeavenlyGate } from './HeavenlyGate';
import { QRCodeGenerator } from './QRCodeGenerator';
import { HologramView } from './HologramView';
import { BeamerView } from './BeamerView';
import { VRView } from './VRView';

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
}

export const MemorialCard: React.FC<MemorialCardProps> = ({
  memorial,
  showAR = false,
  onShare,
  onDownload
}) => {
  const [showHologram, setShowHologram] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showBeamer, setShowBeamer] = useState(false);
  const [showVR, setShowVR] = useState(false);
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

          {/* Photo Container with Heavenly Glow */}
          <motion.div 
            className="relative mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-heavenly border-4 border-primary/50">
              <img 
                src={memorial.photo} 
                alt={memorial.name}
                className="w-full h-full object-cover animate-heavenly-glow"
              />
            </div>
            
            {/* Holographic overlay effect */}
            {showAR && (
              <div className="absolute inset-0 bg-gradient-hologram rounded-full animate-shimmer" />
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
            <p className="text-sm text-muted-foreground mb-2">
              {memorial.birthDate} - {memorial.deathDate}
            </p>
            <p className="text-sm memorial-text italic px-4">
              {memorial.memoryText}
            </p>
          </motion.div>

          {/* QR Code Section */}
          <motion.div 
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
          >
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">
                Scan with your camera to view the hologram
              </p>
              <div className="w-20 h-20 bg-foreground p-2 rounded">
                <QRCodeGenerator 
                  data={`${window.location.origin}/memorial/${memorial.id}`}
                  size={64}
                />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="grid grid-cols-3 gap-2 max-w-sm mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHologram(!showHologram)}
              className="bg-primary/10 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Camera className="w-4 h-4 mr-1" />
              AR View
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBeamer(true)}
              className="bg-primary/10 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Projector className="w-4 h-4 mr-1" />
              Beamer
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVR(true)}
              className="bg-primary/10 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Headphones className="w-4 h-4 mr-1" />
              VR
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQR(!showQR)}
              className="bg-primary/10 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <QrCode className="w-4 h-4 mr-1" />
              QR Code
            </Button>
            
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

      {/* Hologram Modal */}
      {showHologram && (
        <HologramView 
          memorial={memorial}
          onClose={() => setShowHologram(false)}
        />
      )}

      {/* Beamer View */}
      {showBeamer && (
        <BeamerView 
          memorial={memorial}
          onClose={() => setShowBeamer(false)}
        />
      )}

      {/* VR View */}
      {showVR && (
        <VRView 
          memorial={memorial}
          onClose={() => setShowVR(false)}
        />
      )}
    </motion.div>
  );
};