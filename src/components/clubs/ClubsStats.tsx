'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Trophy, Target } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/UIPrimitives';
import { UiClub } from './types';

interface ClubsStatsProps {
  clubs: UiClub[];
  filteredCount: number;
}

export const ClubsStats = ({ clubs, filteredCount }: ClubsStatsProps) => {
  const stats = [
    { icon: <Shield className="w-8 h-8" />, value: filteredCount, label: "Aktivnih klubova", color: "#22d3ee" },
    { icon: <Users className="w-8 h-8" />, value: clubs.reduce((sum, c) => sum + (c.members ?? 0), 0), label: "Ukupnih članova", color: "#3b82f6" },
    { icon: <Trophy className="w-8 h-8" />, value: 0, label: "Šampiona", color: "#f59e0b" },
    { icon: <Target className="w-8 h-8" />, value: 10, label: "Avg Rating", color: "#10b981" }
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
          <div className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
            <AnimatedCounter value={stat.value} />
          </div>
          <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
