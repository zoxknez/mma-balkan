'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  neon?: boolean;
  onClick?: () => void;
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  glass = true,
  neon = false,
  onClick 
}: CardProps) {
  const baseClasses = cn(
    'rounded-2xl transition-all duration-300',
    glass && 'backdrop-blur-lg bg-white/5 border border-white/10',
    neon && 'border-green-400/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]',
    hover && 'hover:scale-105 cursor-pointer',
    onClick && 'cursor-pointer'
  );

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={hover ? { scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        className={cn(baseClasses, className)}
        onClick={onClick}
        style={{
          boxShadow: glass 
            ? '0 8px 32px 0 rgba(0, 255, 136, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
            : undefined
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div 
      className={cn(baseClasses, className)}
      style={{
        boxShadow: glass 
          ? '0 8px 32px 0 rgba(0, 255, 136, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          : undefined
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-white/10', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/10', className)}>
      {children}
    </div>
  );
}