export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  publishDate: string;
  views: number;
  likes: number;
  image?: string | undefined;
  sourceUrl?: string;
  featured: boolean;
  trending: boolean;
}

export interface NewsStatsData {
  totalNews: number;
  trendingCount: number;
  totalViews: number;
  activeAuthors: number;
}

export type SortOption = 'date' | 'views' | 'likes';
