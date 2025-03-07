
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
  autoAcceptFollows: boolean;
  // For backward compatibility, include both field names
  autoAcceptFriends?: boolean;
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

const useLocalStorageFallback = true;

const saveToLocalStorage = (profile: UserProfile): void => {
  localStorage.setItem(`profile_${profile.userId}`, JSON.stringify(profile));
};

const getFromLocalStorage = (userId: string): UserProfile | null => {
  const data = localStorage.getItem(`profile_${userId}`);
  return data ? JSON.parse(data) : null;
};

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  console.log("Username availability check is disabled, returning true for:", username);
  return true;
};

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    console.log("Uploading profile picture for user:", userId);
    
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `profilePictures/${userId}_${timestamp}`);
    
    console.log("Uploading to Firebase Storage...");
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload successful:", snapshot);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL:", downloadURL);
    
    try {
      const userRef = doc(db, "userProfiles", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          profilePicture: downloadURL,
          updatedAt: serverTimestamp()
        });
        console.log("Updated user profile with new picture URL in Firestore");
      } else {
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
    }
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

export const getDefaultPrivacySettings = (): PrivacySettings => ({
  isPublicProfile: true,
  autoAcceptFollows: true,
  autoAcceptFriends: true, // Include for backward compatibility
  showEmail: false,
  showLocation: true,
  showBoatDetails: true
});

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
    
    try {
      const testDoc = await getDoc(userRef);
      console.log("Read permission test:", testDoc ? "Success" : "No document exists yet");
    } catch (error) {
      console.error("Permission denied on read test. Firebase security rules may be blocking access:", error);
      throw new Error("Permission denied: Check your Firebase security rules for userProfiles collection");
    }
    
    const profileToSave = {
      ...profile,
      createdAt: profile.createdAt instanceof Date ? profile.createdAt : profile.createdAt,
      updatedAt: new Date()
    };
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const defaultProfile = {
          ...profileToSave,
          privacySettings: profileToSave.privacySettings || getDefaultPrivacySettings(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        console.log("Creating new profile with defaults:", defaultProfile);
        await setDoc(userRef, defaultProfile);
        console.log("Created new profile for:", profile.userId);
      } else {
        const existingData = userDoc.data();
        
        if (!profileToSave.privacySettings) {
          profileToSave.privacySettings = existingData.privacySettings || getDefaultPrivacySettings();
        } else {
          // Ensure backwards compatibility by copying autoAcceptFollows to autoAcceptFriends
          if (profileToSave.privacySettings.autoAcceptFollows !== undefined) {
            profileToSave.privacySettings.autoAcceptFriends = profileToSave.privacySettings.autoAcceptFollows;
          } else if (profileToSave.privacySettings.autoAcceptFriends !== undefined) {
            profileToSave.privacySettings.autoAcceptFollows = profileToSave.privacySettings.autoAcceptFriends;
          }
        }
        
        console.log("Updating profile with privacy settings:", profileToSave.privacySettings);
        
        await updateDoc(userRef, {
          ...profileToSave,
          createdAt: existingData.createdAt,
          updatedAt: serverTimestamp()
        });
        console.log("Updated existing profile for:", profile.userId);
      }
    } catch (error) {
      console.error("Permission denied on write operation. Firebase security rules may be blocking writes:", error);
      throw new Error("Permission denied: Check your Firebase security rules for userProfiles collection");
    }
    
    saveToLocalStorage(profile);
  } catch (error) {
    console.error("Error saving user profile to Firestore:", error);
    console.log("Saving to localStorage instead");
    saveToLocalStorage(profile);
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
          // Ensure both fields are present for backward compatibility
          if (data.privacySettings.autoAcceptFollows === undefined && data.privacySettings.autoAcceptFriends !== undefined) {
            data.privacySettings.autoAcceptFollows = data.privacySettings.autoAcceptFriends;
          } else if (data.privacySettings.autoAcceptFriends === undefined && data.privacySettings.autoAcceptFollows !== undefined) {
            data.privacySettings.autoAcceptFriends = data.privacySettings.autoAcceptFollows;
          }
        }
        
        return data;
      } else {
        console.log("Profile not found in Firestore, checking localStorage");
        const localProfile = getFromLocalStorage(userId);
        
        if (localProfile && !localProfile.privacySettings) {
          localProfile.privacySettings = getDefaultPrivacySettings();
          console.log("Added default privacy settings to local profile:", localProfile.privacySettings);
        } else if (localProfile && localProfile.privacySettings) {
          // Ensure both fields are present for backward compatibility
          if (localProfile.privacySettings.autoAcceptFollows === undefined && localProfile.privacySettings.autoAcceptFriends !== undefined) {
            localProfile.privacySettings.autoAcceptFollows = localProfile.privacySettings.autoAcceptFriends;
          } else if (localProfile.privacySettings.autoAcceptFriends === undefined && localProfile.privacySettings.autoAcceptFollows !== undefined) {
            localProfile.privacySettings.autoAcceptFriends = localProfile.privacySettings.autoAcceptFollows;
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
    
    if (localProfile && !localProfile.privacySettings) {
      localProfile.privacySettings = getDefaultPrivacySettings();
    } else if (localProfile && localProfile.privacySettings) {
      // Ensure both fields are present for backward compatibility
      if (localProfile.privacySettings.autoAcceptFollows === undefined && localProfile.privacySettings.autoAcceptFriends !== undefined) {
        localProfile.privacySettings.autoAcceptFollows = localProfile.privacySettings.autoAcceptFriends;
      } else if (localProfile.privacySettings.autoAcceptFriends === undefined && localProfile.privacySettings.autoAcceptFollows !== undefined) {
        localProfile.privacySettings.autoAcceptFriends = localProfile.privacySettings.autoAcceptFollows;
      }
    }
    
    return localProfile;
  }
};

export const createInitialProfile = async (userId: string, email: string, username: string): Promise<void> => {
  const existingProfile = await getUserProfile(userId).catch(() => null);
  
  if (!existingProfile) {
    console.log("Creating initial profile for new user:", userId);
    
    const initialProfile: UserProfile = {
      userId,
      username: username.trim().toLowerCase(),
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
    console.log("Successfully created initial profile with username:", username);
  }
};

export const getPublicUserProfile = async (userId: string): Promise<Partial<UserProfile> | null> => {
  try {
    const fullProfile = await getUserProfile(userId);
    
    if (!fullProfile) return null;
    
    if (fullProfile.privacySettings && !fullProfile.privacySettings.isPublicProfile) {
      return {
        userId: fullProfile.userId,
        username: fullProfile.username,
      };
    }
    
    const publicProfile: Partial<UserProfile> = {
      userId: fullProfile.userId,
      username: fullProfile.username,
      firstName: fullProfile.firstName,
      lastName: fullProfile.lastName,
      bio: fullProfile.bio,
      sailingSince: fullProfile.sailingSince,
    };
    
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
