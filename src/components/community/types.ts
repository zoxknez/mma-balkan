export interface Author {
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  level: string;
}

export interface CommunityPost {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  type: 'post' | 'analysis' | 'tip' | 'announcement' | 'workout';
  trending: boolean;
  media: string | null;
}

export type SortOption = 'timestamp' | 'likes' | 'comments';
