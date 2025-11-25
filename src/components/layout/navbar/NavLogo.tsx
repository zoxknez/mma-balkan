'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { AccessibleHeading } from '@/components/Accessibility';

export function NavLogo() {
  return (
    <motion.div 
      className="flex items-center space-x-3 shrink-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="flex items-center space-x-3 group">
        <AccessibleHeading level={1} className="sr-only">
          MMA Balkan
        </AccessibleHeading>
        {/* Logo */}
        <motion.div 
          className="relative w-12 h-12"
          whileHover={{ rotate: 6 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl blur-sm opacity-70" />
          <div className="relative w-full h-full bg-gray-900 rounded-xl border border-green-400/40 flex items-center justify-center overflow-hidden">
            <Zap className="w-7 h-7 text-green-300 drop-shadow-[0_0_6px_#00ff88]" />
          </div>
        </motion.div>
        
        {/* Brand Text */}
        <motion.span 
          className="text-2xl font-bold text-white tracking-tight leading-none whitespace-nowrap transition-colors relative block"
          whileHover={{ color: '#86efac' }}
        >
          MMA{' '}
          <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            BALKAN
          </span>
        </motion.span>
      </Link>
    </motion.div>
  );
}
