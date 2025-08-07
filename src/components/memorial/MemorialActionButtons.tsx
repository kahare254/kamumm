import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, Projector, Headphones, Menu, X } from 'lucide-react';

interface MemorialActionButtonsProps {
  onShowBeamer: () => void;
  onShowVR: () => void;
  onShowQR: () => void;
  onShowAR?: () => void;
}

export const MemorialActionButtons: React.FC<MemorialActionButtonsProps> = ({
  onShowBeamer,
  onShowVR,
  onShowQR,
  onShowAR
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: 'VR Memorial Garden',
      icon: Headphones,
      onClick: () => {
        onShowVR();
        setIsOpen(false);
      },
      description: 'Sacred VR experience with memory orbs'
    },
    {
      label: 'AR Experience',
      icon: Camera,
      onClick: () => {
        onShowAR?.();
        setIsOpen(false);
      },
      description: 'Augmented reality memorial viewing'
    },
    {
      label: 'Beamer Mode',
      icon: Projector,
      onClick: () => {
        onShowBeamer();
        setIsOpen(false);
      },
      description: 'Projector presentation view'
    },
    {
      label: 'QR Code',
      icon: QrCode,
      onClick: () => {
        onShowQR();
        setIsOpen(false);
      },
      description: 'Show QR Code'
    }
  ];

  return (
    <motion.div
      className="fixed top-8 right-8 z-50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.5 }}
    >
      {/* Dropdown Toggle Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/95 backdrop-blur-sm border-primary hover:bg-primary hover:text-primary-foreground shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-primary/20 rounded-lg shadow-xl overflow-hidden"
          >
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={item.onClick}
                  className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors duration-200 border-b border-primary/10 last:border-b-0 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </motion.div>
  );
};
