import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setActiveTab, setActiveCategory } from '@/store/slices/contentSlice';
import type { AppDispatch } from '@/store';
import { updatePreferences } from '@/store/slices/userSlice';
import { CONTENT_CATEGORIES } from '@/utils/constants';
import { BarChart3, Home, User, TrendingUp, Heart, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTab } = useSelector((state: RootState) => state.content);
  const { preferences } = useSelector((state: RootState) => state.user);

  const handlePreferenceChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...preferences.categories, categoryId]
      : preferences.categories.filter(cat => cat !== categoryId);
    
    dispatch(updatePreferences({
      ...preferences,
      categories: newCategories,
    }));
  };

  const handleTabClick = (tab: 'all' | 'news' | 'movies' | 'social') => {
    dispatch(setActiveTab(tab));
  };

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-violet-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">PGAGI</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Content Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => handleTabClick('all')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </button>
        
        <button
          onClick={() => handleTabClick('all')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <User className="h-5 w-5" />
          <span>Personalized Feed</span>
        </button>
        
        <button
          onClick={() => dispatch(setActiveTab('trending'))}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'trending'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <TrendingUp className="h-5 w-5" />
          <span>Trending</span>
        </button>
        
        <button
          onClick={() => dispatch(setActiveTab('favorites'))}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Heart className="h-5 w-5" />
          <span>Favorites</span>
        </button>
        
        <button
          onClick={() => handleTabClick('all')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </nav>

      {/* User Preferences */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Content Preferences</h3>
          {CONTENT_CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Switch
                id={category.id}
                checked={preferences.categories.includes(category.id)}
                onCheckedChange={(checked) => handlePreferenceChange(category.id, checked)}
              />
              <Label 
                htmlFor={category.id}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
