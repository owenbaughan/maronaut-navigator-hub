
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

// Check if a username is available (not already taken)
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  if (!username || username.trim().length < 3) {
    return false;
  }

  try {
    const trimmedUsername = username.trim().toLowerCase();
    console.log("Checking if username is available:", trimmedUsername);

    const q = query(
      collection(db, "userProfiles"),
      where("username", "==", trimmedUsername),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    const isAvailable = querySnapshot.empty;
    
    console.log(`Username '${trimmedUsername}' available:`, isAvailable);
    return isAvailable;
  } catch (error) {
    console.error("Error checking username availability:", error);
    // Return false to be safe - don't let users pick username if we can't verify
    return false;
  }
};

// Check if a username is already taken
export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const available = await isUsernameAvailable(username);
  return !available;
};
