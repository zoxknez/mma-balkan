export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    verified: boolean;
    followers: number;
  };
  content: string;
  images?: string[];
  video?: string;
  link?: {
    url: string;
    title: string;
    description: string;
    image?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  type: 'text' | 'image' | 'video' | 'link' | 'poll';
  location?: string;
}

export interface TrendingTopic {
  id: string;
  name: string;
  posts: number;
  category: string;
}
