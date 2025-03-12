
import { searchUsers, getFollowRequests, checkFollowingStatus } from '@/services/friendService';
import { getUserProfile } from '@/services/profileService';
import { UserSearchResult } from '@/components/friends/types';

/**
 * Performs a search for users based on the provided query and current user ID
 */
export const performUserSearch = async (
  query: string, 
  currentUserId: string
): Promise<UserSearchResult[]> => {
  if (!currentUserId || query.trim() === '') {
    return [];
  }
  
  console.log(`Searching for username: "${query}" from user ID: ${currentUserId}`);
  
  const users = await searchUsers(query, currentUserId);
  console.log("Search results returned:", users.length, "users");
  
  if (users.length === 0) {
    return [];
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
      
      const profile = await getUserProfile(user.id);
      
      return {
        ...user,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        status
      };
    })
  );
  
  if (usersWithStatus.length === 0) {
    console.log("No users with status found");
  } else {
    console.log("✅ Found users:", usersWithStatus.length);
  }
  
  return usersWithStatus;
};
