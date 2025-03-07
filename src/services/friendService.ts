
import { db } from "../lib/firebase";
import { 
  collection,
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
  limit
} from "firebase/firestore";
import { getUserProfile } from "./profileService";

export interface FriendRequest {
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

// Search for users by username
export const searchUsers = async (searchQuery: string, currentUserId: string) => {
  if (!searchQuery.trim()) return [];
  
  try {
    console.log("Searching users with query:", searchQuery);
    const usersRef = collection(db, "userProfiles");
    
    // Convert to lowercase for case-insensitive search
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Get all user profiles - we'll filter them in memory
    // This is more flexible for small datasets than doing a startsWith query
    const querySnapshot = await getDocs(usersRef);
    const users: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      // Don't include the current user in search results
      if (userData.userId !== currentUserId) {
        // Check if username contains the search query (case insensitive)
        const username = (userData.username || "").toLowerCase();
        if (username.includes(lowercaseQuery)) {
          users.push({
            id: userData.userId,
            username: userData.username,
            profilePicture: userData.profilePicture || null,
            privacySettings: userData.privacySettings || {
              isPublicProfile: true,
              autoAcceptFriends: false
            }
          });
        }
      }
    });
    
    console.log("Found users:", users);
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

// Check if a friend request already exists
export const checkFriendRequestExists = async (userId: string, targetUserId: string) => {
  try {
    // Check for requests in either direction
    const requestsRef = collection(db, "friendRequests");
    
    // Check if the current user sent a request to the target user
    const sentQuery = query(
      requestsRef,
      where("senderId", "==", userId),
      where("receiverId", "==", targetUserId)
    );
    
    // Check if the target user sent a request to the current user
    const receivedQuery = query(
      requestsRef,
      where("senderId", "==", targetUserId),
      where("receiverId", "==", userId)
    );
    
    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery)
    ]);
    
    const sentRequest = !sentSnapshot.empty ? 
      { id: sentSnapshot.docs[0].id, ...sentSnapshot.docs[0].data() as FriendRequest } : 
      null;
      
    const receivedRequest = !receivedSnapshot.empty ? 
      { id: receivedSnapshot.docs[0].id, ...receivedSnapshot.docs[0].data() as FriendRequest } : 
      null;
    
    return { sentRequest, receivedRequest };
  } catch (error) {
    console.error("Error checking friend request:", error);
    return { sentRequest: null, receivedRequest: null };
  }
};

// Check if users are already friends
export const checkFriendshipExists = async (userId: string, targetUserId: string) => {
  try {
    const friendsRef = collection(db, "friends");
    
    // Check for friendship in either direction
    const query1 = query(
      friendsRef,
      where("userId", "==", userId),
      where("friendId", "==", targetUserId)
    );
    
    const query2 = query(
      friendsRef,
      where("userId", "==", targetUserId),
      where("friendId", "==", userId)
    );
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(query1),
      getDocs(query2)
    ]);
    
    return !snapshot1.empty || !snapshot2.empty;
  } catch (error) {
    console.error("Error checking friendship:", error);
    return false;
  }
};

// Send a friend request
export const sendFriendRequest = async (senderId: string, receiverId: string) => {
  try {
    console.log(`Sending friend request from ${senderId} to ${receiverId}`);
    
    // Get usernames for both users
    const [senderProfile, receiverProfile] = await Promise.all([
      getUserProfile(senderId),
      getUserProfile(receiverId)
    ]);
    
    if (!senderProfile || !receiverProfile) {
      throw new Error("Could not find user profiles");
    }
    
    const requestData: Omit<FriendRequest, 'id'> = {
      senderId,
      receiverId,
      status: 'pending',
      timestamp: serverTimestamp() as Timestamp,
      senderUsername: senderProfile.username,
      receiverUsername: receiverProfile.username
    };
    
    const requestRef = await addDoc(collection(db, "friendRequests"), requestData);
    console.log("Friend request sent with ID:", requestRef.id);
    
    return { id: requestRef.id, ...requestData };
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

// Add friend directly (for auto-accept case)
export const addFriendDirectly = async (userId: string, friendId: string) => {
  try {
    console.log(`Adding friend directly: ${userId} and ${friendId}`);
    
    // Get usernames for both users
    const [userProfile, friendProfile] = await Promise.all([
      getUserProfile(userId),
      getUserProfile(friendId)
    ]);
    
    if (!userProfile || !friendProfile) {
      throw new Error("Could not find user profiles");
    }
    
    // Create friend entries for both users
    const timestamp = serverTimestamp() as Timestamp;
    
    // Add entry for current user
    await addDoc(collection(db, "friends"), {
      userId,
      friendId,
      username: friendProfile.username,
      photoURL: friendProfile.profilePicture || null,
      timestamp
    });
    
    // Add entry for the friend
    await addDoc(collection(db, "friends"), {
      userId: friendId,
      friendId: userId,
      username: userProfile.username,
      photoURL: userProfile.profilePicture || null,
      timestamp
    });
    
    console.log("Friend added directly");
    return true;
  } catch (error) {
    console.error("Error adding friend directly:", error);
    throw error;
  }
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string) => {
  try {
    console.log("Accepting friend request:", requestId);
    
    // Get the friend request
    const requestRef = doc(db, "friendRequests", requestId);
    const requestSnap = await getDoc(requestRef);
    
    if (!requestSnap.exists()) {
      throw new Error("Friend request not found");
    }
    
    const requestData = requestSnap.data() as FriendRequest;
    
    // Update the request status
    await updateDoc(requestRef, { status: 'accepted' });
    
    // Add friend entries for both users
    await addFriendDirectly(requestData.senderId, requestData.receiverId);
    
    console.log("Friend request accepted");
    return true;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

// Decline or cancel a friend request
export const removeFriendRequest = async (requestId: string) => {
  try {
    console.log("Removing friend request:", requestId);
    
    // Delete the friend request
    const requestRef = doc(db, "friendRequests", requestId);
    await deleteDoc(requestRef);
    
    console.log("Friend request removed");
    return true;
  } catch (error) {
    console.error("Error removing friend request:", error);
    throw error;
  }
};

// Get all friend requests for a user
export const getFriendRequests = async (userId: string) => {
  try {
    console.log("Getting friend requests for user:", userId);
    const requestsRef = collection(db, "friendRequests");
    
    // Get incoming requests
    const incomingQuery = query(
      requestsRef,
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );
    
    // Get outgoing requests
    const outgoingQuery = query(
      requestsRef,
      where("senderId", "==", userId),
      where("status", "==", "pending")
    );
    
    const [incomingSnapshot, outgoingSnapshot] = await Promise.all([
      getDocs(incomingQuery),
      getDocs(outgoingQuery)
    ]);
    
    const incomingRequests: FriendRequest[] = [];
    const outgoingRequests: FriendRequest[] = [];
    
    incomingSnapshot.forEach(doc => {
      incomingRequests.push({ id: doc.id, ...doc.data() as FriendRequest });
    });
    
    outgoingSnapshot.forEach(doc => {
      outgoingRequests.push({ id: doc.id, ...doc.data() as FriendRequest });
    });
    
    console.log("Incoming requests:", incomingRequests);
    console.log("Outgoing requests:", outgoingRequests);
    
    return { incomingRequests, outgoingRequests };
  } catch (error) {
    console.error("Error getting friend requests:", error);
    return { incomingRequests: [], outgoingRequests: [] };
  }
};

// Get all friends for a user
export const getFriends = async (userId: string) => {
  try {
    console.log("Getting friends for user:", userId);
    const friendsRef = collection(db, "friends");
    const q = query(
      friendsRef,
      where("userId", "==", userId)
    );
    
    const snapshot = await getDocs(q);
    const friends: FriendData[] = [];
    
    snapshot.forEach(doc => {
      friends.push({ id: doc.id, ...doc.data() as FriendData });
    });
    
    console.log("Friends:", friends);
    return friends;
  } catch (error) {
    console.error("Error getting friends:", error);
    return [];
  }
};
