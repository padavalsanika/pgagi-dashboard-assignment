import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences, ContentStats } from '@/types/content';
import { userAPI } from '@/services/api';
import { DEFAULT_USER_PREFERENCES } from '@/utils/constants';

interface UserState {
  currentUser: User | null;
  preferences: UserPreferences;
  stats: ContentStats;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: {
    id: 'default-user-id',
    username: 'Sanika Padaval',
    email: 'sanika6701@gmail.com',
    preferences: DEFAULT_USER_PREFERENCES,
  },
  preferences: DEFAULT_USER_PREFERENCES,
  stats: {
    totalArticles: 0,
    moviesWatched: 0,
    favorites: 0,
    socialPosts: 0,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string) => {
    return await userAPI.getUser(userId);
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async ({ userId, preferences }: { userId: string; preferences: UserPreferences }) => {
    return await userAPI.updatePreferences(userId, preferences);
  }
);

export const fetchUserFavorites = createAsyncThunk(
  'user/fetchFavorites',
  async (userId: string) => {
    return await userAPI.getFavorites(userId);
  }
);

export const addToFavorites = createAsyncThunk(
  'user/addToFavorites',
  async ({ userId, contentId }: { userId: string; contentId: string }) => {
    await userAPI.addToFavorites(userId, contentId);
    return contentId;
  }
);

export const removeFromFavorites = createAsyncThunk(
  'user/removeFromFavorites',
  async ({ userId, contentId }: { userId: string; contentId: string }) => {
    await userAPI.removeFromFavorites(userId, contentId);
    return contentId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      if (action.payload.preferences) {
        state.preferences = action.payload.preferences;
      }
    },
    updatePreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
    },
    updateStats: (state, action: PayloadAction<Partial<ContentStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.preferences = DEFAULT_USER_PREFERENCES;
      state.stats = {
        totalArticles: 0,
        moviesWatched: 0,
        favorites: 0,
        socialPosts: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        if (action.payload.preferences) {
          state.preferences = action.payload.preferences;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      
      // Update preferences
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        if (action.payload.preferences) {
          state.preferences = action.payload.preferences;
        }
      })
      
      // Fetch favorites
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.stats.favorites = action.payload.length;
      })
      
      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state) => {
        state.stats.favorites += 1;
      })
      
      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state) => {
        state.stats.favorites = Math.max(0, state.stats.favorites - 1);
      });
  },
});

export const {
  setCurrentUser,
  updatePreferences,
  updateStats,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
