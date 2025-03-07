
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
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

export interface BoatDetails {
  name: string;
  type: string; // 'catamaran', 'sailboat', or 'motorboat'
  brand: string;
  length: string;
  homeMarina: string;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  location: string;
  bio: string;
  boatDetails: BoatDetails;
  sailingSince?: string;
  email?: string;
  createdAt: any;
  updatedAt: any;
}

// Create or update a user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    console.log("Saving profile:", profile);
    const userRef = doc(db, "userProfiles", profile.userId);
    const userDoc = await getDoc(userRef);
    
    // Ensure dates are in the correct format for Firestore
    const profileData = {
      ...profile,
      createdAt: profile.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log("Processed profile data for saving:", profileData);
    
    if (!userDoc.exists()) {
      // Create new profile
      console.log("Creating new profile document");
      await setDoc(userRef, profileData);
    } else {
      // Update existing profile
      console.log("Updating existing profile document");
      await updateDoc(userRef, profileData);
    }
    console.log("Profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

// Get a user profile by user ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Getting profile for user:", userId);
    const userRef = doc(db, "userProfiles", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProfile;
      console.log("Profile found:", data);
      return data;
    } else {
      console.log("No profile found for user");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Create an initial user profile when a new user signs up
export const createInitialProfile = async (userId: string, email: string, name: string): Promise<void> => {
  // Parse name to first and last name
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Check if profile already exists
  const existingProfile = await getUserProfile(userId).catch(() => null);
  
  if (!existingProfile) {
    const initialProfile: UserProfile = {
      userId,
      firstName,
      lastName,
      email,
      location: "",
      bio: "",
      boatDetails: {
        name: "",
        type: "",
        brand: "",
        length: "",
        homeMarina: ""
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await saveUserProfile(initialProfile);
  }
};

// Validate boat type
export const validateBoatType = (type: string): boolean => {
  const validTypes = ['catamaran', 'sailboat', 'motorboat'];
  return validTypes.includes(type.toLowerCase());
};
