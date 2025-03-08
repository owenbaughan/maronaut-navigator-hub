import { db, ensureCollectionExists, collection } from "../lib/firebase";
import { 
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { FollowRequest } from "./types";
import { getUserProfile } from "./profileService";

export const getFollowRequests = async (userId: string) => {
  try {
    console.log("Getting follow requests for user:", userId);
    
    // Ensure both collections exist for backward compatibility
    await Promise.all([
      ensureCollectionExists('followRequests'),
      ensureCollectionExists('friendRequests')
    ]);
    
    // First try the new followRequests collection
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
    
    // If we have results in followRequests, use those
    if (!incomingSnapshot.empty || !outgoingSnapshot.empty) {
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
    }
    
    // If no results in followRequests, try the legacy friendRequests collection
    console.log("No results in followRequests, trying legacy friendRequests collection");
    
    const legacyIncomingQuery = query(
      collection(db, "friendRequests"),
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );
    
    const legacyOutgoingQuery = query(
      collection(db, "friendRequests"),
      where("senderId", "==", userId),
      where("status", "==", "pending")
    );
    
    const [legacyIncomingSnapshot, legacyOutgoingSnapshot] = await Promise.all([
      getDocs(legacyIncomingQuery),
      getDocs(legacyOutgoingQuery)
    ]);
    
    const incomingRequests: FollowRequest[] = [];
    const outgoingRequests: FollowRequest[] = [];
    
    legacyIncomingSnapshot.forEach(doc => {
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
    
    legacyOutgoingSnapshot.forEach(doc => {
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
    
    // First try in the followRequests collection
    let requestRef = doc(db, "followRequests", requestId);
    let requestDoc = await getDoc(requestRef);
    let collectionUsed = "followRequests";
    
    // If not found, try in the friendRequests collection
    if (!requestDoc.exists()) {
      console.log("Request not found in followRequests, trying friendRequests");
      requestRef = doc(db, "friendRequests", requestId);
      requestDoc = await getDoc(requestRef);
      collectionUsed = "friendRequests";
    }
    
    if (!requestDoc.exists()) {
      console.error("Follow/friend request not found in either collection");
      return false;
    }
    
    const requestData = requestDoc.data();
    console.log(`Found request in ${collectionUsed} collection:`, requestData);
    
    if (!requestData.senderId || !requestData.receiverId) {
      console.error("Request data missing critical fields:", requestData);
      return false;
    }
    
    const { senderId, receiverId, senderUsername } = requestData;
    
    // Ensure following collection exists
    await ensureCollectionExists('following');
    
    // Get sender profile to get username
    let senderProfile = null;
    try {
      senderProfile = await getUserProfile(senderId);
      console.log("Sender profile:", senderProfile);
    } catch (error) {
      console.warn("Could not get sender profile, using data from request:", error);
    }
    
    // Create follow relationship in the following collection
    console.log("Creating follow relationship document in following collection");
    
    // Using a plain JS object instead of relying on serverTimestamp()
    // as that can sometimes cause issues with security rules
    const timestamp = new Date();
    
    // Important: Make sure the data structure matches our Firebase rules
    const followData = {
      userId: senderId, // Who is doing the following
      followingId: receiverId, // Who is being followed
      username: senderProfile?.username || senderUsername || "Unknown",
      photoURL: senderProfile?.profilePicture || null,
      timestamp: timestamp // Using a JavaScript Date object instead of serverTimestamp
    };
    
    console.log("Adding follow relationship with data:", JSON.stringify(followData));
    
    // Update the request status first (mark as accepted)
    try {
      await updateDoc(requestRef, { 
        status: 'accepted',
        updatedAt: timestamp
      });
      console.log(`Request updated to accepted in ${collectionUsed}`);
    } catch (updateError) {
      console.error(`Error updating request status in ${collectionUsed}:`, updateError);
      return false;
    }
    
    // Now add the follow relationship
    try {
      const followingCollectionRef = collection(db, "following");
      const docRef = await addDoc(followingCollectionRef, followData);
      console.log("Successfully created follow relationship with ID:", docRef.id);
      return true;
    } catch (addError) {
      console.error("Error creating follow relationship:", addError);
      console.error("Error details:", JSON.stringify(addError, null, 2));
      // The request is already marked as accepted, but the follow relationship failed
      // We could try to revert the request status, but that might fail too
      return false;
    }
  } catch (error) {
    console.error("Error in acceptFollowRequest:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return false;
  }
};

export const rejectFollowRequest = async (requestId: string) => {
  try {
    console.log("Rejecting follow request:", requestId);
    
    // First try in the followRequests collection
    let requestRef = doc(db, "followRequests", requestId);
    let requestDoc = await getDoc(requestRef);
    
    // If not found, try in the friendRequests collection
    if (!requestDoc.exists()) {
      console.log("Request not found in followRequests, trying friendRequests");
      requestRef = doc(db, "friendRequests", requestId);
      requestDoc = await getDoc(requestRef);
    }
    
    if (!requestDoc.exists()) {
      console.error("Follow/friend request not found in either collection");
      return false;
    }
    
    const requestData = requestDoc.data();
    const { senderId, receiverId } = requestData;
    
    await updateDoc(requestRef, { status: 'declined' });
    
    // Try to find and update matching request in the other collection
    try {
      const otherCollectionName = requestRef.path.includes("followRequests") ? "friendRequests" : "followRequests";
      const otherCollectionQuery = query(
        collection(db, otherCollectionName),
        where("senderId", "==", senderId),
        where("receiverId", "==", receiverId),
        where("status", "==", "pending")
      );
      
      const otherSnapshot = await getDocs(otherCollectionQuery);
      if (!otherSnapshot.empty) {
        const matchingDoc = otherSnapshot.docs[0];
        await updateDoc(doc(db, otherCollectionName, matchingDoc.id), { status: 'declined' });
        console.log(`Updated matching request in ${otherCollectionName}`);
      }
    } catch (error) {
      console.warn("Error updating matching request in other collection:", error);
    }
    
    return true;
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    return false;
  }
};
