export const CONTENT_CATEGORIES = [
  { id: 'technology', label: 'Technology', icon: 'fas fa-microchip' },
  { id: 'sports', label: 'Sports', icon: 'fas fa-football-ball' },
  { id: 'finance', label: 'Finance', icon: 'fas fa-chart-line' },
  { id: 'entertainment', label: 'Entertainment', icon: 'fas fa-film' },
  { id: 'health', label: 'Health', icon: 'fas fa-heart' },
  { id: 'science', label: 'Science', icon: 'fas fa-flask' },
];

export const CONTENT_TYPES = [
  { id: 'news', label: 'News', icon: 'fas fa-newspaper' },
  { id: 'movie', label: 'Movies', icon: 'fas fa-film' },
  { id: 'social', label: 'Social', icon: 'fas fa-share' },
];

export const DEFAULT_USER_PREFERENCES = {
  categories: ['technology', 'finance'],
  notifications: {
    breaking: true,
    digest: false,
  },
};

export const API_ENDPOINTS = {
  CONTENT: '/api/content',
  NEWS: '/api/news',
  MOVIES: '/api/movies',
  SOCIAL: '/api/social',
  SEARCH: '/api/content/search',
  TRENDING: '/api/content/trending',
  USERS: '/api/users',
  FAVORITES: '/api/users/:userId/favorites',
  CONTENT_ORDER: '/api/users/:userId/content-order',
};

export const DEBOUNCE_DELAY = 300;
export const ITEMS_PER_PAGE = 20;
export const INFINITE_SCROLL_THRESHOLD = 0.8;
