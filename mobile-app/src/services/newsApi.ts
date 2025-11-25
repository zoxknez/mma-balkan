import { apiClient } from './api';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  image?: string;
  isBreaking: boolean;
  isFeatured: boolean;
  readTime: number;
  views: number;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  publishedAt: string;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
}

export interface NewsResponse {
  data: NewsArticle[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsFilters {
  search?: string;
  category?: string;
  tags?: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const newsApi = {
  // Get all news articles with filters
  getNews: async (filters: NewsFilters = {}): Promise<NewsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }
    if (filters.isBreaking !== undefined) params.append('isBreaking', filters.isBreaking.toString());
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());
    if (filters.author) params.append('author', filters.author);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/news?${params.toString()}`);
    return response.data;
  },

  // Get single article by ID
  getArticle: async (id: string): Promise<NewsArticle> => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data.data;
  },

  // Like an article
  likeArticle: async (id: string): Promise<void> => {
    await apiClient.post(`/news/${id}/like`);
  },

  // Unlike an article
  unlikeArticle: async (id: string): Promise<void> => {
    await apiClient.delete(`/news/${id}/like`);
  },

  // Bookmark an article
  bookmarkArticle: async (id: string): Promise<void> => {
    await apiClient.post(`/news/${id}/bookmark`);
  },

  // Remove bookmark
  removeBookmark: async (id: string): Promise<void> => {
    await apiClient.delete(`/news/${id}/bookmark`);
  },

  // Get bookmarked articles
  getBookmarkedArticles: async (): Promise<NewsArticle[]> => {
    const response = await apiClient.get('/news/bookmarked');
    return response.data.data;
  },

  // Get featured articles
  getFeaturedArticles: async (limit = 5): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/featured?limit=${limit}`);
    return response.data.data;
  },

  // Get breaking news
  getBreakingNews: async (limit = 10): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/breaking?limit=${limit}`);
    return response.data.data;
  },

  // Get articles by category
  getArticlesByCategory: async (category: string, limit = 20): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/category/${category}?limit=${limit}`);
    return response.data.data;
  },

  // Get articles by author
  getArticlesByAuthor: async (author: string, limit = 20): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/author/${encodeURIComponent(author)}?limit=${limit}`);
    return response.data.data;
  },

  // Search articles
  searchArticles: async (query: string): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  // Get article comments
  getArticleComments: async (id: string, page = 1, limit = 20) => {
    const response = await apiClient.get(`/news/${id}/comments?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Add comment
  addComment: async (id: string, content: string): Promise<Comment> => {
    const response = await apiClient.post(`/news/${id}/comments`, { content });
    return response.data.data;
  },

  // Like comment
  likeComment: async (articleId: string, commentId: string): Promise<void> => {
    await apiClient.post(`/news/${articleId}/comments/${commentId}/like`);
  },

  // Unlike comment
  unlikeComment: async (articleId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/news/${articleId}/comments/${commentId}/like`);
  },

  // Get related articles
  getRelatedArticles: async (id: string, limit = 5): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/${id}/related?limit=${limit}`);
    return response.data.data;
  },

  // Get trending articles
  getTrendingArticles: async (limit = 10): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/trending?limit=${limit}`);
    return response.data.data;
  },

  // Get article statistics
  getArticleStats: async (id: string) => {
    const response = await apiClient.get(`/news/${id}/stats`);
    return response.data.data;
  },
};
