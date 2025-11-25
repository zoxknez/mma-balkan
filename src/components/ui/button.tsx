'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'neon' | 'ghost' | 'outline' | 'solid' | 'primary' | 'secondary' | 'neon-gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  loading?: boolean; // Alias for isLoading to support legacy OptimizedButton usage
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}

export function Button({
  variant = 'neon',
  size = 'md',
  className,
  children,
  isLoading = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  // Stabilniji button bez skakanja layout-a: bez hover-scale, sa GPU transformom i čistim fokus prstenom
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-[background,color,box-shadow,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 transform-gpu will-change-transform disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    neon: 'bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-black hover:shadow-lg focus:ring-green-400 disabled:hover:bg-transparent disabled:hover:text-green-400',
    ghost: 'bg-transparent text-white hover:bg-white/10 focus:ring-white/20',
    outline: 'bg-transparent border border-white/20 text-white hover:border-blue-400 hover:text-blue-400 focus:ring-blue-400',
    solid: 'bg-green-400 text-black hover:bg-green-300 focus:ring-green-400',
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    'neon-gradient': 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:from-red-600 hover:to-blue-600 shadow-lg shadow-red-500/25'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-base'
  };
  
  const isButtonLoading = isLoading || loading;
  const isDisabled = disabled || isButtonLoading;

  const motionProps = !isDisabled ? { whileTap: { scale: 0.98 } } : {};

  return (
    <motion.button
      // Bez hover scale da ne pomera susedne elemente; zadržavamo suptilan tap feedback
      {...motionProps}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        variant === 'neon' && 'shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]',
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      aria-busy={isButtonLoading}
      aria-label={ariaLabel}
    >
      {isButtonLoading && (
        <div 
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" 
          role="status"
          aria-label="Loading"
        />
      )}
      {children}
    </motion.button>
  );
}