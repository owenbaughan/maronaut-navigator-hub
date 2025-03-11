
import React from 'react';
import { UserPlus, UserCheck, Clock, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSearchResult } from './types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SearchResultItemProps {
  user: UserSearchResult;
  isFollowingUser: boolean;
  processingUserId: string | null;
  onFollowUser: (user: UserSearchResult) => void;
  onViewProfile: (userId: string) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  user,
  isFollowingUser,
  processingUserId,
  onFollowUser,
  onViewProfile
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

  // Check if profile is public
  const isPublicProfile = user.privacySettings?.isPublicProfile !== false;
  
  // Format name display
  const displayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return null;
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <div 
      key={user.id} 
      className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-maronaut-300 text-white">
          <AvatarImage src={user.profilePicture || undefined} alt={user.username} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.username}</p>
          {displayName() && (
            <p className="text-sm text-maronaut-600">{displayName()}</p>
          )}
          {!isPublicProfile && (
            <div className="flex items-center text-sm text-amber-600">
              <AlertCircle size={12} className="mr-1" />
              <span>Private profile</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* View Profile button for public profiles */}
        {isPublicProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(user.id)}
          >
            <User size={16} className="mr-1" />
            View Profile
          </Button>
        )}
        
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
    </div>
  );
};

export default SearchResultItem;
