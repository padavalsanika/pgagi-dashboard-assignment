import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store';
import { setActiveTab, fetchAllContent } from '@/store/slices/contentSlice';
import type { AppDispatch } from '@/store';
import { updateStats } from '@/store/slices/userSlice';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ContentGrid } from '@/components/content/content-grid';
import { SettingsModal } from '@/components/modals/settings-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, Film, Heart, Share2 } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTab, items } = useSelector((state: RootState) => state.content);
  const { stats, currentUser } = useSelector((state: RootState) => state.user);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load content on dashboard mount
    dispatch(fetchAllContent());
  }, [dispatch]);

  useEffect(() => {
    // Update stats based on content
    const newsItems = items.filter(item => item.type === 'news').length;
    const movieItems = items.filter(item => item.type === 'movie').length;
    const socialItems = items.filter(item => item.type === 'social').length;
    const favoriteItems = items.filter(item => item.isFavorite).length;

    dispatch(updateStats({
      totalArticles: newsItems,
      moviesWatched: movieItems,
      socialPosts: socialItems,
      favorites: favoriteItems,
    }));
  }, [items, dispatch]);

  const handleTabClick = (tab: 'all' | 'news' | 'movies' | 'social' | 'trending' | 'favorites') => {
    dispatch(setActiveTab(tab));
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const name = currentUser?.username || 'User';
    
    if (hour < 12) return `Good morning, ${name}! 👋`;
    if (hour < 18) return `Good afternoon, ${name}! 👋`;
    return `Good evening, ${name}! 👋`;
  };

  const statsCards = [
    {
      title: 'Total Articles Read',
      value: stats.totalArticles,
      icon: Newspaper,
      color: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    },
    {
      title: 'Movies Recommended',
      value: stats.moviesWatched,
      icon: Film,
      color: 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    },
    {
      title: 'Saved Favorites',
      value: stats.favorites,
      icon: Heart,
      color: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Social Interactions',
      value: stats.socialPosts,
      icon: Share2,
      color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header onSettingsOpen={() => setShowSettings(true)} />
        
        <div className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getWelcomeMessage()}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your personalized content feed for today
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Content Sections Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center space-x-4 mb-6"
          >
            <Button
              onClick={() => handleTabClick('all')}
              variant={activeTab === 'all' ? 'default' : 'outline'}
              className={activeTab === 'all' ? 'bg-primary text-white' : ''}
            >
              All Content
            </Button>
            <Button
              onClick={() => handleTabClick('news')}
              variant={activeTab === 'news' ? 'default' : 'outline'}
              className={activeTab === 'news' ? 'bg-primary text-white' : ''}
            >
              News
            </Button>
            <Button
              onClick={() => handleTabClick('movies')}
              variant={activeTab === 'movies' ? 'default' : 'outline'}
              className={activeTab === 'movies' ? 'bg-primary text-white' : ''}
            >
              Movies
            </Button>
            <Button
              onClick={() => handleTabClick('social')}
              variant={activeTab === 'social' ? 'default' : 'outline'}
              className={activeTab === 'social' ? 'bg-primary text-white' : ''}
            >
              Social
            </Button>
          </motion.div>

          {/* Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ContentGrid />
          </motion.div>
        </div>
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
