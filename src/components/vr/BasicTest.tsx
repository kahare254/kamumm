import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemorialData } from '../memorial/MemorialCard';

interface BasicTestProps {
  memorial: MemorialData;
  onClose: () => void;
}

export const BasicTest: React.FC<BasicTestProps> = ({ memorial, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="max-w-2xl mx-auto p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Card className="p-8 bg-card/90 backdrop-blur-md border border-primary/20">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-primary">VR Memorial Garden</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-primary/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                <div className="text-4xl">🏛️</div>
              </div>
              
              <h3 className="text-xl font-semibold text-primary">{memorial.name}</h3>
              <p className="text-muted-foreground">
                {memorial.birthDate} - {memorial.deathDate}
              </p>
              <p className="text-sm italic text-foreground/80 max-w-md mx-auto">
                "{memorial.memoryText}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-pink-500/20 rounded-lg">
                  <div className="text-2xl mb-2">💖</div>
                  <div className="text-sm font-medium">Love</div>
                </div>
                <div className="p-4 bg-blue-500/20 rounded-lg">
                  <div className="text-2xl mb-2">😊</div>
                  <div className="text-sm font-medium">Joy</div>
                </div>
                <div className="p-4 bg-yellow-500/20 rounded-lg">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-sm font-medium">Hope</div>
                </div>
                <div className="p-4 bg-green-500/20 rounded-lg">
                  <div className="text-2xl mb-2">🕊️</div>
                  <div className="text-sm font-medium">Peace</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🎯 Basic Test - Memorial Garden UI Working
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  This confirms the modal system is working. The 3D VR experience will be loaded next.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
