
import { useState, useEffect, useCallback } from 'react';
import { UserSearchResult } from '@/components/friends/types';
import { debounce } from '@/utils/debounce';
import { performUserSearch } from '@/services/userSearchService/searchUtils';
import { handleFollowUser } from '@/services/userSearchService/followUtils';

export const useUserSearch = (currentUserId: string | undefined, onUserAdded?: () => void) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  
  const searchUsers = useCallback(async (query: string) => {
    if (!currentUserId) return;
    if (query.trim() === '') {
      setSearchResults([]);
      setNoResults(false);
      return;
    }
    
    setIsSearching(true);
    setNoResults(false);
    
    try {
      const results = await performUserSearch(query, currentUserId);
      
      setSearchResults(results);
      setNoResults(results.length === 0);
    } catch (error) {
      console.error("❌ Search error:", error);
      setNoResults(true);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [currentUserId]);
  
  const debouncedSearch = useCallback(
    debounce((query: string) => searchUsers(query), 300),
    [searchUsers]
  );
  
  const handleSearchInput = useCallback((query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      setNoResults(false);
    } else {
      debouncedSearch(query);
    }
  }, [debouncedSearch]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchUsers(searchQuery);
  };

  const handleFollowUserAction = async (user: UserSearchResult) => {
    if (!currentUserId) return;
    
    try {
      setIsFollowingUser(true);
      setProcessingUserId(user.id);
      
      const updatedUser = await handleFollowUser(currentUserId, user, onUserAdded);
      
      if (updatedUser) {
        setSearchResults(prev => 
          prev.map(result => 
            result.id === user.id ? updatedUser : result
          )
        );
      }
    } finally {
      setIsFollowingUser(false);
      setProcessingUserId(null);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    noResults,
    isFollowingUser,
    processingUserId,
    handleSearch,
    handleSearchInput,
    handleFollowUser: handleFollowUserAction
  };
};
