
// Re-export everything from our service files
import { searchUsers } from './userSearchService';
import { 
  checkFollowingStatus, 
  followUser, 
  unfollowUser, 
  getFollowing,
  getFollowers
} from './follow';
import {
  getFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest
} from './requestService';

// Re-export the types
export * from './types';

// Import the getUserProfile function from our new structure
import { getUserProfile } from './profile';

// Re-export all functions
export {
  searchUsers,
  checkFollowingStatus,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest
};

// For backward compatibility, re-export these functions with legacy names
export const checkFriendRequestExists = async (userId: string, targetUserId: string) => {
  return { sentRequest: null, receivedRequest: null };
};

export const checkFriendshipExists = async (userId: string, targetUserId: string) => {
  return await checkFollowingStatus(userId, targetUserId);
};

export const sendFriendRequest = async (senderId: string, receiverId: string) => {
  return await followUser(senderId, receiverId);
};

export const addFriendDirectly = async (userId: string, friendId: string) => {
  return await followUser(userId, friendId);
};

export const removeFriend = async (userId: string, friendId: string): Promise<boolean> => {
  return await unfollowUser(userId, friendId);
};

export const getFriends = async (userId: string) => {
  const following = await getFollowing(userId);
  
  return following.map(follow => ({
    id: follow.id,
    userId: follow.userId,
    friendId: follow.followingId,
    username: follow.username,
    photoURL: follow.photoURL,
    timestamp: follow.timestamp
  }));
};

export const getFriendRequests = async (userId: string) => {
  return await getFollowRequests(userId);
};

export const acceptFriendRequest = async (requestId: string) => {
  return await acceptFollowRequest(requestId);
};

export const removeFriendRequest = async (requestId: string) => {
  return await rejectFollowRequest(requestId);
};
