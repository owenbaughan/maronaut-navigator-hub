import { db, ensureCollectionExists, collection } from "../../lib/firebase";
import { 
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { getUserProfile } from "../profileService";
import { checkFollowingStatus } from "./status";

/**
 * Adds a follow relationship between two users
 */
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

/**
 * Removes a follow relationship between two users
 */
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
