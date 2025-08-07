import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, X, ExternalLink } from 'lucide-react';

interface GPSLocationProps {
  gpsLocation: {
    lat: number;
    lng: number;
    name: string;
  };
}

export const GPSLocation: React.FC<GPSLocationProps> = ({ gpsLocation }) => {
  const [showMap, setShowMap] = useState(false);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${gpsLocation.lat},${gpsLocation.lng}`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = () => {
    const url = `https://maps.apple.com/?q=${gpsLocation.lat},${gpsLocation.lng}`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          const url = `https://www.google.com/maps/dir/${currentLat},${currentLng}/${gpsLocation.lat},${gpsLocation.lng}`;
          window.open(url, '_blank');
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Fallback to just showing destination
          openInGoogleMaps();
        }
      );
    } else {
      openInGoogleMaps();
    }
  };

  return (
    <>
      {/* GPS Location Display */}
      <motion.div
        className="mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.1, type: "spring" }}
      >
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary">Memorial Location</h4>
                <p className="text-sm text-muted-foreground">{gpsLocation.name}</p>
                <p className="text-xs text-muted-foreground">
                  {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMap(true)}
                className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                <MapPin className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={getDirections}
                className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[80vh]"
            >
              {/* Header */}
              <div className="p-4 border-b bg-primary text-primary-foreground flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Memorial Location</h2>
                  <p className="text-primary-foreground/80">{gpsLocation.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMap(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Map Content */}
              <div className="p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${gpsLocation.lng}!3d${gpsLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcwMC4wIk4gNzPCsDU5JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1234567890123`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Memorial Location Map"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={openInGoogleMaps}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Google Maps
                  </Button>
                  <Button
                    onClick={openInAppleMaps}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Apple Maps
                  </Button>
                  <Button
                    onClick={getDirections}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>

                {/* Coordinates */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    Coordinates: {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
