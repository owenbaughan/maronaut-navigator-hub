
import { db, ensureCollectionExists, collection } from "../lib/firebase";
import { 
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { getUserProfile } from "./profileService";
import { FollowingData, FollowRequest } from "./types";

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

export const followUser = async (userId: string, targetUserId: string) => {
  try {
    console.log(`Adding follow relationship: ${userId} -> ${targetUserId}`);
    
    const alreadyFollowing = await checkFollowingStatus(userId, targetUserId);
    if (alreadyFollowing) {
      console.log("User already follows this target, skipping follow creation");
      return true;
    }
    
    const [userProfile, targetProfile] = await Promise.all([
      getUserProfile(userId),
      getUserProfile(targetUserId)
    ]);
    
    if (!userProfile || !targetProfile) {
      console.error("Could not find user profiles for either", userId, "or", targetUserId);
      throw new Error("Could not find user profiles");
    }
    
    console.log("Found profiles:", userProfile.username, "and", targetProfile.username);
    
    // Important: Check BOTH settings for backward compatibility
    // If either is missing or false, default to true for auto-accept
    const autoAcceptFollows = targetProfile.privacySettings?.autoAcceptFollows;
    const autoAcceptFriends = targetProfile.privacySettings?.autoAcceptFriends;
    
    // If either setting is explicitly set to false, don't auto-accept
    // Otherwise default to auto-accepting (both undefined or null = auto-accept)
    const autoAccept = !(autoAcceptFollows === false || autoAcceptFriends === false);
    
    console.log("Auto accept setting:", autoAccept, "from:", targetProfile.privacySettings);
    console.log("autoAcceptFollows:", autoAcceptFollows, "autoAcceptFriends:", autoAcceptFriends);
    
    if (autoAccept) {
      await ensureCollectionExists('following');
      console.log("Ensured following collection exists");
      
      const followingCollection = collection(db, "following");
      console.log("Using following collection path:", followingCollection.path);
      
      const timestamp = serverTimestamp() as Timestamp;
      
      const followData = {
        userId,
        followingId: targetUserId,
        username: targetProfile.username,
        firstName: targetProfile.firstName || null,
        lastName: targetProfile.lastName || null,
        photoURL: targetProfile.profilePicture || null,
        timestamp
      };
      
      console.log("Creating follow entry:", JSON.stringify(followData));
      const followRef = await addDoc(followingCollection, followData);
      console.log("Created follow entry with document ID:", followRef.id);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const verifyFollowing = await checkFollowingStatus(userId, targetUserId);
      console.log("Verified following was created:", verifyFollowing);
      
      return verifyFollowing;
    } else {
      // Create just a follow request, no more friendRequests collection
      await ensureCollectionExists('followRequests');
      console.log("Ensured followRequests collection exists");
      
      const followRequestsCollection = collection(db, "followRequests");
      
      const timestamp = serverTimestamp() as Timestamp;
      
      const requestData = {
        senderId: userId,
        receiverId: targetUserId,
        senderUsername: userProfile.username,
        senderFirstName: userProfile.firstName || null,
        senderLastName: userProfile.lastName || null,
        receiverUsername: targetProfile.username,
        status: 'pending',
        timestamp
      };
      
      console.log("Creating follow request:", JSON.stringify(requestData));
      const requestRef = await addDoc(followRequestsCollection, requestData);
      console.log("Created follow request with document ID:", requestRef.id);
      
      return true;
    }
  } catch (error) {
    console.error("Error adding follow relationship:", error);
    throw error;
  }
};

export const unfollowUser = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    console.log(`Removing follow relationship between ${userId} -> ${targetUserId}`);
    
    const followQuery = query(
      collection(db, "following"),
      where("userId", "==", userId),
      where("followingId", "==", targetUserId)
    );
    
    const snapshot = await getDocs(followQuery);
    
    const deletePromises: Promise<void>[] = [];
    
    snapshot.forEach((docSnapshot) => {
      console.log(`Deleting follow document: ${docSnapshot.id}`);
      deletePromises.push(deleteDoc(doc(db, "following", docSnapshot.id)));
    });
    
    if (deletePromises.length === 0) {
      console.log("No follow documents found to delete");
      return false;
    }
    
    await Promise.all(deletePromises);
    console.log(`Successfully removed follow relationship from ${userId} to ${targetUserId}`);
    
    const verifyRemoval = await checkFollowingStatus(userId, targetUserId);
    if (verifyRemoval) {
      console.warn("Follow relationship still exists after removal attempt!");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return false;
  }
};

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
