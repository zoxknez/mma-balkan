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

export async function getNews(params: Record<string, unknown>) {
  const qs = buildQueryParams(params as any);
  return apiClient.get<NewsArticle[]>(`${API_CONFIG.ENDPOINTS.NEWS}${qs}`);
}

export const getNewsById = (id: string) => apiClient.get<NewsArticle>(API_CONFIG.ENDPOINTS.NEWS_BY_ID(id));
