
import { query, where, getDocs, limit } from "firebase/firestore";
import { userProfilesCollection } from "@/lib/firebase";

// Check if a username is available
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  if (!username || username.trim().length < 3) {
    return false;
  }
  
  try {
    console.log("Checking if username is available:", username);
    const q = query(
      userProfilesCollection,
      where("username", "==", username.trim().toLowerCase()),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    const isAvailable = querySnapshot.empty;
    console.log(`Username "${username}" is ${isAvailable ? "available" : "already taken"}`);
    return isAvailable;
  } catch (error) {
    console.error("Error checking username availability:", error);
    // If there's an error, we should assume the username is not available
    // to prevent potential username collisions
    return false;
  }
};

// Function to check if a username is already taken
export const isUsernameTaken = async (username: string): Promise<boolean> => {
  return !(await isUsernameAvailable(username));
};
