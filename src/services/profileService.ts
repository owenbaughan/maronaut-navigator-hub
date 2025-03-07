
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
    const userRef = doc(db, "userProfiles", profile.userId);
    const userDoc = await getDoc(userRef);
    
    // Ensure dates are in the correct format for Firestore
    const profileData = {
      ...profile,
      createdAt: profile.createdAt instanceof Date ? Timestamp.fromDate(profile.createdAt) : profile.createdAt,
      updatedAt: serverTimestamp()
    };
    
    if (!userDoc.exists()) {
      // Create new profile
      await setDoc(userRef, profileData);
    } else {
      // Update existing profile
      await updateDoc(userRef, profileData);
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
