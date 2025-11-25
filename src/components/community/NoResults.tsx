'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { GlitchText } from '@/components/ui/UIPrimitives';

interface NoResultsProps {
  onReset: () => void;
}

export const NoResults = ({ onReset }: NoResultsProps) => {
  return (
    <motion.div 
      className="text-center py-20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card p-12 max-w-lg mx-auto relative overflow-hidden">
        <CyberGrid />
        <div className="relative z-10">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20" />
            <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-pink-500" />
            </div>
          </motion.div>
          
          <GlitchText text="NEMA OBJAVA" className="text-2xl font-bold mb-4" />
          
          <p className="text-gray-400 text-lg mb-8">Nema objava za zadate filtere</p>
          
          <Button 
            variant="neon" 
            onClick={onReset}
            className="relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-20"
              whileHover={{ opacity: 0.4 }}
            />
            <span className="relative z-10 font-semibold">Resetuj filtere</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
