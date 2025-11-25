'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Target, Zap, Activity, Hash, Heart, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { CommunityPost } from './types';

interface CommunityPostCardProps {
  post: CommunityPost;
  index: number;
}

export const CommunityPostCard = ({ post, index }: CommunityPostCardProps) => {
  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      'post': <MessageCircle className="w-4 h-4" />,
      'analysis': <TrendingUp className="w-4 h-4" />,
      'tip': <Target className="w-4 h-4" />,
      'announcement': <Zap className="w-4 h-4" />,
      'workout': <Activity className="w-4 h-4" />
    };
    return icons[type] || <MessageCircle className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'post': 'text-blue-400',
      'analysis': 'text-purple-400',
      'tip': 'text-green-400',
      'announcement': 'text-yellow-400',
      'workout': 'text-red-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Pre ${diffDays}d`;
    if (diffHours > 0) return `Pre ${diffHours}h`;
    return 'Sada';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 1.7 + index * 0.1,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="relative group"
    >
      {/* Holographic Frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute inset-0 border border-transparent group-hover:border-pink-400/30 rounded-2xl transition-colors duration-500" />
      
      {/* Post Card */}
      <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 group-hover:scale-[1.01]">
        <CyberGrid />
        
        <div className="relative z-10">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                {post.author.avatar}
              </div>
              
              {/* Author Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-semibold group-hover:text-pink-400 transition-colors">
                    {post.author.name}
                  </h4>
                  {post.author.verified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{post.author.username}</span>
                  <span>•</span>
                  <span className="text-purple-400">{post.author.level}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(post.timestamp)}</span>
                </div>
              </div>
            </div>
            
            {/* Post Type & Trending */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800/50 border ${getTypeColor(post.type)}`}>
                {getTypeIcon(post.type)}
                <span className="ml-1 capitalize">{post.type}</span>
              </div>
              {post.trending && (
                <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  U TRENDU
                </div>
              )}
            </div>
          </div>
          
          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-xs font-medium text-pink-300"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Media Placeholder */}
          {post.media && (
            <div className="mb-4">
              <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                <CyberGrid />
                <div className="relative z-10 text-4xl">🎬</div>
                <div className="absolute inset-0 border border-pink-400/20 rounded-lg" />
              </div>
            </div>
          )}
          
          {/* Post Stats & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-6">
              <motion.button
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full group-hover:bg-red-400/10 transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="font-medium">{post.likes}</span>
              </motion.button>
              
              <motion.button
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="font-medium">{post.comments}</span>
              </motion.button>
              
              <motion.button
                className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="font-medium">{post.shares}</span>
              </motion.button>
            </div>
            
            <Button variant="outline" size="sm">
              Odgovori
            </Button>
          </div>
        </div>
      </div>
      
      {/* Neural Scan Lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        animate={{
          background: [
            'linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.1) 50%, transparent 100%)',
            'linear-gradient(90deg, transparent 50%, rgba(236, 72, 153, 0.1) 100%, transparent 150%)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
    </motion.div>
  );
};
