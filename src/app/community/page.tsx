'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityStats } from '@/components/community/CommunityStats';
import { CreatePost } from '@/components/community/CreatePost';
import { CommunityControls } from '@/components/community/CommunityControls';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { NoResults } from '@/components/community/NoResults';
import { mockPosts } from '@/components/community/data';
import { SortOption } from '@/components/community/types';

export default function CommunityPage() {
  const [selectedType, setSelectedType] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('timestamp');

  const filteredPosts = mockPosts
    .filter(post => 
      (selectedType === 'Sve' || post.type === selectedType) &&
      (post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'likes':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating Community Elements */}
        <div className="absolute top-12 right-8 opacity-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.5, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            <MessageCircle className="w-52 h-52 text-pink-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-12 left-8 opacity-10">
          <motion.div
            animate={{ rotate: -360, x: [-25, 25, -25] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            <Users className="w-48 h-48 text-purple-500" />
          </motion.div>
        </div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <CommunityHeader />
            
            <CommunityStats posts={mockPosts} />

            <CreatePost />

            <CommunityControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {filteredPosts.length > 0 ? (
              <CommunityFeed posts={filteredPosts} />
            ) : (
              <NoResults 
                onReset={() => {
                  setSelectedType('Sve');
                  setSearchTerm('');
                  setSortBy('timestamp');
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
