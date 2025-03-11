import { useState, useEffect, useCallback } from 'react';
import { 
  searchUsers, 
  followUser, 
  checkFollowingStatus, 
  getFollowRequests,
} from '@/services/friendService';
import { getUserProfile } from '@/services/profileService';
import { UserSearchResult } from '@/components/friends/types';

export const useUserSearch = (currentUserId: string | undefined, onUserAdded?: () => void) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  
  const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(...args: Parameters<F>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  const performSearch = useCallback(async (query: string) => {
    if (!currentUserId) return;
    if (query.trim() === '') {
      setSearchResults([]);
      setNoResults(false);
      return;
    }
    
    setIsSearching(true);
    setNoResults(false);
    
    try {
      console.log(`Searching for username: "${query}" from user ID: ${currentUserId}`);
      
      const users = await searchUsers(query, currentUserId);
      console.log("Search results returned:", users.length, "users");
      
      if (users.length === 0) {
        setNoResults(true);
        setSearchResults([]);
        return;
      }
      
      const { outgoingRequests } = await getFollowRequests(currentUserId);
      console.log("Current outgoing requests:", outgoingRequests);
      
      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          console.log("Checking following status for user:", user.username);
          const isFollowing = await checkFollowingStatus(currentUserId, user.id);
          
          let status = null;
          if (isFollowing) {
            status = 'following';
          } else {
            const hasPendingRequest = outgoingRequests.some(
              request => request.receiverId === user.id && request.status === 'pending'
            );
            
            if (hasPendingRequest) {
              status = 'requested';
              console.log(`User ${user.username} has a pending follow request`);
            }
          }
          
          return {
            ...user,
            status
          };
        })
      );
      
      setSearchResults(usersWithStatus);
      setNoResults(usersWithStatus.length === 0);
      
      if (usersWithStatus.length === 0) {
        console.log("No users with status found");
      } else {
        console.log("✅ Found users:", usersWithStatus.length);
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      setNoResults(true);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [currentUserId]);
  
  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300),
    [performSearch]
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
    await performSearch(searchQuery);
  };

  const handleFollowUser = async (user: UserSearchResult) => {
    if (!currentUserId) return;
    
    if (user.status === 'requested') {
      return;
    }
    
    try {
      setIsFollowingUser(true);
      setProcessingUserId(user.id);
      
      console.log(`Starting follow process for user ${user.username} (${user.id})`);
      
      const alreadyFollowing = await checkFollowingStatus(currentUserId, user.id);
      if (alreadyFollowing) {
        console.log("Already following this user, updating UI only");
        
        setSearchResults(prev => 
          prev.map(result => 
            result.id === user.id 
              ? { ...result, status: 'following' } 
              : result
          )
        );
        
        if (onUserAdded) {
          onUserAdded();
        }
        
        return;
      }
      
      const targetProfile = await getUserProfile(user.id);
      
      const autoAcceptFollows = targetProfile?.privacySettings?.autoAcceptFollows;
      const autoAcceptFriends = targetProfile?.privacySettings?.autoAcceptFriends;
      
      const autoAccept = !(autoAcceptFollows === false || autoAcceptFriends === false);
      
      console.log("Auto accept setting:", autoAccept, "from:", targetProfile?.privacySettings);
      console.log("autoAcceptFollows:", autoAcceptFollows, "autoAcceptFriends:", autoAcceptFriends);
      
      console.log(`Following user: ${currentUserId} -> ${user.id}`);
      const success = await followUser(currentUserId, user.id);
      console.log("Follow result:", success);
      
      if (success) {
        if (autoAccept) {
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'following' } 
                : result
            )
          );
        } else {
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'requested' } 
                : result
            )
          );
        }
        
        if (onUserAdded) {
          console.log("Calling onUserAdded callback to refresh following list");
          onUserAdded();
        }
      }
    } catch (error) {
      console.error("Error following user:", error);
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
    handleFollowUser
  };
};
