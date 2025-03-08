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
    
    console.log("All profiles in database:");
    querySnapshot.forEach((doc) => {
      console.log("Document ID:", doc.id, "Data:", JSON.stringify(doc.data()));
    });
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
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

export const checkFriendRequestExists = async (userId: string, targetUserId: string) => {
  try {
    const requestsRef = collection(db, "friendRequests");
    
    const sentQuery = query(
      requestsRef,
      where("senderId", "==", userId),
      where("receiverId", "==", targetUserId)
    );
    
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

export const checkFriendshipExists = async (userId: string, targetUserId: string) => {
  try {
    const friendsRef = collection(db, "friends");
    
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
    
    const exists = !snapshot1.empty || !snapshot2.empty;
    console.log(`Friendship exists between ${userId} and ${targetUserId}: ${exists}`);
    console.log("Friendship check results:", 
      `Direction 1: ${snapshot1.size} records`, 
      `Direction 2: ${snapshot2.size} records`);
    
    return exists;
  } catch (error) {
    console.error("Error checking friendship:", error);
    return false;
  }
};

export const sendFriendRequest = async (senderId: string, receiverId: string) => {
  try {
    console.log(`Sending friend request from ${senderId} to ${receiverId}`);
    
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

export const addFriendDirectly = async (userId: string, friendId: string) => {
  try {
    console.log(`Adding friend directly: ${userId} and ${friendId}`);
    
    const alreadyFriends = await checkFriendshipExists(userId, friendId);
    if (alreadyFriends) {
      console.log("Users are already friends, skipping friend creation");
      return true;
    }
    
    const [userProfile, friendProfile] = await Promise.all([
      getUserProfile(userId),
      getUserProfile(friendId)
    ]);
    
    if (!userProfile || !friendProfile) {
      console.error("Could not find user profiles for either", userId, "or", friendId);
      throw new Error("Could not find user profiles");
    }
    
    console.log("Found profiles:", userProfile.username, "and", friendProfile.username);
    
    const timestamp = serverTimestamp() as Timestamp;
    
    const userFriendData = {
      userId,
      friendId,
      username: friendProfile.username,
      photoURL: friendProfile.profilePicture || null,
      timestamp
    };
    
    console.log("Creating friend entry for current user:", userFriendData);
    const userFriendRef = await addDoc(collection(db, "friends"), userFriendData);
    console.log("Added friend entry for current user with document ID:", userFriendRef.id);
    
    const friendUserData = {
      userId: friendId,
      friendId: userId,
      username: userProfile.username,
      photoURL: userProfile.profilePicture || null,
      timestamp
    };
    
    console.log("Creating friend entry for friend:", friendUserData);
    const friendUserRef = await addDoc(collection(db, "friends"), friendUserData);
    console.log("Added friend entry for friend with document ID:", friendUserRef.id);
    
    console.log("Friend added directly, both entries created successfully");
    
    console.log("Verifying friend entries were created by querying the collection...");
    const friendsRef = collection(db, "friends");
    
    const query1 = query(
      friendsRef,
      where("userId", "==", userId),
      where("friendId", "==", friendId)
    );
    
    const query2 = query(
      friendsRef,
      where("userId", "==", friendId),
      where("friendId", "==", userId)
    );
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(query1),
      getDocs(query2)
    ]);
    
    console.log("Verification results:");
    console.log(`- Direction 1 (${userId} -> ${friendId}): ${snapshot1.size} records`);
    snapshot1.forEach(doc => console.log(`  Document ID: ${doc.id}, Data:`, doc.data()));
    
    console.log(`- Direction 2 (${friendId} -> ${userId}): ${snapshot2.size} records`);
    snapshot2.forEach(doc => console.log(`  Document ID: ${doc.id}, Data:`, doc.data()));
    
    const verifyFriendship = !snapshot1.empty || !snapshot2.empty;
    console.log("Verification that friendship was created:", verifyFriendship);
    
    return verifyFriendship;
  } catch (error) {
    console.error("Error adding friend directly:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (requestId: string) => {
  try {
    console.log("Accepting friend request:", requestId);
    
    const requestRef = doc(db, "friendRequests", requestId);
    const requestSnap = await getDoc(requestRef);
    
    if (!requestSnap.exists()) {
      throw new Error("Friend request not found");
    }
    
    const requestData = requestSnap.data() as FriendRequest;
    
    await updateDoc(requestRef, { status: 'accepted' });
    
    await addFriendDirectly(requestData.senderId, requestData.receiverId);
    
    console.log("Friend request accepted");
    return true;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

export const removeFriendRequest = async (requestId: string) => {
  try {
    console.log("Removing friend request:", requestId);
    
    const requestRef = doc(db, "friendRequests", requestId);
    await deleteDoc(requestRef);
    
    console.log("Friend request removed");
    return true;
  } catch (error) {
    console.error("Error removing friend request:", error);
    throw error;
  }
};

export const getFriendRequests = async (userId: string) => {
  try {
    console.log("Getting friend requests for user:", userId);
    const requestsRef = collection(db, "friendRequests");
    
    const incomingQuery = query(
      requestsRef,
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );
    
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

export const getFriends = async (userId: string) => {
  try {
    console.log("Getting friends for user:", userId);
    const friendsRef = collection(db, "friends");
    const q = query(
      friendsRef,
      where("userId", "==", userId)
    );
    
    console.log(`Querying friends collection with userId: ${userId}`);
    console.log(`Collection path: ${friendsRef.path}`);
    
    console.log("Query parameters:", JSON.stringify({
      collection: friendsRef.path,
      where: {
        field: "userId",
        operator: "==",
        value: userId
      }
    }));
    
    const snapshot = await getDocs(q);
    console.log(`Found ${snapshot.size} friend records for user ${userId}`);
    
    console.log("==== FRIEND DOCUMENTS FOUND ====");
    if (snapshot.empty) {
      console.log("NO FRIEND DOCUMENTS FOUND!");
    } else {
      snapshot.forEach((doc, index) => {
        console.log(`Friend document ${index + 1}:`, doc.id, doc.data());
      });
    }
    console.log("================================");
    
    const friends: FriendData[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data() as FriendData;
      friends.push({ 
        id: doc.id, 
        userId: data.userId,
        friendId: data.friendId,
        username: data.username || "Unknown",
        photoURL: data.photoURL,
        timestamp: data.timestamp
      });
    });
    
    console.log("Processed friends list:", JSON.stringify(friends));
    return friends;
  } catch (error) {
    console.error("Error getting friends:", error);
    console.error("Error details:", JSON.stringify(error));
    return [];
  }
};
