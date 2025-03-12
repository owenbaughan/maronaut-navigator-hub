
import { followUser, checkFollowingStatus } from '@/services/friendService';
import { getUserProfile } from '@/services/profileService';
import { UserSearchResult } from '@/components/friends/types';

/**
 * Follow a user with appropriate status handling based on privacy settings
 */
export const handleFollowUser = async (
  currentUserId: string,
  user: UserSearchResult,
  onUserAdded?: () => void
): Promise<UserSearchResult | null> => {
  if (!currentUserId || user.status === 'requested') {
    return null;
  }
  
  try {
    console.log(`Starting follow process for user ${user.username} (${user.id})`);
    
    const alreadyFollowing = await checkFollowingStatus(currentUserId, user.id);
    if (alreadyFollowing) {
      console.log("Already following this user, updating UI only");
      return { ...user, status: 'following' };
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
      if (onUserAdded) {
        console.log("Calling onUserAdded callback to refresh following list");
        onUserAdded();
      }
      
      return {
        ...user,
        status: autoAccept ? 'following' : 'requested'
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error following user:", error);
    return null;
  }
};
