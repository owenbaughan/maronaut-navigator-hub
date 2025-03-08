
import React from 'react';
import { UserSearchResult } from './types';
import SearchResultItem from './SearchResultItem';

interface SearchResultsListProps {
  searchResults: UserSearchResult[];
  isFollowingUser: boolean;
  processingUserId: string | null;
  onFollowUser: (user: UserSearchResult) => void;
  searchQuery: string;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  searchResults,
  isFollowingUser,
  processingUserId,
  onFollowUser,
  searchQuery
}) => {
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
        />
      ))}
    </div>
  );
};

export default SearchResultsList;
