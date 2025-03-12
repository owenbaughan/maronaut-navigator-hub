
import { db, serverTimestamp } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { UserProfile } from "./types";
import { saveToLocalStorage, getFromLocalStorage } from "./localStorageUtils";
import { getDefaultPrivacySettings, normalizePrivacySettings } from "./privacyUtils";

const useLocalStorageFallback = true;

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    if (!profile.userId) {
      console.error("Cannot save profile: userId is required");
      throw new Error("userId is required");
    }
    
    if (profile.username) {
      profile.username = profile.username.trim().toLowerCase();
    }
    
    console.log("Saving profile:", profile);
    const userRef = doc(db, "userProfiles", profile.userId);
    
    const sanitizedProfile = {
      ...profile,
      createdAt: profile.createdAt instanceof Date 
        ? Timestamp.fromDate(profile.createdAt) 
        : profile.createdAt,
      updatedAt: serverTimestamp()
    };
    
    Object.keys(sanitizedProfile).forEach(key => {
      if (sanitizedProfile[key] === undefined) {
        delete sanitizedProfile[key];
      }
    });
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const defaultProfile = {
          ...sanitizedProfile,
          privacySettings: sanitizedProfile.privacySettings || getDefaultPrivacySettings(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        console.log("Creating new profile with defaults:", defaultProfile);
        await setDoc(userRef, defaultProfile);
        console.log("Created new profile for:", profile.userId);
      } else {
        const existingData = userDoc.data();
        
        if (!sanitizedProfile.privacySettings) {
          sanitizedProfile.privacySettings = existingData.privacySettings || getDefaultPrivacySettings();
        } else {
          sanitizedProfile.privacySettings = normalizePrivacySettings(sanitizedProfile.privacySettings);
        }
        
        console.log("Updating profile with privacy settings:", sanitizedProfile.privacySettings);
        
        const updateData = {
          ...sanitizedProfile,
          createdAt: existingData.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await updateDoc(userRef, updateData);
        console.log("Updated existing profile for:", profile.userId);
      }
      
      saveToLocalStorage(profile);
    } catch (error) {
      console.error("Error writing to Firestore:", error);
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  } catch (error) {
    console.error("Error saving user profile to Firestore:", error);
    
    if (useLocalStorageFallback) {
      console.log("Saving to localStorage instead");
      saveToLocalStorage(profile);
    }
    
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    if (!userId) {
      console.error("Cannot get profile: userId is required");
      return null;
    }
    
    console.log("Getting profile for user:", userId);
    const userRef = doc(db, "userProfiles", userId);
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        console.log("Found profile in Firestore:", data);
        
        if (!data.privacySettings) {
          data.privacySettings = getDefaultPrivacySettings();
          console.log("Added default privacy settings to profile:", data.privacySettings);
        } else {
          data.privacySettings = normalizePrivacySettings(data.privacySettings);
        }
        
        return data;
      } else {
        console.log("Profile not found in Firestore, checking localStorage");
        const localProfile = getFromLocalStorage(userId);
        
        if (localProfile) {
          if (!localProfile.privacySettings) {
            localProfile.privacySettings = getDefaultPrivacySettings();
          } else {
            localProfile.privacySettings = normalizePrivacySettings(localProfile.privacySettings);
          }
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
    
    if (localProfile) {
      if (!localProfile.privacySettings) {
        localProfile.privacySettings = getDefaultPrivacySettings();
      } else {
        localProfile.privacySettings = normalizePrivacySettings(localProfile.privacySettings);
      }
    }
    
    return localProfile;
  }
};

export const createInitialProfile = async (userId: string, email: string, username: string): Promise<void> => {
  try {
    const existingProfile = await getUserProfile(userId).catch(() => null);
    
    if (!existingProfile) {
      console.log("Creating initial profile for new user:", userId);
      
      const trimmedUsername = username.trim().toLowerCase();
      
      const initialProfile: UserProfile = {
        userId,
        username: trimmedUsername,
        email,
        location: "",
        bio: "",
        boatDetails: {
          name: "",
          type: "",
          length: "",
          homeMarina: ""
        },
        privacySettings: getDefaultPrivacySettings(),
        sailingSince: "",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await saveUserProfile(initialProfile);
      console.log("Successfully created initial profile with username:", trimmedUsername);
    }
  } catch (error) {
    console.error("Error creating initial profile:", error);
    throw error;
  }
};
