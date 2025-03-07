
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
    console.log("Saving profile with ID:", profile.userId);
    
    if (!profile.userId) {
      console.error("Cannot save profile: userId is missing");
      throw new Error("User ID is required to save profile");
    }
    
    const userRef = doc(db, "userProfiles", profile.userId);
    
    // Check if profile exists first
    const userDoc = await getDoc(userRef);
    
    // Prepare profile data for Firestore
    // Remove any undefined fields that might cause issues
    const profileData: any = {};
    
    Object.entries(profile).forEach(([key, value]) => {
      if (value !== undefined) {
        profileData[key] = value;
      }
    });
    
    // Handle timestamps
    if (userDoc.exists()) {
      // For updates: preserve createdAt, update updatedAt
      const existingData = userDoc.data();
      profileData.createdAt = existingData.createdAt;
      profileData.updatedAt = serverTimestamp();
      
      console.log("Updating existing profile with data:", profileData);
      await updateDoc(userRef, profileData);
    } else {
      // For new profiles: set both timestamps
      profileData.createdAt = serverTimestamp();
      profileData.updatedAt = serverTimestamp();
      
      console.log("Creating new profile with data:", profileData);
      await setDoc(userRef, profileData);
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
    if (!userId) {
      console.error("Cannot get profile: userId is missing");
      return null;
    }
    
    console.log("Getting profile for user:", userId);
    const userRef = doc(db, "userProfiles", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProfile;
      console.log("Profile found:", data);
      return {
        ...data,
        userId: userId // Ensure userId is set correctly
      };
    } else {
      console.log("No profile found for user:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Create an initial user profile when a new user signs up
export const createInitialProfile = async (userId: string, email: string, name: string): Promise<void> => {
  try {
    if (!userId) {
      console.error("Cannot create initial profile: userId is missing");
      return;
    }
    
    // Parse name to first and last name
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Check if profile already exists
    const existingProfile = await getUserProfile(userId).catch(() => null);
    
    if (!existingProfile) {
      console.log("Creating initial profile for new user:", userId);
      
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
      console.log("Initial profile created successfully");
    } else {
      console.log("Profile already exists for user:", userId);
    }
  } catch (error) {
    console.error("Error creating initial profile:", error);
    throw error;
  }
};

// Validate boat type
export const validateBoatType = (type: string): boolean => {
  const validTypes = ['catamaran', 'sailboat', 'motorboat'];
  return validTypes.includes(type.toLowerCase());
};
