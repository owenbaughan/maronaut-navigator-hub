
import { db, storage } from "../lib/firebase";
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
  Timestamp,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface PrivacySettings {
  isPublicProfile: boolean;
  autoAcceptFriends: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showBoatDetails: boolean;
}

export interface BoatDetails {
  name: string;
  type: string;
  length: string;
  homeMarina: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  location: string;
  bio: string;
  boatDetails: BoatDetails;
  sailingSince?: string;
  email?: string;
  profilePicture?: string;
  privacySettings?: PrivacySettings;
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

// This function is kept for backward compatibility but returns true always
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  console.log("Username availability check is disabled, returning true for:", username);
  return true;
};

// Upload profile picture to Firebase Storage
export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    console.log("Uploading profile picture for user:", userId);
    
    // Create a unique file name with timestamp to avoid cache issues
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `profilePictures/${userId}_${timestamp}`);
    
    // Upload the file
    console.log("Uploading to Firebase Storage...");
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload successful:", snapshot);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL:", downloadURL);
    
    // Update user profile with the new picture URL
    try {
      const userRef = doc(db, "userProfiles", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update the existing document with the profile picture URL
        await updateDoc(userRef, {
          profilePicture: downloadURL,
          updatedAt: serverTimestamp()
        });
        console.log("Updated user profile with new picture URL in Firestore");
      } else {
        // If the user document doesn't exist, create it with basic info
        await setDoc(userRef, {
          userId,
          profilePicture: downloadURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log("Created new user profile with picture URL in Firestore");
      }
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
      // Continue execution - we still want to return the downloadURL even if 
      // updating the user profile fails
    }
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Default privacy settings
export const getDefaultPrivacySettings = (): PrivacySettings => ({
  isPublicProfile: true,
  autoAcceptFriends: true,
  showEmail: false,
  showLocation: true,
  showBoatDetails: true
});

// Create or update a user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    // Ensure we have a valid userId before proceeding
    if (!profile.userId) {
      console.error("Cannot save profile: userId is required");
      throw new Error("userId is required");
    }
    
    // Ensure username is properly set and trimmed
    if (profile.username) {
      profile.username = profile.username.trim().toLowerCase(); // Store as lowercase
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
        // Create new profile with server timestamp and default privacy settings
        const defaultProfile = {
          ...profileToSave,
          // Always ensure privacySettings exists with default values
          privacySettings: profileToSave.privacySettings || getDefaultPrivacySettings(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        console.log("Creating new profile with defaults:", defaultProfile);
        await setDoc(userRef, defaultProfile);
        console.log("Created new profile for:", profile.userId);
      } else {
        // Update existing profile with server timestamp, preserving original createdAt
        const existingData = userDoc.data();
        
        // Always ensure privacySettings exists with default values if not present
        if (!profileToSave.privacySettings) {
          profileToSave.privacySettings = existingData.privacySettings || getDefaultPrivacySettings();
        }
        
        console.log("Updating profile with privacy settings:", profileToSave.privacySettings);
        
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
        
        // Ensure privacySettings exists
        if (!data.privacySettings) {
          data.privacySettings = getDefaultPrivacySettings();
          console.log("Added default privacy settings to profile:", data.privacySettings);
        }
        
        return data;
      } else {
        console.log("Profile not found in Firestore, checking localStorage");
        // If not in Firestore, try localStorage
        const localProfile = getFromLocalStorage(userId);
        
        // Ensure privacySettings exists
        if (localProfile && !localProfile.privacySettings) {
          localProfile.privacySettings = getDefaultPrivacySettings();
          console.log("Added default privacy settings to local profile:", localProfile.privacySettings);
        }
        
        return localProfile;
      }
    } catch (error) {
      console.error("Permission denied on read operation. Firebase security rules may be blocking reads:", error);
      throw new Error("Permission denied: Check your Firebase security rules for userProfiles collection");
    }
  } catch (error) {
    console.error("Error getting user profile from Firestore:", error);
    console.log("Trying localStorage instead");
    const localProfile = getFromLocalStorage(userId);
    
    // Ensure privacySettings exists
    if (localProfile && !localProfile.privacySettings) {
      localProfile.privacySettings = getDefaultPrivacySettings();
    }
    
    return localProfile;
  }
};

// Create an initial user profile when a new user signs up
export const createInitialProfile = async (userId: string, email: string, username: string): Promise<void> => {
  // Check if profile already exists
  const existingProfile = await getUserProfile(userId).catch(() => null);
  
  if (!existingProfile) {
    console.log("Creating initial profile for new user:", userId);
    
    const initialProfile: UserProfile = {
      userId,
      username: username.trim().toLowerCase(), // Store as lowercase
      email,
      location: "",
      bio: "",
      boatDetails: {
        name: "",
        type: "",
        length: "",
        homeMarina: ""
      },
      // Always include privacy settings for new profiles
      privacySettings: getDefaultPrivacySettings(),
      sailingSince: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await saveUserProfile(initialProfile);
    console.log("Successfully created initial profile with username:", username);
  }
};

// Get a filtered user profile based on privacy settings
export const getPublicUserProfile = async (userId: string): Promise<Partial<UserProfile> | null> => {
  try {
    const fullProfile = await getUserProfile(userId);
    
    if (!fullProfile) return null;
    
    // If profile is not public and not specifically requested by friend, return limited info
    if (fullProfile.privacySettings && !fullProfile.privacySettings.isPublicProfile) {
      return {
        userId: fullProfile.userId,
        username: fullProfile.username,
        // Only return minimal information
      };
    }
    
    // Otherwise, create a filtered version based on privacy settings
    const publicProfile: Partial<UserProfile> = {
      userId: fullProfile.userId,
      username: fullProfile.username,
      firstName: fullProfile.firstName,
      lastName: fullProfile.lastName,
      bio: fullProfile.bio,
      sailingSince: fullProfile.sailingSince,
    };
    
    // Add optional fields based on privacy settings
    if (!fullProfile.privacySettings || fullProfile.privacySettings.showEmail) {
      publicProfile.email = fullProfile.email;
    }
    
    if (!fullProfile.privacySettings || fullProfile.privacySettings.showLocation) {
      publicProfile.location = fullProfile.location;
    }
    
    if (!fullProfile.privacySettings || fullProfile.privacySettings.showBoatDetails) {
      publicProfile.boatDetails = fullProfile.boatDetails;
    }
    
    return publicProfile;
  } catch (error) {
    console.error("Error getting public user profile:", error);
    return null;
  }
};
