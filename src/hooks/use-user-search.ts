import { useState } from 'react';
import { 
  searchUsers, 
  followUser, 
  checkFollowingStatus, 
  getFollowRequests,
} from '@/services/friendService';
import { useToast } from '@/components/ui/use-toast';
import { getUserProfile } from '@/services/profileService';
import { UserSearchResult } from '@/components/friends/types';

export const useUserSearch = (currentUserId: string | undefined, onUserAdded?: () => void) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId) {
      toast({
        title: "Not signed in",
        description: "You need to be signed in to search for users",
        variant: "destructive"
      });
      return;
    }
    
    if (searchQuery.trim() === '') return;
    
    setIsSearching(true);
    setShowResults(true);
    setNoResults(false);
    
    try {
      console.log(`Searching for username: "${searchQuery}" from user ID: ${currentUserId}`);
      
      const users = await searchUsers(searchQuery, currentUserId);
      console.log("Search results returned:", users.length, "users");
      
      if (users.length === 0) {
        setNoResults(true);
        setSearchResults([]);
        toast({
          title: "No users found",
          description: `No sailors matching '${searchQuery}' were found.`,
          variant: "default"
        });
        return;
      }
      
      // Get all pending follow requests to check against search results
      const { outgoingRequests } = await getFollowRequests(currentUserId);
      console.log("Current outgoing requests:", outgoingRequests);
      
      // Check following status for each user
      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          console.log("Checking following status for user:", user.username);
          const isFollowing = await checkFollowingStatus(currentUserId, user.id);
          
          let status = null;
          if (isFollowing) {
            status = 'following';
          } else {
            // Check if there's a pending request
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
        toast({
          title: "No users found",
          description: `No sailors matching '${searchQuery}' were found.`,
          variant: "default"
        });
      } else {
        console.log("✅ Found users:", usersWithStatus.length);
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      toast({
        title: "Search failed",
        description: "There was a problem searching for users",
        variant: "destructive"
      });
      setNoResults(true);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollowUser = async (user: UserSearchResult) => {
    if (!currentUserId) return;
    
    // Prevent follow action if this user already has a pending request
    if (user.status === 'requested') {
      toast({
        title: "Request pending",
        description: `You already have a pending follow request for ${user.username}`,
      });
      return;
    }
    
    try {
      setIsFollowingUser(true);
      setProcessingUserId(user.id);
      
      console.log(`Starting follow process for user ${user.username} (${user.id})`);
      
      // Double-check if already following first
      const alreadyFollowing = await checkFollowingStatus(currentUserId, user.id);
      if (alreadyFollowing) {
        console.log("Already following this user, updating UI only");
        toast({
          title: "Already following",
          description: `You are already following ${user.username}`,
        });
        
        // Update the user's status in search results to 'following'
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
      
      // Get target user's auto-accept setting
      const targetProfile = await getUserProfile(user.id);
      
      // Important: Check BOTH settings for backward compatibility
      // If either is missing or false, default to true for auto-accept
      const autoAcceptFollows = targetProfile?.privacySettings?.autoAcceptFollows;
      const autoAcceptFriends = targetProfile?.privacySettings?.autoAcceptFriends;
      
      // If either setting is explicitly set to false, don't auto-accept
      // Otherwise default to auto-accepting (both undefined or null = auto-accept)
      const autoAccept = !(autoAcceptFollows === false || autoAcceptFriends === false);
      
      console.log("Auto accept setting:", autoAccept, "from:", targetProfile?.privacySettings);
      console.log("autoAcceptFollows:", autoAcceptFollows, "autoAcceptFriends:", autoAcceptFriends);
      
      // Follow user
      console.log(`Following user: ${currentUserId} -> ${user.id}`);
      const success = await followUser(currentUserId, user.id);
      console.log("Follow result:", success);
      
      if (success) {
        if (autoAccept) {
          toast({
            title: "Now following",
            description: `You are now following ${user.username}`,
          });
          
          // Update the user's status in search results to 'following'
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'following' } 
                : result
            )
          );
        } else {
          toast({
            title: "Follow request sent",
            description: `A follow request has been sent to ${user.username}`,
          });
          
          // Update the user's status in search results to 'requested'
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'requested' } 
                : result
            )
          );
        }
        
        // Call the callback if provided to refresh the following list
        if (onUserAdded) {
          console.log("Calling onUserAdded callback to refresh following list");
          onUserAdded();
        }
      } else {
        toast({
          title: "Failed to follow",
          description: "There was a problem following this user",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        title: "Failed to follow",
        description: "There was a problem following this user",
        variant: "destructive"
      });
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
    showResults,
    setShowResults,
    noResults,
    isFollowingUser,
    processingUserId,
    handleSearch,
    handleFollowUser
  };
};
