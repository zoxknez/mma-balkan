'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './api/client';

// CMS Types
export interface ContentItem {
  id: string;
  type: 'fighter' | 'event' | 'news' | 'club';
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  author: {
    id: string;
    name: string;
    email: string;
  };
  tags: string[];
  categories: string[];
  featuredImage?: string;
  gallery?: string[];
  metadata?: Record<string, unknown>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFilter {
  type?: string;
  status?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ContentStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  byType: Record<string, number>;
  byAuthor: Record<string, number>;
  recent: ContentItem[];
}

// CMS Hook
export function useCMS() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ContentStats | null>(null);

  // Fetch content
  const fetchContent = useCallback(async (filters?: ContentFilter) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.set('type', filters.type);
      if (filters?.status) queryParams.set('status', filters.status);
      if (filters?.author) queryParams.set('author', filters.author);
      if (filters?.search) queryParams.set('search', filters.search);
      if (filters?.dateFrom) queryParams.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.set('dateTo', filters.dateTo);
      if (filters?.tags?.length) queryParams.set('tags', filters.tags.join(','));
      if (filters?.categories?.length) queryParams.set('categories', filters.categories.join(','));

      const endpoint = `/cms/content${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ content: ContentItem[] }>(endpoint);
      
      if (response.success && response.data) {
        setContent(response.data.content);
      } else {
        setError(response.error || 'Failed to fetch content');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get<ContentStats>('/cms/stats');
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Create content
  const createContent = useCallback(async (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ content: ContentItem }>('/cms/content', data);
      
      if (response.success && response.data) {
        setContent(prev => [response.data!.content, ...prev]);
        return response.data.content;
      } else {
        setError(response.error || 'Failed to create content');
        return null;
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create content');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update content
  const updateContent = useCallback(async (id: string, data: Partial<ContentItem>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<{ content: ContentItem }>(`/cms/content/${id}`, data);
      
      if (response.success && response.data) {
        setContent(prev => prev.map(item => 
          item.id === id ? response.data!.content : item
        ));
        return response.data.content;
      } else {
        setError(response.error || 'Failed to update content');
        return null;
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update content');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete content
  const deleteContent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/cms/content/${id}`);
      
      if (response.success) {
        setContent(prev => prev.filter(item => item.id !== id));
        return true;
      } else {
        setError(response.error || 'Failed to delete content');
        return false;
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete content');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Publish content
  const publishContent = useCallback(async (id: string) => {
    return updateContent(id, { 
      status: 'published', 
      publishedAt: new Date().toISOString() 
    });
  }, [updateContent]);

  // Archive content
  const archiveContent = useCallback(async (id: string) => {
    return updateContent(id, { status: 'archived' });
  }, [updateContent]);

  // Initialize
  useEffect(() => {
    fetchContent();
    fetchStats();
  }, [fetchContent, fetchStats]);

  return {
    content,
    loading,
    error,
    stats,
    fetchContent,
    fetchStats,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    archiveContent
  };
}

// Content Editor Hook
export function useContentEditor(initialContent?: Partial<ContentItem>) {
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    type: 'news',
    status: 'draft',
    tags: [],
    categories: [],
    ...initialContent
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback((field: keyof ContentItem, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors['title'] = 'Title is required';
    }

    if (!formData.content?.trim()) {
      newErrors['content'] = 'Content is required';
    }

    if (!formData.slug?.trim()) {
      newErrors['slug'] = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      type: 'news',
      status: 'draft',
      tags: [],
      categories: []
    });
    setErrors({});
    setIsDirty(false);
  }, []);

  return {
    formData,
    errors,
    isDirty,
    updateField,
    validateForm,
    generateSlug,
    resetForm
  };
}

// CMS Utilities
export const cmsUtils = {
  // Get content type display name
  getContentTypeName: (type: string): string => {
    const typeNames: Record<string, string> = {
      fighter: 'Borac',
      event: 'Događaj',
      news: 'Vest',
      club: 'Klub'
    };
    return typeNames[type] || type;
  },

  // Get status display name
  getStatusName: (status: string): string => {
    const statusNames: Record<string, string> = {
      draft: 'Nacrt',
      published: 'Objavljeno',
      archived: 'Arhivirano'
    };
    return statusNames[status] || status;
  },

  // Get status color
  getStatusColor: (status: string): string => {
    const statusColors: Record<string, string> = {
      draft: 'text-yellow-400',
      published: 'text-green-400',
      archived: 'text-gray-400'
    };
    return statusColors[status] || 'text-gray-400';
  },

  // Get content type color
  getContentTypeColor: (type: string): string => {
    const typeColors: Record<string, string> = {
      fighter: 'text-blue-400',
      event: 'text-purple-400',
      news: 'text-green-400',
      club: 'text-orange-400'
    };
    return typeColors[type] || 'text-gray-400';
  },

  // Format date
  formatDate: (date: string): string => {
    return new Date(date).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get excerpt
  getExcerpt: (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  },

  // Validate slug
  validateSlug: (slug: string): boolean => {
    return /^[a-z0-9-]+$/.test(slug);
  },

  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  // Get content preview
  getContentPreview: (content: ContentItem): string => {
    if (content.excerpt) return content.excerpt;
    return cmsUtils.getExcerpt(content.content);
  },

  // Check if content is published
  isPublished: (content: ContentItem): boolean => {
    return content.status === 'published';
  },

  // Check if content is draft
  isDraft: (content: ContentItem): boolean => {
    return content.status === 'draft';
  },

  // Check if content is archived
  isArchived: (content: ContentItem): boolean => {
    return content.status === 'archived';
  }
};
