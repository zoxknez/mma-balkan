'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CyberGrid } from '@/components/effects/ParticleSystem';

export const CreatePost = () => {
  const [newPost, setNewPost] = useState('');

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="glass-card p-6 relative overflow-hidden">
        <CyberGrid />
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
              U
            </div>
            <div>
              <h3 className="text-white font-semibold">Podeli sa zajednicom</h3>
              <p className="text-gray-400 text-sm">Šta imaš na umu, borče?</p>
            </div>
          </div>
          
          <div className="relative mb-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Napiši nešto o MMA-u, treningu, ili podeli svoje iskustvo..."
              className="w-full bg-gray-800/50 border border-pink-400/30 rounded-xl p-4 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all backdrop-blur-sm resize-none h-24"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                📷 Media
              </Button>
              <Button variant="outline" size="sm">
                🏷️ Tag
              </Button>
            </div>
            <Button variant="neon" disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Podeli
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
