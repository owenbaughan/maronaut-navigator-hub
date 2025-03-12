
import { useState, useEffect } from 'react';
import { 
  FollowingData, 
  FollowRequest, 
  getFollowing, 
  getFollowers,
  getFollowRequests,
  unfollowUser
} from '@/services/friendService';
import { toast } from "sonner";

export const useFriendsData = (userId: string | null) => {
  const [following, setFollowing] = useState<FollowingData[]>([]);
  const [followers, setFollowers] = useState<FollowingData[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FollowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unfollowingUserId, setUnfollowingUserId] = useState<string | null>(null);

  const fetchFollowData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching follow data for user:", userId);
      
      const requests = await getFollowRequests(userId);
      console.log("Fetched follow requests:", requests);
      setIncomingRequests(requests.incomingRequests);
      
      const followingList = await getFollowing(userId);
      console.log("Fetched following:", followingList.length);
      setFollowing(followingList);
      
      const followersList = await getFollowers(userId);
      console.log("Fetched followers:", followersList.length);
      setFollowers(followersList);
      
    } catch (error) {
      console.error("Error fetching follow data:", error);
      toast.error("Error loading social data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollowUser = async (targetUserId: string) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const success = await unfollowUser(userId, targetUserId);
      
      if (success) {
        setFollowing(prev => prev.filter(user => user.followingId !== targetUserId));
        toast.success("Successfully unfollowed user");
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Failed to unfollow user");
    } finally {
      setIsLoading(false);
      setUnfollowingUserId(null);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFollowData();
    }
  }, [userId]);

  return {
    following,
    followers,
    incomingRequests,
    isLoading,
    unfollowingUserId,
    fetchFollowData,
    handleUnfollowUser
  };
};
