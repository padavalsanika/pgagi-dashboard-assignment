import axios from 'axios';
import { ContentItem, User, UserPreferences } from '@/types/content';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentAPI = {
  getContent: async (page = 1, limit = 20, category?: string): Promise<ContentItem[]> => {
    const response = await api.get('/api/content', {
      params: { page, limit, category }
    });
    return response.data;
  },

  searchContent: async (query: string, page = 1, limit = 20): Promise<ContentItem[]> => {
    const response = await api.get('/api/content/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  getTrendingContent: async (category?: string): Promise<ContentItem[]> => {
    const response = await api.get('/api/content/trending', {
      params: { category }
    });
    return response.data;
  },

  getNews: async (category = 'technology'): Promise<ContentItem[]> => {
    const response = await api.get('/api/news', {
      params: { category }
    });
    return response.data;
  },

  getMovies: async (): Promise<ContentItem[]> => {
    const response = await api.get('/api/movies');
    return response.data;
  },

  getSocialPosts: async (): Promise<ContentItem[]> => {
    const response = await api.get('/api/social');
    return response.data;
  },
};

export const userAPI = {
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  updatePreferences: async (userId: string, preferences: UserPreferences): Promise<User> => {
    const response = await api.put(`/api/users/${userId}/preferences`, preferences);
    return response.data;
  },

  getFavorites: async (userId: string): Promise<ContentItem[]> => {
    const response = await api.get(`/api/users/${userId}/favorites`);
    return response.data;
  },

  addToFavorites: async (userId: string, contentId: string): Promise<void> => {
    await api.post(`/api/users/${userId}/favorites`, { contentId });
  },

  removeFromFavorites: async (userId: string, contentId: string): Promise<void> => {
    await api.delete(`/api/users/${userId}/favorites/${contentId}`);
  },

  checkFavorite: async (userId: string, contentId: string): Promise<boolean> => {
    const response = await api.get(`/api/users/${userId}/favorites/${contentId}/check`);
    return response.data.isFavorite;
  },

  getContentOrder: async (userId: string): Promise<string[]> => {
    const response = await api.get(`/api/users/${userId}/content-order`);
    return response.data.contentOrder || [];
  },

  updateContentOrder: async (userId: string, contentOrder: string[]): Promise<void> => {
    await api.put(`/api/users/${userId}/content-order`, { contentOrder });
  },
};

export default api;
