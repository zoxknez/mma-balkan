'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users } from 'lucide-react';
import { Post, TrendingTopic } from './types';
import { PostCard } from './PostCard';
import { CreatePost } from './feed/CreatePost';
import { Sidebar } from './feed/Sidebar';

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('following');

  useEffect(() => {
    fetchPosts();
    fetchTrendingTopics();
  }, []);

  const fetchPosts = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts([
        {
          id: '1',
          author: {
            id: '1',
            name: 'Marko Petrović',
            username: '@marko_mma',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            verified: true,
            followers: 1200
          },
          content: 'Odlična borba Jon Jones-a! Njegova strategija je bila savršena. Šta mislite o njegovoj sledećoj borbi? #UFC #JonJones #MMA',
          images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&h=300&fit=crop'],
          timestamp: '2024-01-15T10:30:00Z',
          likes: 142,
          comments: 23,
          shares: 8,
          isLiked: false,
          isBookmarked: false,
          tags: ['UFC', 'JonJones', 'MMA'],
          type: 'image'
        },
        {
          id: '2',
          author: {
            id: '2',
            name: 'Ana Nikolić',
            username: '@ana_fight_fan',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            verified: false,
            followers: 450
          },
          content: 'Treniram već 3 godine i konačno sam spremna za prvu amatersku borbu! 🥊 #Training #FirstFight #WomenInMMA',
          timestamp: '2024-01-15T09:15:00Z',
          likes: 89,
          comments: 15,
          shares: 3,
          isLiked: true,
          isBookmarked: false,
          tags: ['Training', 'FirstFight', 'WomenInMMA'],
          type: 'text'
        },
        {
          id: '3',
          author: {
            id: '3',
            name: 'UFC Balkan',
            username: '@ufc_balkan',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
            verified: true,
            followers: 15000
          },
          content: 'BREAKING: UFC 300 karta je objavljena! Glavna borba: Jon Jones vs Stipe Miocic. Ko će pobediti?',
          link: {
            url: 'https://ufc.com/events/ufc-300',
            title: 'UFC 300: Jon Jones vs Stipe Miocic',
            description: 'Pogledajte kompletnu kartu borbi za UFC 300',
            image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=200&fit=crop'
          },
          timestamp: '2024-01-15T08:45:00Z',
          likes: 256,
          comments: 67,
          shares: 45,
          isLiked: false,
          isBookmarked: true,
          tags: ['UFC300', 'Breaking', 'JonJones', 'StipeMiocic'],
          type: 'link'
        }
      ]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingTopics = async () => {
    setTrendingTopics([
      { id: '1', name: '#UFC300', posts: 1234, category: 'Events' },
      { id: '2', name: '#JonJones', posts: 892, category: 'Fighters' },
      { id: '3', name: '#WomenInMMA', posts: 567, category: 'Community' },
      { id: '4', name: '#Training', posts: 445, category: 'Training' },
      { id: '5', name: '#Bellator', posts: 334, category: 'Events' }
    ]);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    // Implement share functionality
    console.log('Sharing post:', postId);
  };

  const handleCreatePost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Socijalna mreža</h1>
        <p className="text-gray-600">Povezujte se sa drugim MMA fanovima i delite svoja mišljenja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="following">Pratim</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="nearby">U blizini</TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="space-y-4">
              {/* Create Post */}
              <CreatePost onPostCreate={handleCreatePost} />

              {/* Posts */}
              {posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              ))}
            </TabsContent>

            <TabsContent value="trending">
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trending sadržaj</h3>
                <p className="text-gray-600">Najpopularniji sadržaj će biti prikazan ovde</p>
              </div>
            </TabsContent>

            <TabsContent value="nearby">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokalni sadržaj</h3>
                <p className="text-gray-600">Sadržaj iz vaše okoline će biti prikazan ovde</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar trendingTopics={trendingTopics} />
        </div>
      </div>
    </div>
  );
}
