import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store';
import { addToFavorites, removeFromFavorites } from '@/store/slices/contentSlice';
import { ContentItem } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, ExternalLink, Play, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  item: ContentItem;
  index: number;
  isDragging?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  index,
  isDragging = false,
}) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleFavoriteToggle = () => {
    if (item.isFavorite) {
      dispatch(removeFromFavorites(item.id));
    } else {
      dispatch(addToFavorites(item.id));
    }
  };

  const handleShare = () => {
    if (navigator.share && item.sourceUrl) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: item.sourceUrl,
      });
    } else if (item.sourceUrl) {
      navigator.clipboard.writeText(item.sourceUrl);
    }
  };

  const handleAction = () => {
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank');
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors = {
      technology: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
      finance: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
      entertainment: 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
      sports: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      default: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400',
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'news':
        return <ExternalLink className="h-4 w-4" />;
      case 'movie':
        return <Play className="h-4 w-4" />;
      case 'social':
        return <Share2 className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getActionLabel = () => {
    switch (item.type) {
      case 'news':
        return 'Read More';
      case 'movie':
        return 'Play Now';
      case 'social':
        return 'View Post';
      default:
        return 'View';
    }
  };

  const formatPublishedDate = () => {
    const date = item.publishedAt || item.createdAt;
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const renderSocialContent = () => {
    if (item.type !== 'social') return null;

    const { author, text, likes, retweets } = item.content;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {author?.name?.substring(0, 2)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">{author?.name || 'Unknown User'}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {author?.handle} • {formatPublishedDate()}
            </p>
          </div>
        </div>
        <p className="text-gray-900 dark:text-white">{text}</p>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="h-4 w-4" />
            <span className="text-sm">{likes || 0}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors">
            <Share2 className="h-4 w-4" />
            <span className="text-sm">{retweets || 0}</span>
          </button>
        </div>
      </div>
    );
  };

  const renderMovieContent = () => {
    if (item.type !== 'movie') return null;

    const { rating } = item.content;
    
    return (
      <div className="space-y-3">
        {rating && (
          <div className="flex items-center text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm ml-1">{rating.toFixed(1)}</span>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {item.description}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-grab hover:cursor-grabbing">
        {item.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Badge className={`text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
              {item.category || item.type}
            </Badge>
            {formatPublishedDate() && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatPublishedDate()}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {item.title}
          </h3>

          {item.type === 'social' ? renderSocialContent() : renderMovieContent()}

          {item.type === 'news' && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              onClick={handleAction}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                item.type === 'movie'
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : item.type === 'social'
                  ? 'bg-violet-500 text-white hover:bg-violet-600'
                  : 'text-primary hover:underline'
              }`}
              variant={item.type === 'news' ? 'ghost' : 'default'}
            >
              <span className="flex items-center space-x-2">
                {getTypeIcon()}
                <span>{getActionLabel()}</span>
              </span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
