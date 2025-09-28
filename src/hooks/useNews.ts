"use client";
import useSWR from "swr";
import { apiClient, API_CONFIG, buildQueryParams } from "@/lib/api/client";

export type ApiNews = {
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

export type NewsParams = Partial<{ page: number; limit: number; search: string; category: string; featured: boolean; trending: boolean }>;

export function useNews(params: NewsParams = {}) {
  const key = ["news", params];
  const fetcher = async () => {
    const qs = buildQueryParams(params);
    return apiClient.get<ApiNews[]>(`${API_CONFIG.ENDPOINTS.NEWS}${qs}`);
  };
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { data: data?.data ?? [], pagination: data?.pagination, error, isLoading, refresh: mutate };
}

export function useNewsItem(id?: string) {
  const key = id ? ["news", id] : null;
  const fetcher = async () => apiClient.get<ApiNews>(API_CONFIG.ENDPOINTS.NEWS_BY_ID(id!));
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { data: data?.data, error, isLoading, refresh: mutate };
}
