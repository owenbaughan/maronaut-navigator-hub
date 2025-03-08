
import { db, friendsCollection, userProfilesCollection, friendRequestsCollection, ensureCollectionExists, collection } from "../lib/firebase";
import { 
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  DocumentReference,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  CollectionReference
} from "firebase/firestore";
import { getUserProfile } from "./profileService";

export interface FollowingData {
  id: string;
  userId: string;
  followingId: string;
  timestamp: Timestamp;
  username?: string;
  photoURL?: string | null;
}

interface UserProfileData {
  userId: string;
  username: string;
  profilePicture?: string | null;
  privacySettings?: {
    isPublicProfile: boolean;
    autoAcceptFollows?: boolean;
    autoAcceptFriends?: boolean;
    showEmail?: boolean;
    showLocation?: boolean;
    showBoatDetails?: boolean;
  };
}

export interface FollowRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Timestamp;
  senderUsername?: string;
  receiverUsername?: string;
}

export interface FriendData {
  id: string;
  userId: string;
  friendId: string;
  timestamp: Timestamp;
  username?: string;
  photoURL?: string | null;
}

export const searchUsers = async (searchQuery: string, currentUserId: string) => {
  if (!searchQuery.trim()) return [];
  
  try {
    console.log("Searching users with query:", searchQuery, "Current user:", currentUserId);
    const usersRef = collection(db, "userProfiles");
    
    console.log("Searching in collection:", usersRef.path);
    
    const lowercaseQuery = searchQuery.toLowerCase();
    
    const querySnapshot = await getDocs(usersRef);
    console.log("Total profiles found in database:", querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.error("NO PROFILES FOUND IN DATABASE! Check your Firestore collection structure.");
      return [];
    }
    
    const users: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfileData;
      console.log("Examining user:", userData.username, "ID:", userData.userId);
      
      if (userData.userId === currentUserId) {
        console.log("Skipping current user:", userData.username);
        return;
      }
      
      if (!userData.username) {
        console.log("Skipping user with no username:", doc.id);
        return;
      }
      
      const username = userData.username.toLowerCase();
      console.log(`Comparing '${username}' with search query '${lowercaseQuery}'`);
      
      if (username.includes(lowercaseQuery)) {
        console.log("Match found! Adding to results:", userData.username);
        users.push({
          id: userData.userId,
          username: userData.username,
          profilePicture: userData.profilePicture || null,
          privacySettings: userData.privacySettings || {
            isPublicProfile: true,
            autoAcceptFriends: false
          }
        });
      } else {
        console.log("No match for", userData.username, "with query", lowercaseQuery);
      }
    });
    
    console.log("Final search results:", users);
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

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
    
    // Use autoAcceptFollows, with fallback for backward compatibility
    const autoAccept = targetProfile.privacySettings?.autoAcceptFollows !== false;
    
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
      await ensureCollectionExists('followRequests');
      console.log("Ensured followRequests collection exists");
      
      const followRequestsCollection = collection(db, "followRequests");
      
      const timestamp = serverTimestamp() as Timestamp;
      
      const requestData = {
        senderId: userId,
        receiverId: targetUserId,
        senderUsername: userProfile.username,
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

export const getFollowRequests = async (userId: string) => {
  try {
    console.log("Getting follow requests for user:", userId);
    
    await ensureCollectionExists('followRequests');
    
    const incomingQuery = query(
      collection(db, "followRequests"),
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );
    
    const outgoingQuery = query(
      collection(db, "followRequests"),
      where("senderId", "==", userId),
      where("status", "==", "pending")
    );
    
    const [incomingSnapshot, outgoingSnapshot] = await Promise.all([
      getDocs(incomingQuery),
      getDocs(outgoingQuery)
    ]);
    
    const incomingRequests: FollowRequest[] = [];
    const outgoingRequests: FollowRequest[] = [];
    
    incomingSnapshot.forEach(doc => {
      const data = doc.data();
      incomingRequests.push({
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        status: data.status,
        timestamp: data.timestamp,
        senderUsername: data.senderUsername,
        receiverUsername: data.receiverUsername
      });
    });
    
    outgoingSnapshot.forEach(doc => {
      const data = doc.data();
      outgoingRequests.push({
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        status: data.status,
        timestamp: data.timestamp,
        senderUsername: data.senderUsername,
        receiverUsername: data.receiverUsername
      });
    });
    
    return { incomingRequests, outgoingRequests };
  } catch (error) {
    console.error("Error getting follow requests:", error);
    return { incomingRequests: [], outgoingRequests: [] };
  }
};

export const acceptFollowRequest = async (requestId: string) => {
  try {
    console.log("Accepting follow request:", requestId);
    
    const requestRef = doc(db, "followRequests", requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      console.error("Follow request not found");
      return false;
    }
    
    const requestData = requestDoc.data();
    const { senderId, receiverId } = requestData;
    
    await ensureCollectionExists('following');
    
    const followingCollection = collection(db, "following");
    const timestamp = serverTimestamp() as Timestamp;
    
    const senderProfile = await getUserProfile(senderId);
    
    const followData = {
      userId: senderId,
      followingId: receiverId,
      username: requestData.senderUsername || (senderProfile?.username || "Unknown"),
      photoURL: senderProfile?.profilePicture || null,
      timestamp
    };
    
    await addDoc(followingCollection, followData);
    
    await updateDoc(requestRef, { status: 'accepted' });
    
    return true;
  } catch (error) {
    console.error("Error accepting follow request:", error);
    return false;
  }
};

export const rejectFollowRequest = async (requestId: string) => {
  try {
    console.log("Rejecting follow request:", requestId);
    
    const requestRef = doc(db, "followRequests", requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      console.error("Follow request not found");
      return false;
    }
    
    await updateDoc(requestRef, { status: 'declined' });
    
    return true;
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    return false;
  }
};

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
  })) as FriendData[];
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
