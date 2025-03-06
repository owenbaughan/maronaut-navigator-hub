
import { db } from "../lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
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
  createdAt: Date;
  updatedAt: Date;
}

// Create or update a user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const userRef = doc(db, "userProfiles", profile.userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new profile
      await setDoc(userRef, {
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update existing profile
      await updateDoc(userRef, {
        ...profile,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

// Get a user profile by user ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "userProfiles", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Create an initial user profile when a new user signs up
export const createInitialProfile = async (userId: string, email: string, name: string): Promise<void> => {
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
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await saveUserProfile(initialProfile);
};
