
import React from 'react';
import { Button } from '@/components/ui/button';
import { FollowingData } from '@/services/types';

interface FollowersListProps {
  followers: FollowingData[];
  isLoading: boolean;
  onViewProfile: (userId: string) => void;
}

const FollowersList: React.FC<FollowersListProps> = ({
  followers,
  isLoading,
  onViewProfile
}) => {
  const formatDisplayName = (user: FollowingData) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maronaut-700 mx-auto"></div>
        <p className="mt-4 text-maronaut-600">Loading followers...</p>
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="text-center p-6 text-maronaut-500">
        You don't have any followers yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map(user => (
        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
              {user.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium">{user.username}</p>
              {formatDisplayName(user) && (
                <p className="text-sm text-maronaut-600">{formatDisplayName(user)}</p>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewProfile(user.userId)}
          >
            View Profile
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FollowersList;
