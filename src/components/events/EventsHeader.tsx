'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Trophy, Users } from 'lucide-react';
import { GlitchText, AnimatedCounter } from '@/components/ui/UIPrimitives';

interface EventsHeaderProps {
  totalEvents: number;
  liveEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
}

export const EventsHeader = ({ totalEvents, liveEvents, upcomingEvents, totalAttendees }: EventsHeaderProps) => {
  const stats = [
    { icon: <Calendar className="w-8 h-8" />, value: totalEvents, label: "Događaja", color: "#8b5cf6" },
    { icon: <Activity className="w-8 h-8" />, value: liveEvents, label: "Sada uživo", color: "#ef4444" },
    { icon: <Trophy className="w-8 h-8" />, value: upcomingEvents, label: "Nadolazeći", color: "#3b82f6" },
    { icon: <Users className="w-8 h-8" />, value: totalAttendees, label: "Ukupno gledalaca", color: "#10b981" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center relative"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10 rounded-3xl blur-xl" />
      
      <motion.div
        className="relative"
        animate={{
          textShadow: [
            '0 0 20px rgba(147, 51, 234, 0.5)',
            '0 0 40px rgba(147, 51, 234, 0.8)',
            '0 0 20px rgba(147, 51, 234, 0.5)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <GlitchText
          text="📅 BALKANSKI MMA DOGAĐAJI 📅"
          className="text-5xl font-bold mb-6"
        />
      </motion.div>
      
      <motion.p 
        className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Kalendar najvažnijih MMA događaja na Balkanu.
        Praćenje uživo, analize i ekskluzivne informacije.
      </motion.p>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
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
            <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
              <AnimatedCounter value={stat.value} />
            </div>
            <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
