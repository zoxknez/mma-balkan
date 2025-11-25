'use client';

import { motion } from 'framer-motion';
import { GlitchText } from '@/components/ui/UIPrimitives';

export function NewsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center relative"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-red-600/10 rounded-3xl blur-xl" />
      
      <motion.div
        className="relative"
        animate={{
          textShadow: [
            '0 0 20px rgba(249, 115, 22, 0.5)',
            '0 0 40px rgba(249, 115, 22, 0.8)',
            '0 0 20px rgba(249, 115, 22, 0.5)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <GlitchText
          text="📰 BALKANSKE MMA VESTI 📰"
          className="text-5xl font-bold mb-6"
        />
      </motion.div>
      
      <motion.p 
        className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Agregator vesti sa najsvežijim informacijama iz sveta balkanske MMA scene.
        Ekskluzivni intervjui, analize i brze vesti u realnom vremenu.
      </motion.p>
    </motion.div>
  );
}
