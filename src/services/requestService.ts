
import { db, collection, ensureCollectionExists } from "../lib/firebase";
import { 
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  Timestamp,
  serverTimestamp
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
        receiverUsername: data.receiverUsername,
        senderFirstName: data.senderFirstName || null,
        senderLastName: data.senderLastName || null
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
        receiverUsername: data.receiverUsername,
        senderFirstName: data.senderFirstName || null,
        senderLastName: data.senderLastName || null
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
    
    const { senderId, receiverId, senderUsername, senderFirstName, senderLastName } = requestData;
    
    // Update the request status first (mark as accepted)
    try {
      await updateDoc(requestRef, { 
        status: 'accepted',
        updatedAt: Timestamp.now()
      });
      console.log("Request updated to accepted");
    } catch (updateError) {
      console.error("Error updating request status:", updateError);
      return false;
    }
    
    // Get sender profile to get username and photo
    let senderProfile = null;
    try {
      senderProfile = await getUserProfile(senderId);
      console.log("Sender profile:", senderProfile);
    } catch (error) {
      console.warn("Could not get sender profile, using data from request:", error);
    }
    
    // Create follow relationship in the following collection
    try {
      // Ensure following collection exists
      await ensureCollectionExists('following');
      console.log("Creating follow relationship document in following collection");
      
      const followingCollectionRef = collection(db, "following");
      
      // Important: Since Firestore rules check that userId matches auth.uid
      // We need to make sure the sender is the one "doing the following"
      const followData = {
        userId: senderId, // Who is doing the following (sender)
        followingId: receiverId, // Who is being followed (receiver)
        username: senderProfile?.username || senderUsername || "Unknown",
        firstName: senderProfile?.firstName || senderFirstName || null,
        lastName: senderProfile?.lastName || senderLastName || null,
        photoURL: senderProfile?.profilePicture || null,
        timestamp: serverTimestamp() // Use serverTimestamp for consistency
      };
      
      console.log("Adding follow relationship with data:", JSON.stringify(followData));
      
      // Add the document to the following collection
      await addDoc(followingCollectionRef, followData);
      
      console.log("Successfully created follow relationship");
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
    
    await updateDoc(requestRef, { 
      status: 'declined',
      updatedAt: Timestamp.now()
    });
    console.log("Request updated to declined");
    
    return true;
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    return false;
  }
};
