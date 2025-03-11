
import React, { useState } from 'react';
import { UserSearchResult } from './types';
import SearchResultItem from './SearchResultItem';
import FriendProfile from './FriendProfile';

interface SearchResultsListProps {
  searchResults: UserSearchResult[];
  isFollowingUser: boolean;
  processingUserId: string | null;
  onFollowUser: (user: UserSearchResult) => void;
  onViewProfile: (userId: string) => void;
  searchQuery: string;
  showFullProfile: boolean;
  selectedUserId: string | null;
  onBackToResults: () => void;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  searchResults,
  isFollowingUser,
  processingUserId,
  onFollowUser,
  onViewProfile,
  searchQuery,
  showFullProfile,
  selectedUserId,
  onBackToResults
}) => {
  // If we're showing a full profile, render that instead of the results list
  if (showFullProfile && selectedUserId) {
    return (
      <FriendProfile 
        friendId={selectedUserId} 
        onBackToResults={onBackToResults}
      />
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-maronaut-500">No users found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
      {searchResults.map(user => (
        <SearchResultItem
          key={user.id}
          user={user}
          isFollowingUser={isFollowingUser}
          processingUserId={processingUserId}
          onFollowUser={onFollowUser}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

export default SearchResultsList;
