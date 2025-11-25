"use client";
import useSWR from "swr";
import { getNews, getNewsById, NewsArticle, NewsQuery } from "@/lib/api/news";
import { swrConfig } from "@/lib/swr-config";

export type { NewsArticle as ApiNews };
export type { NewsQuery as NewsParams };

// Custom SWR config for news
const newsConfig = {
  ...swrConfig,
  // News updates less frequently
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  dedupingInterval: 10000,
};

export function useNews(params: NewsQuery = {}) {
  // Serialize params to ensure stable key
  const key = ["news", JSON.stringify(params)];
  
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key, 
    () => getNews(params),
    newsConfig
  );
  
  return { 
    data: data?.data ?? [], 
    pagination: data?.pagination, 
    error, 
    isLoading,
    isValidating,
    refresh: mutate 
  };
}

export function useNewsItem(id?: string) {
  const key = id ? ["news", "item", id] : null;
  
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key, 
    () => getNewsById(id!),
    {
      ...newsConfig,
      // Individual articles can be cached longer
      dedupingInterval: 30000,
    }
  );
  
  return { 
    data: data?.data, 
    error, 
    isLoading,
    isValidating,
    refresh: mutate 
  };
}
