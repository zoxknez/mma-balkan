import { apiClient, API_CONFIG, buildQueryParams } from "./client";

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  authorName: string;
  imageUrl?: string;
  featured: boolean;
  trending: boolean;
  views: number;
  likes: number;
  publishAt: string; // ISO
};

export type NewsQuery = Partial<{ page: number; limit: number; search: string; category: string }>

export async function getNews(params: NewsQuery) {
  const qs = buildQueryParams(params);
  return apiClient.get<NewsArticle[]>(`${API_CONFIG.ENDPOINTS.NEWS}${qs}`);
}

export const getNewsById = (id: string) => apiClient.get<NewsArticle>(API_CONFIG.ENDPOINTS.NEWS_BY_ID(id));

export const incrementNewsView = (id: string) => apiClient.post<{ views: number }>(API_CONFIG.ENDPOINTS.NEWS_VIEW(id), {});
export const toggleNewsLike = (id: string, action: 'inc' | 'dec' = 'inc') => apiClient.post<{ likes: number }>(`${API_CONFIG.ENDPOINTS.NEWS_LIKE(id)}?action=${action}`, {});
