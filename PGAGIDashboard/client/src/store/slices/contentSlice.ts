import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, SearchFilters } from '@/types/content';
import { contentAPI } from '@/services/api';

interface ContentState {
  items: ContentItem[];
  favorites: ContentItem[];
  trending: ContentItem[];
  searchResults: ContentItem[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  searchQuery: string;
  activeCategory: string | null;
  activeTab: 'all' | 'news' | 'movies' | 'social' | 'trending' | 'favorites';
  contentOrder: string[];
}

const initialState: ContentState = {
  items: [],
  favorites: [],
  trending: [],
  searchResults: [],
  loading: false,
  searchLoading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  searchQuery: '',
  activeCategory: null,
  activeTab: 'all',
  contentOrder: [],
};

// Async thunks
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async ({ page = 1, category, append = false }: { page?: number; category?: string; append?: boolean }) => {
    const data = await contentAPI.getContent(page, 20, category);
    return { data, page, append };
  }
);

export const fetchNews = createAsyncThunk(
  'content/fetchNews',
  async (category = 'technology') => {
    return await contentAPI.getNews(category);
  }
);

export const fetchMovies = createAsyncThunk(
  'content/fetchMovies',
  async () => {
    return await contentAPI.getMovies();
  }
);

export const fetchSocialPosts = createAsyncThunk(
  'content/fetchSocialPosts',
  async () => {
    return await contentAPI.getSocialPosts();
  }
);

export const searchContent = createAsyncThunk(
  'content/searchContent',
  async ({ query, page = 1 }: { query: string; page?: number }) => {
    return await contentAPI.searchContent(query, page);
  }
);

export const fetchTrendingContent = createAsyncThunk(
  'content/fetchTrendingContent',
  async (category?: string) => {
    return await contentAPI.getTrendingContent(category);
  }
);

export const fetchAllContent = createAsyncThunk(
  'content/fetchAllContent',
  async () => {
    // Fetch existing content from storage instead of external APIs
    return await contentAPI.getContent(1, 20);
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<string | null>) => {
      state.activeCategory = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'all' | 'news' | 'movies' | 'social' | 'trending' | 'favorites'>) => {
      state.activeTab = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    updateContentOrder: (state, action: PayloadAction<string[]>) => {
      state.contentOrder = action.payload;
      // Reorder items based on the new order
      const orderedItems = action.payload
        .map(id => state.items.find(item => item.id === id))
        .filter(Boolean) as ContentItem[];
      const unorderedItems = state.items.filter(item => !action.payload.includes(item.id));
      state.items = [...orderedItems, ...unorderedItems];
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.isFavorite = true;
        if (!state.favorites.find(fav => fav.id === item.id)) {
          state.favorites.push(item);
        }
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.isFavorite = false;
      }
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
    },
    resetPage: (state) => {
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch content
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        const { data, page, append } = action.payload;
        
        if (append) {
          state.items = [...state.items, ...data];
        } else {
          state.items = data;
        }
        
        state.currentPage = page;
        state.hasMore = data.length === 20;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      })
      
      // Fetch news
      .addCase(fetchNews.fulfilled, (state, action) => {
        // Add news items to the main items array
        const newItems = action.payload.filter(
          newItem => !state.items.find(item => item.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
      })
      
      // Fetch movies
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const newItems = action.payload.filter(
          newItem => !state.items.find(item => item.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
      })
      
      // Fetch social posts
      .addCase(fetchSocialPosts.fulfilled, (state, action) => {
        const newItems = action.payload.filter(
          newItem => !state.items.find(item => item.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
      })
      
      // Search content
      .addCase(searchContent.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Failed to search content';
      })
      
      // Fetch trending
      .addCase(fetchTrendingContent.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      
      // Fetch all content
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.hasMore = action.payload.length === 20;
      })
      .addCase(fetchAllContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });
  },
});

export const {
  setSearchQuery,
  setActiveCategory,
  setActiveTab,
  clearSearchResults,
  updateContentOrder,
  addToFavorites,
  removeFromFavorites,
  resetPage,
} = contentSlice.actions;

export default contentSlice.reducer;
