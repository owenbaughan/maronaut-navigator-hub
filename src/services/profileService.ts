
import { db } from "../lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

export interface BoatDetails {
  name: string;
  type: string;
  length: string;
  homeMarina: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  location: string;
  bio: string;
  boatDetails: BoatDetails;
  sailingSince?: string;
  email?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Use localStorage as a fallback if Firebase isn't working
const useLocalStorageFallback = true;

// Save to localStorage
const saveToLocalStorage = (profile: UserProfile): void => {
  localStorage.setItem(`profile_${profile.userId}`, JSON.stringify(profile));
};

// Get from localStorage
const getFromLocalStorage = (userId: string): UserProfile | null => {
  const data = localStorage.getItem(`profile_${userId}`);
  return data ? JSON.parse(data) : null;
};

// Create or update a user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    // Ensure we have a valid userId before proceeding
    if (!profile.userId) {
      console.error("Cannot save profile: userId is required");
      throw new Error("userId is required");
    }
    
    console.log("Saving profile:", profile);
    const userRef = doc(db, "userProfiles", profile.userId);
    
    try {
      // Test if we can read from this location first
      const testDoc = await getDoc(userRef);
      console.log("Read permission test:", testDoc ? "Success" : "No document exists yet");
    } catch (error) {
      console.error("Permission denied on read test. Firebase security rules may be blocking access:", error);
      throw new Error("Permission denied: Check your Firebase security rules for userProfiles collection");
    }
    
    // Convert Date objects to Firestore timestamps
    const profileToSave = {
      ...profile,
      // Only convert Date objects, leave Timestamps as they are
      createdAt: profile.createdAt instanceof Date ? profile.createdAt : profile.createdAt,
      updatedAt: new Date() // Always update the updatedAt timestamp
    };
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new profile with server timestamp
        await setDoc(userRef, {
          ...profileToSave,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log("Created new profile for:", profile.userId);
      } else {
        // Update existing profile with server timestamp, preserving original createdAt
        const existingData = userDoc.data();
        await updateDoc(userRef, {
          ...profileToSave,
          createdAt: existingData.createdAt, // Preserve original creation date
          updatedAt: serverTimestamp()
        });
        console.log("Updated existing profile for:", profile.userId);
      }
    } catch (error) {
      console.error("Permission denied on write operation. Firebase security rules may be blocking writes:", error);
      throw new Error("Permission denied: Check your Firebase security rules for userProfiles collection");
    }
    
    // Also save to localStorage as a fallback
    saveToLocalStorage(profile);
  } catch (error) {
    console.error("Error saving user profile to Firestore:", error);
    console.log("Saving to localStorage instead");
    saveToLocalStorage(profile);
    throw error; // Re-throw to allow handling by the component
  }
};

// Get a user profile by user ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    if (!userId) {
      console.error("Cannot get profile: userId is required");
      return null;
    }
    
    console.log("Getting profile for user:", userId);
    // Try to get from Firestore
    const userRef = doc(db, "userProfiles", userId);
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        console.log("Found profile in Firestore:", data);
        return data;
      } else {
        console.log("Profile not found in Firestore, checking localStorage");
        // If not in Firestore, try localStorage
        return getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error("Permission denied on read operation. Firebase security rules may be blocking reads:", error);
      throw new Error("Permission denied: Check your Firebase security rules for userProfiles collection");
    }
  } catch (error) {
    console.error("Error getting user profile from Firestore:", error);
    console.log("Trying localStorage instead");
    return getFromLocalStorage(userId);
  }
};

// Create an initial user profile when a new user signs up
export const createInitialProfile = async (userId: string, email: string, name: string): Promise<void> => {
  // Check if profile already exists
  const existingProfile = await getUserProfile(userId).catch(() => null);
  
  if (!existingProfile) {
    console.log("Creating initial profile for new user:", userId);
    const initialProfile: UserProfile = {
      userId,
      name,
      email,
      location: "",
      bio: "",
      boatDetails: {
        name: "",
        type: "",
        length: "",
        homeMarina: ""
      },
      sailingSince: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await saveUserProfile(initialProfile);
  }
};
