'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './api/client';

// Social Types
export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isShared: boolean;
  images?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  isFollowing: boolean;
  isVerified: boolean;
  joinedAt: string;
}

export interface SocialStats {
  totalPosts: number;
  totalUsers: number;
  totalLikes: number;
  totalComments: number;
  trendingTags: Array<{ tag: string; count: number }>;
  topUsers: User[];
}

// Social Hook
export function useSocial() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SocialStats | null>(null);

  // Fetch posts
  const fetchPosts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    tag?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.userId) queryParams.set('userId', params.userId);
      if (params?.tag) queryParams.set('tag', params.tag);

      const endpoint = `/social/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ posts: Post[] }>(endpoint);
      
      if (response.success && response.data) {
        setPosts(response.data.posts);
      } else {
        setError(response.error || 'Failed to fetch posts');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.search) queryParams.set('search', params.search);

      const endpoint = `/social/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ users: User[] }>(endpoint);
      
      if (response.success && response.data) {
        setUsers(response.data.users);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get<SocialStats>('/social/stats');
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch social stats:', err);
    }
  }, []);

  // Create post
  const createPost = useCallback(async (content: string, images?: string[], tags?: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ post: Post }>('/social/posts', {
        content,
        images,
        tags
      });
      
      if (response.success && response.data) {
        setPosts(prev => [response.data!.post, ...prev]);
        return response.data.post;
      } else {
        setError(response.error || 'Failed to create post');
        return null;
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Like post
  const likePost = useCallback(async (postId: string) => {
    try {
      const response = await apiClient.post(`/social/posts/${postId}/like`, undefined);
      
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
              }
            : post
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to like post:', err);
      return false;
    }
  }, []);

  // Share post
  const sharePost = useCallback(async (postId: string) => {
    try {
      const response = await apiClient.post(`/social/posts/${postId}/share`, undefined);
      
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isShared: !post.isShared,
                shares: post.isShared ? post.shares - 1 : post.shares + 1
              }
            : post
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to share post:', err);
      return false;
    }
  }, []);

  // Follow user
  const followUser = useCallback(async (userId: string) => {
    try {
      const response = await apiClient.post(`/social/users/${userId}/follow`, undefined);
      
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                isFollowing: !user.isFollowing,
                followers: user.isFollowing ? user.followers - 1 : user.followers + 1
              }
            : user
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to follow user:', err);
      return false;
    }
  }, []);

  // Initialize
  useEffect(() => {
    fetchPosts();
    fetchUsers();
    fetchStats();
  }, [fetchPosts, fetchUsers, fetchStats]);

  return {
    posts,
    users,
    loading,
    error,
    stats,
    fetchPosts,
    fetchUsers,
    fetchStats,
    createPost,
    likePost,
    sharePost,
    followUser
  };
}

// Post Hook
export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch post
  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ post: Post }>(`/social/posts/${postId}`);
      
      if (response.success && response.data) {
        setPost(response.data.post);
      } else {
        setError(response.error || 'Failed to fetch post');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const response = await apiClient.get<{ comments: Comment[] }>(`/social/posts/${postId}/comments`);
      
      if (response.success && response.data) {
        setComments(response.data.comments);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, [postId]);

  // Add comment
  const addComment = useCallback(async (content: string, parentId?: string) => {
    try {
      const response = await apiClient.post<{ comment: Comment }>(`/social/posts/${postId}/comments`, {
        content,
        parentId
      });
      
      if (response.success && response.data) {
        if (parentId) {
          // Add reply to parent comment
          setComments(prev => prev.map(comment => 
            comment.id === parentId 
              ? { ...comment, replies: [...(comment.replies || []), response.data!.comment] }
              : comment
          ));
        } else {
          // Add new top-level comment
          setComments(prev => [response.data!.comment, ...prev]);
        }
        return response.data.comment;
      }
      return null;
    } catch (err) {
      console.error('Failed to add comment:', err);
      return null;
    }
  }, [postId]);

  // Like comment
  const likeComment = useCallback(async (commentId: string) => {
    try {
      const response = await apiClient.post(`/social/comments/${commentId}/like`, undefined);
      
      if (response.success) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
              }
            : comment
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to like comment:', err);
      return false;
    }
  }, []);

  // Initialize
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  return {
    post,
    comments,
    loading,
    error,
    fetchPost,
    fetchComments,
    addComment,
    likeComment
  };
}

// Social Utilities
export const socialUtils = {
  // Format number
  formatNumber: (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  },

  // Format time ago
  formatTimeAgo: (date: string): string => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Upravo sada';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minuta`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sati`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dana`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} meseci`;
    return `${Math.floor(diffInSeconds / 31536000)} godina`;
  },

  // Extract hashtags
  extractHashtags: (text: string): string[] => {
    const hashtagRegex = /#[\w\u0400-\u04FF]+/g;
    return text.match(hashtagRegex) || [];
  },

  // Extract mentions
  extractMentions: (text: string): string[] => {
    const mentionRegex = /@[\w\u0400-\u04FF]+/g;
    return text.match(mentionRegex) || [];
  },

  // Format post content
  formatPostContent: (content: string): string => {
    return content
      .replace(/#[\w\u0400-\u04FF]+/g, '<span class="text-blue-400 font-medium">$&</span>')
      .replace(/@[\w\u0400-\u04FF]+/g, '<span class="text-green-400 font-medium">$&</span>')
      .replace(/\n/g, '<br>');
  },

  // Get user initials
  getUserInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  // Validate post content
  validatePostContent: (content: string): { isValid: boolean; error?: string } => {
    if (!content.trim()) {
      return { isValid: false, error: 'Sadržaj je obavezan' };
    }
    if (content.length > 2000) {
      return { isValid: false, error: 'Sadržaj je previše dugačak (maksimalno 2000 karaktera)' };
    }
    return { isValid: true };
  }
};
