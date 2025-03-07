
import { db } from "../lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { getUserProfile } from "./profileService";

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: any;
  updatedAt: any;
}

// Send a friend request to another user
export const sendFriendRequest = async (currentUserId: string, receiverId: string): Promise<string> => {
  try {
    // Check if a request already exists between these users
    const existingRequest = await checkExistingRequest(currentUserId, receiverId);
    
    if (existingRequest) {
      console.log("Request already exists:", existingRequest);
      return existingRequest.id;
    }
    
    // Get receiver's profile to check privacy settings
    const receiverProfile = await getUserProfile(receiverId);
    
    // Determine initial status based on receiver's privacy settings
    const initialStatus: FriendRequestStatus = 
      (receiverProfile?.privacySettings?.autoAcceptFriends) ? 'accepted' : 'pending';
    
    // Create the friend request
    const requestData = {
      senderId: currentUserId,
      receiverId: receiverId,
      status: initialStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const requestRef = await addDoc(collection(db, "friendRequests"), requestData);
    console.log("Friend request sent with ID:", requestRef.id);
    
    return requestRef.id;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

// Check if a request already exists between two users
export const checkExistingRequest = async (
  userId1: string, 
  userId2: string
): Promise<FriendRequest | null> => {
  try {
    // Check for requests in both directions
    const q1 = query(
      collection(db, "friendRequests"),
      where("senderId", "==", userId1),
      where("receiverId", "==", userId2)
    );
    
    const q2 = query(
      collection(db, "friendRequests"),
      where("senderId", "==", userId2),
      where("receiverId", "==", userId1)
    );
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);
    
    // Combine results
    const requests: FriendRequest[] = [];
    
    snapshot1.forEach(doc => {
      requests.push({
        id: doc.id,
        ...doc.data()
      } as FriendRequest);
    });
    
    snapshot2.forEach(doc => {
      requests.push({
        id: doc.id,
        ...doc.data()
      } as FriendRequest);
    });
    
    return requests.length > 0 ? requests[0] : null;
  } catch (error) {
    console.error("Error checking existing friend request:", error);
    throw error;
  }
};

// Get all friend requests for a user (both sent and received)
export const getFriendRequests = async (userId: string): Promise<{
  sent: FriendRequest[];
  received: FriendRequest[];
}> => {
  try {
    // Get requests sent by the user
    const sentQuery = query(
      collection(db, "friendRequests"),
      where("senderId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    // Get requests received by the user
    const receivedQuery = query(
      collection(db, "friendRequests"),
      where("receiverId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery)
    ]);
    
    const sent: FriendRequest[] = [];
    const received: FriendRequest[] = [];
    
    sentSnapshot.forEach(doc => {
      sent.push({
        id: doc.id,
        ...doc.data()
      } as FriendRequest);
    });
    
    receivedSnapshot.forEach(doc => {
      received.push({
        id: doc.id,
        ...doc.data()
      } as FriendRequest);
    });
    
    return { sent, received };
  } catch (error) {
    console.error("Error getting friend requests:", error);
    throw error;
  }
};

// Update a friend request status (accept/decline)
export const updateFriendRequestStatus = async (
  requestId: string,
  newStatus: FriendRequestStatus
): Promise<void> => {
  try {
    const requestRef = doc(db, "friendRequests", requestId);
    await updateDoc(requestRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    console.log(`Friend request ${requestId} updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating friend request:", error);
    throw error;
  }
};

// Get all friends of a user (accepted requests in either direction)
export const getFriends = async (userId: string): Promise<{
  friendIds: string[];
  friendData: Record<string, any>;
}> => {
  try {
    // Get accepted requests where user is either sender or receiver
    const sentQuery = query(
      collection(db, "friendRequests"),
      where("senderId", "==", userId),
      where("status", "==", "accepted")
    );
    
    const receivedQuery = query(
      collection(db, "friendRequests"),
      where("receiverId", "==", userId),
      where("status", "==", "accepted")
    );
    
    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery)
    ]);
    
    const friendIds: string[] = [];
    
    // For requests sent by user, add receivers
    sentSnapshot.forEach(doc => {
      const data = doc.data();
      friendIds.push(data.receiverId);
    });
    
    // For requests received by user, add senders
    receivedSnapshot.forEach(doc => {
      const data = doc.data();
      friendIds.push(data.senderId);
    });
    
    // Get profile data for all friends
    const friendData: Record<string, any> = {};
    
    await Promise.all(
      friendIds.map(async (friendId) => {
        try {
          const profile = await getUserProfile(friendId);
          if (profile) {
            friendData[friendId] = profile;
          }
        } catch (error) {
          console.error(`Error fetching profile for friend ${friendId}:`, error);
        }
      })
    );
    
    return { friendIds, friendData };
  } catch (error) {
    console.error("Error getting friends:", error);
    throw error;
  }
};

// Search for users by username
export const searchUsers = async (
  query: string,
  currentUserId: string,
  maxResults = 10
): Promise<any[]> => {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    // Convert query to lowercase for case-insensitive search
    const searchQuery = query.trim().toLowerCase();
    
    // Get all users (limited to maxResults)
    // Note: In a production app, you'd want to use a more efficient approach
    const usersSnapshot = await getDocs(
      query(collection(db, "userProfiles"), limit(50))
    );
    
    const results: any[] = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      
      // Skip current user
      if (userData.userId === currentUserId) {
        return;
      }
      
      // Check if username contains the search query
      if (
        userData.username && 
        userData.username.toLowerCase().includes(searchQuery)
      ) {
        results.push(userData);
      }
    });
    
    // Limit results
    return results.slice(0, maxResults);
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Remove a friend connection
export const removeFriend = async (requestId: string): Promise<void> => {
  try {
    const requestRef = doc(db, "friendRequests", requestId);
    await deleteDoc(requestRef);
    console.log(`Friend connection ${requestId} removed`);
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

// Get the state of the relationship between two users
export const getFriendshipStatus = async (
  userId1: string,
  userId2: string
): Promise<{
  status: 'none' | 'pending' | 'accepted';
  requestId?: string;
  direction?: 'sent' | 'received';
}> => {
  try {
    const existingRequest = await checkExistingRequest(userId1, userId2);
    
    if (!existingRequest) {
      return { status: 'none' };
    }
    
    const direction = existingRequest.senderId === userId1 ? 'sent' : 'received';
    
    return {
      status: existingRequest.status as 'pending' | 'accepted',
      requestId: existingRequest.id,
      direction
    };
  } catch (error) {
    console.error("Error getting friendship status:", error);
    throw error;
  }
};
