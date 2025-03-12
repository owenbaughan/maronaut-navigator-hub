
import { db, ensureCollectionExists, collection } from "../../lib/firebase";
import { 
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FollowingData } from "../types";

/**
 * Gets the list of users that the specified user is following
 */
export const getFollowing = async (userId: string) => {
  try {
    console.log("Getting following for user:", userId);
    
    await ensureCollectionExists('following');
    
    const followingCol = collection(db, "following");
    console.log("Using following collection path:", followingCol.path);
    
    const followingQuery = query(
      followingCol,
      where("userId", "==", userId)
    );
    
    console.log(`Querying following collection with userId: ${userId}`);
    
    const snapshot = await getDocs(followingQuery);
    console.log(`Found ${snapshot.size} following records for user ${userId}`);
    
    const following: FollowingData[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as FollowingData;
      following.push({ 
        id: doc.id, 
        userId: data.userId,
        followingId: data.followingId,
        username: data.username || "Unknown",
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        photoURL: data.photoURL,
        timestamp: data.timestamp
      });
    });
    
    console.log("Processed following list:", JSON.stringify(following));
    return following;
  } catch (error) {
    console.error("Error getting following:", error);
    console.error("Error details:", JSON.stringify(error));
    return [];
  }
};

/**
 * Gets the list of users who are following the specified user
 */
export const getFollowers = async (userId: string) => {
  try {
    console.log("Getting followers for user:", userId);
    
    await ensureCollectionExists('following');
    
    const followingCol = collection(db, "following");
    console.log("Using following collection path:", followingCol.path);
    
    const followersQuery = query(
      followingCol,
      where("followingId", "==", userId)
    );
    
    console.log(`Querying following collection for followers of: ${userId}`);
    
    const snapshot = await getDocs(followersQuery);
    console.log(`Found ${snapshot.size} follower records for user ${userId}`);
    
    const followers: FollowingData[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as FollowingData;
      followers.push({ 
        id: doc.id, 
        userId: data.userId,
        followingId: data.followingId,
        username: data.username || "Unknown",
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        photoURL: data.photoURL,
        timestamp: data.timestamp
      });
    });
    
    console.log("Processed followers list:", JSON.stringify(followers));
    return followers;
  } catch (error) {
    console.error("Error getting followers:", error);
    console.error("Error details:", JSON.stringify(error));
    return [];
  }
};
