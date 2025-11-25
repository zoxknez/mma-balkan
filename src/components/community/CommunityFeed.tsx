'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityPost } from './types';
import { CommunityPostCard } from './CommunityPostCard';

interface CommunityFeedProps {
  posts: CommunityPost[];
}

export const CommunityFeed = ({ posts }: CommunityFeedProps) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <div className="text-center mb-8">
        <motion.h3 
          className="text-3xl font-bold text-white mb-2 flex items-center justify-center"
          animate={{
            textShadow: [
              '0 0 10px rgba(236, 72, 153, 0.5)',
              '0 0 20px rgba(236, 72, 153, 0.8)',
              '0 0 10px rgba(236, 72, 153, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-8 h-8 mr-3 text-pink-500" />
          OBJAVE ZAJEDNICE
          <Zap className="w-8 h-8 ml-3 text-pink-500" />
        </motion.h3>
        <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full" />
      </div>
      
      <div className="space-y-6">
        {posts.map((post, index) => (
          <CommunityPostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Load More */}
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <Button variant="neon" size="lg" className="relative overflow-hidden group px-12 py-4">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <span className="relative z-10 font-bold text-lg">Učitaj više postova</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};
