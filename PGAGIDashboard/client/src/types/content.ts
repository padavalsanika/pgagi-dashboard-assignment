export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description?: string;
  content: any;
  imageUrl?: string;
  sourceUrl?: string;
  category?: string;
  publishedAt?: Date;
  createdAt?: Date;
  isFavorite?: boolean;
}

export interface UserPreferences {
  categories: string[];
  notifications: {
    breaking: boolean;
    digest: boolean;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  preferences?: UserPreferences;
}

export interface SearchFilters {
  query: string;
  category?: string;
  type?: string;
}

export interface ContentStats {
  totalArticles: number;
  moviesWatched: number;
  favorites: number;
  socialPosts: number;
}
