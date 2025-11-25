'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/ui/UIPrimitives';

export const CommunityHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center relative"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-transparent to-purple-600/10 rounded-3xl blur-xl" />
      
      <motion.div
        className="relative"
        animate={{
          textShadow: [
            '0 0 20px rgba(236, 72, 153, 0.5)',
            '0 0 40px rgba(236, 72, 153, 0.8)',
            '0 0 20px rgba(236, 72, 153, 0.5)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <GlitchText
          text="💬 BALKAN MMA COMMUNITY HUB 💬"
          className="text-5xl font-bold mb-6"
        />
      </motion.div>
      
      <motion.p 
        className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Društveni centar balkanske MMA zajednice.
        Deli iskustva, analize i poveži se sa borcima iz regiona.
      </motion.p>
    </motion.div>
  );
};
