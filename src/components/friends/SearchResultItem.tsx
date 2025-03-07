
import React from 'react';
import { UserPlus, UserCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSearchResult } from './types';

interface SearchResultItemProps {
  user: UserSearchResult;
  isFollowingUser: boolean;
  processingUserId: string | null;
  onFollowUser: (user: UserSearchResult) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  user,
  isFollowingUser,
  processingUserId,
  onFollowUser
}) => {
  // Helper function to determine button text based on user's privacy settings and status
  const getFollowButtonText = (user: UserSearchResult) => {
    if (isFollowingUser && processingUserId === user.id) {
      return "Processing...";
    }
    
    if (user.status === 'requested') {
      return "Requested";
    }
    
    // If either setting is explicitly set to false, request to follow
    const requiresRequest = user.privacySettings?.autoAcceptFollows === false || 
                           user.privacySettings?.autoAcceptFriends === false;
                           
    return requiresRequest ? "Request Follow" : "Follow";
  };

  return (
    <div 
      key={user.id} 
      className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{user.username}</p>
        </div>
      </div>
      
      {/* Following status buttons */}
      {user.status === 'following' ? (
        <div className="flex items-center text-green-600">
          <UserCheck size={18} className="mr-1" />
          <span className="text-sm">Following</span>
        </div>
      ) : user.status === 'requested' ? (
        <div className="flex items-center text-amber-600">
          <Clock size={18} className="mr-1" />
          <span className="text-sm">Requested</span>
        </div>
      ) : (
        <Button 
          size="sm"
          className="bg-maronaut-500 hover:bg-maronaut-600"
          onClick={() => onFollowUser(user)}
          disabled={isFollowingUser && processingUserId === user.id}
        >
          <UserPlus size={16} className="mr-1" />
          {getFollowButtonText(user)}
        </Button>
      )}
    </div>
  );
};

export default SearchResultItem;
