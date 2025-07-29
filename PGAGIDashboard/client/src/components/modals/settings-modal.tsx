import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updatePreferences } from '@/store/slices/userSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CONTENT_CATEGORIES } from '@/utils/constants';
import { UserPreferences } from '@/types/content';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { preferences } = useSelector((state: RootState) => state.user);
  
  const [localPreferences, setLocalPreferences] = React.useState<UserPreferences>(preferences);

  React.useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...localPreferences.categories, categoryId]
      : localPreferences.categories.filter(cat => cat !== categoryId);
    
    setLocalPreferences({
      ...localPreferences,
      categories: newCategories,
    });
  };

  const handleNotificationChange = (key: keyof UserPreferences['notifications'], checked: boolean) => {
    setLocalPreferences({
      ...localPreferences,
      notifications: {
        ...localPreferences.notifications,
        [key]: checked,
      },
    });
  };

  const handleSave = () => {
    dispatch(updatePreferences(localPreferences));
    onClose();
  };

  const handleCancel = () => {
    setLocalPreferences(preferences);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Content Preferences
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content Categories
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {CONTENT_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Switch
                    id={`category-${category.id}`}
                    checked={localPreferences.categories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="font-medium text-gray-900 dark:text-white cursor-pointer"
                    >
                      {category.label}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Latest {category.label.toLowerCase()} news and updates
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="font-medium text-gray-900 dark:text-white">
                    Breaking news alerts
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified about important breaking news
                  </p>
                </div>
                <Switch
                  checked={localPreferences.notifications.breaking}
                  onCheckedChange={(checked) => handleNotificationChange('breaking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="font-medium text-gray-900 dark:text-white">
                    Weekly digest
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive a weekly summary of your content
                  </p>
                </div>
                <Switch
                  checked={localPreferences.notifications.digest}
                  onCheckedChange={(checked) => handleNotificationChange('digest', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
