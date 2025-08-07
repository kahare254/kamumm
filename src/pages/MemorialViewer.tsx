import React from 'react';
import { useParams } from 'react-router-dom';
import { MemorialCard, MemorialData } from '@/components/memorial/MemorialCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample memorial data for demonstration
const sampleMemorials: Record<string, MemorialData> = {
  'naomi-n': {
    id: 'naomi-n',
    name: 'Naomi N.',
    birthDate: '',
    deathDate: '',
    photo: '/lovable-uploads/97f52ec1-ca70-49d3-9242-069944655158.png',
    memoryText: '',
    cardType: 'female',
    gpsLocation: {
      lat: 40.7589,
      lng: -73.9851,
      name: 'Memorial Garden, New York'
    }
  }
};

export const MemorialViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const memorial = id ? sampleMemorials[id] : null;

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gradient-ethereal flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-4">Memorial Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The memorial you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Memorial for ${memorial.name}`,
          text: `Remember ${memorial.name} - ${memorial.memoryText}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Memorial link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // This would implement the download/print functionality
    window.print();
  };

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
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-primary mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Digital Memorial
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Experience an interactive holographic memorial that honors the life and legacy 
              of {memorial.name}
            </motion.p>
          </div>

          {/* Memorial Card */}
          <div className="flex justify-center">
            <MemorialCard 
              memorial={memorial}
              showAR={true}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          </div>

          {/* Instructions */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="max-w-2xl mx-auto p-6 bg-card/50 backdrop-blur border-primary/20">
              <h3 className="text-lg font-semibold text-primary mb-3">
                How to Experience the Memorial
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📱 Scan the QR code with your mobile device camera</p>
                <p>🔮 Click "AR View" to see the holographic memorial</p>
                <p>🎵 Enable sound for the full spiritual experience</p>
                <p>🌟 Move your device around to explore different angles</p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};