'use client';

import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import Image from 'next/image';

export interface InteractiveCardProps {
  title: string;
  description?: string;
  image?: string;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  onFavorite?: (isFavorited: boolean) => void;
  onShare?: () => void;
  isFavorited?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const InteractiveCard = memo<InteractiveCardProps>(({
  title,
  description,
  image,
  actions = [],
  onFavorite,
  onShare,
  isFavorited = false,
  className = '',
  children
}) => {
  const [, setIsHovered] = useState(false);

  const handleFavorite = useCallback(() => {
    onFavorite?.(!isFavorited);
  }, [onFavorite, isFavorited]);

  return (
    <motion.div
      className={`relative bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <div className="absolute top-4 right-4 flex space-x-2">
            {onFavorite && (
              <button
                onClick={handleFavorite}
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {description && (
          <p className="text-gray-400 mb-4">{description}</p>
        )}
        
        {children}
        
        {actions.length > 0 && (
          <div className="mt-4 flex space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  action.variant === 'primary'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : action.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});

InteractiveCard.displayName = 'InteractiveCard';
