
import { query, where, getDocs, limit } from "firebase/firestore";
import { userProfilesCollection } from "@/lib/firebase";

// Check if a username is available
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  if (!username || username.trim().length < 3) {
    console.log("Username invalid - too short or empty");
    return false;
  }
  
  const normalizedUsername = username.trim().toLowerCase();
  
  try {
    console.log(`[Username Check] Checking if username "${normalizedUsername}" is available`);
    const q = query(
      userProfilesCollection,
      where("username", "==", normalizedUsername),
      limit(1)
    );
    
    console.log("[Username Check] Executing Firestore query");
    const querySnapshot = await getDocs(q);
    
    const isAvailable = querySnapshot.empty;
    const docCount = querySnapshot.size;
    
    console.log(`[Username Check] Query returned ${docCount} documents`);
    console.log(`[Username Check] Username "${normalizedUsername}" is ${isAvailable ? "available" : "already taken"}`);
    
    // Log the documents found (if any)
    if (!isAvailable) {
      console.log("[Username Check] Found matching documents:");
      querySnapshot.forEach((doc) => {
        console.log(`[Username Check] Document ID: ${doc.id}, Data:`, doc.data());
      });
    }
    
    return isAvailable;
  } catch (error) {
    console.error("[Username Check] Error checking username availability:", error);
    // If there's an error, we should assume the username is not available
    // to prevent potential username collisions
    return false;
  }
};

// Function to check if a username is already taken
export const isUsernameTaken = async (username: string): Promise<boolean> => {
  return !(await isUsernameAvailable(username));
};
