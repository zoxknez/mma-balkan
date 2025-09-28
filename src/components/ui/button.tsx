'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'neon' | 'ghost' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  variant = 'neon',
  size = 'md',
  className,
  children,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  // Stabilniji button bez skakanja layout-a: bez hover-scale, sa GPU transformom i čistim fokus prstenom
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-[background,color,box-shadow,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 transform-gpu will-change-transform';
  
  const variants = {
    neon: 'bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-black hover:shadow-lg focus:ring-green-400',
    ghost: 'bg-transparent text-white hover:bg-white/10 focus:ring-white/20',
    outline: 'bg-transparent border border-white/20 text-white hover:border-blue-400 hover:text-blue-400 focus:ring-blue-400',
    solid: 'bg-green-400 text-black hover:bg-green-300 focus:ring-green-400'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-base'
  };

  return (
    <motion.button
      // Bez hover scale da ne pomera susedne elemente; zadržavamo suptilan tap feedback
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        variant === 'neon' && 'shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  );
}