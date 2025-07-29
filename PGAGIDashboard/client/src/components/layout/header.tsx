import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSearchQuery } from '@/store/slices/contentSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDebounce } from '@/hooks/use-debounce';
import { Moon, Sun, Bell, Settings } from 'lucide-react';
import { DEBOUNCE_DELAY } from '@/utils/constants';

interface HeaderProps {
  onSettingsOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsOpen }) => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.content);
  const { mode } = useSelector((state: RootState) => state.theme);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, DEBOUNCE_DELAY);

  React.useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    
    // Apply theme to document
    const root = document.documentElement;
    if (mode === 'light') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const getUserInitials = () => {
    if (currentUser) {
      return currentUser.username.substring(0, 2).toUpperCase();
    }
    return 'SP';
  };

  const getUserDisplayName = () => {
    return currentUser?.username || 'Sanika Padaval';
  };

  const getUserEmail = () => {
    return currentUser?.email || 'sanika6701@gmail.com';
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <SearchInput
            value={localSearchQuery}
            onChange={setLocalSearchQuery}
            placeholder="Search across news, movies, and social posts..."
            className="w-full"
          />
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {mode === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsOpen}
            className="rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-primary to-violet-500 text-white font-semibold text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getUserEmail()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
