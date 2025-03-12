
import { db, collection } from "../../lib/firebase";
import { 
  query,
  where,
  getDocs,
} from "firebase/firestore";

/**
 * Checks if a user is following another user
 */
export const checkFollowingStatus = async (userId: string, targetUserId: string) => {
  try {
    console.log(`Checking if user ${userId} is following ${targetUserId}`);
    
    const followingQuery = query(
      collection(db, "following"),
      where("userId", "==", userId),
      where("followingId", "==", targetUserId)
    );
    
    const snapshot = await getDocs(followingQuery);
    const isFollowing = !snapshot.empty;
    
    console.log(`User ${userId} is following ${targetUserId}: ${isFollowing}`);
    
    return isFollowing;
  } catch (error) {
    console.error("Error checking following status:", error);
    return false;
  }
};
