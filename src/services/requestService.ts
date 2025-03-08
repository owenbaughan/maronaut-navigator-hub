
import { db, ensureCollectionExists, collection } from "../lib/firebase";
import { 
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { FollowRequest } from "./types";
import { getUserProfile } from "./profileService";

export const getFollowRequests = async (userId: string) => {
  try {
    console.log("Getting follow requests for user:", userId);
    
    // Ensure collection exists
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
    
    // Get request from followRequests collection
    const requestRef = doc(db, "followRequests", requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      console.error("Follow request not found");
      return false;
    }
    
    const requestData = requestDoc.data();
    console.log("Found request in followRequests collection:", requestData);
    
    if (!requestData.senderId || !requestData.receiverId) {
      console.error("Request data missing critical fields:", requestData);
      return false;
    }
    
    const { senderId, receiverId, senderUsername } = requestData;
    
    // Ensure following collection exists
    await ensureCollectionExists('following');
    
    // Get sender profile to get username and photo
    let senderProfile = null;
    try {
      senderProfile = await getUserProfile(senderId);
      console.log("Sender profile:", senderProfile);
    } catch (error) {
      console.warn("Could not get sender profile, using data from request:", error);
    }
    
    // Update the request status first (mark as accepted)
    try {
      const timestamp = new Date();
      await updateDoc(requestRef, { 
        status: 'accepted',
        updatedAt: timestamp
      });
      console.log("Request updated to accepted");
    } catch (updateError) {
      console.error("Error updating request status:", updateError);
      return false;
    }
    
    // Create follow relationship in the following collection
    try {
      console.log("Creating follow relationship document in following collection");
      
      // Using a plain JS object with current timestamp
      const timestamp = new Date();
      
      const followData = {
        userId: senderId, // Who is doing the following
        followingId: receiverId, // Who is being followed
        username: senderProfile?.username || senderUsername || "Unknown",
        photoURL: senderProfile?.profilePicture || null,
        timestamp: timestamp
      };
      
      console.log("Adding follow relationship with data:", JSON.stringify(followData));
      
      const followingCollectionRef = collection(db, "following");
      const docRef = await addDoc(followingCollectionRef, followData);
      console.log("Successfully created follow relationship with ID:", docRef.id);
      return true;
    } catch (addError) {
      console.error("Error creating follow relationship:", addError);
      console.error("Error details:", JSON.stringify(addError, null, 2));
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
    
    const requestRef = doc(db, "followRequests", requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      console.error("Follow request not found");
      return false;
    }
    
    await updateDoc(requestRef, { status: 'declined' });
    console.log("Request updated to declined");
    
    return true;
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    return false;
  }
};
