'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/UIPrimitives';
import { CommunityPost } from './types';

interface CommunityStatsProps {
  posts: CommunityPost[];
}

export const CommunityStats = ({ posts }: CommunityStatsProps) => {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: 15247, label: "Aktivnih članova", color: "#ec4899" },
    { icon: <MessageCircle className="w-8 h-8" />, value: posts.length, label: "Objava uživo", color: "#8b5cf6" },
    { icon: <Heart className="w-8 h-8" />, value: posts.reduce((sum, p) => sum + p.likes, 0), label: "Ukupno lajkova", color: "#ef4444" },
    { icon: <TrendingUp className="w-8 h-8" />, value: posts.filter(p => p.trending).length, label: "U trendu", color: "#f59e0b" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="text-white mb-2 flex justify-center" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
            <AnimatedCounter value={stat.value} />
          </div>
          <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
