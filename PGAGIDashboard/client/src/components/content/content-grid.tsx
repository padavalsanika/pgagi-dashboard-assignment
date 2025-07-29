import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { RootState } from '@/store';
import { updateContentOrder, fetchAllContent, searchContent } from '@/store/slices/contentSlice';
import { ContentCard } from './content-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const ContentGrid: React.FC = () => {
  const dispatch = useDispatch();
  const {
    items,
    searchResults,
    loading,
    searchLoading,
    searchQuery,
    activeTab,
    hasMore,
    currentPage,
    contentOrder,
  } = useSelector((state: RootState) => state.content);

  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchAllContent());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(searchContent({ query: searchQuery }));
    }
  }, [searchQuery, dispatch]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      // Dispatch fetch more content action
      dispatch(fetchAllContent());
    }
  };

  const { isFetching } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: handleLoadMore,
    threshold: 0.8,
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedItems = Array.from(localItems);
    const [reorderedItem] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, reorderedItem);

    setLocalItems(reorderedItems);

    // Update the order in Redux store
    const newOrder = reorderedItems.map(item => item.id);
    dispatch(updateContentOrder(newOrder));
  };

  const getFilteredItems = () => {
    const itemsToFilter = searchQuery.trim() ? searchResults : localItems;
    
    switch (activeTab) {
      case 'news':
        return itemsToFilter.filter(item => item.type === 'news');
      case 'movies':
        return itemsToFilter.filter(item => item.type === 'movie');
      case 'social':
        return itemsToFilter.filter(item => item.type === 'social');
      case 'trending':
        return itemsToFilter.filter(item => item.isTrending);
      case 'favorites':
        return itemsToFilter.filter(item => item.isFavorite);
      case 'all':
      default:
        return itemsToFilter;
    }
  };

  const filteredItems = getFilteredItems();

  const handleRefresh = () => {
    dispatch(fetchAllContent());
  };

  if (loading && filteredItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your personalized content...</p>
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No search results found' : 'No content available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms or browse all content'
              : 'Try refreshing to load new content'
            }
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Content
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-grid">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => (
                <Draggable 
                  key={item.id} 
                  draggableId={item.id || `item-${index}`} 
                  index={index}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ContentCard
                        item={item}
                        index={index}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Load More / Loading indicator */}
      {(loading || isFetching) && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && !isFetching && hasMore && (
        <div className="flex justify-center py-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-6 py-3"
          >
            Load More Content
          </Button>
        </div>
      )}
    </div>
  );
};
