
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User,
  ensureCollectionExists
} from '@/lib/firebase';
import { createInitialProfile } from '@/services/profileService';
import { isUsernameAvailable } from '@/services/profile/usernameService';

interface AuthContextType {
  currentUser: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  updateProfilePicture: (photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        console.log("User logged in, ensuring collections exist");
        await Promise.all([
          ensureCollectionExists('userProfiles'),
          ensureCollectionExists('following'),
          ensureCollectionExists('followRequests')
        ]);
      }
      
      setIsLoaded(true);
    });

    return unsubscribe;
  }, []);

  // Updated to use the proper availability check
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    return await isUsernameAvailable(username);
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const trimmedUsername = username.trim().toLowerCase();
      
      // Check username availability one more time before creating account
      const available = await isUsernameAvailable(trimmedUsername);
      if (!available) {
        throw new Error("This username is already taken. Please choose another one.");
      }
      
      console.log("Creating new user account with username:", trimmedUsername);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: trimmedUsername });
      
      await createInitialProfile(user.uid, email, trimmedUsername);
    } catch (error: any) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateProfilePicture = async (photoURL: string) => {
    try {
      if (!currentUser) {
        throw new Error("No user is signed in");
      }
      
      console.log("Updating Firebase Auth profile picture:", photoURL);
      await updateProfile(currentUser, { photoURL });
      
      setCurrentUser({ ...currentUser, photoURL });
      
      console.log("Profile picture updated successfully in Firebase Auth");
    } catch (error: any) {
      console.error("Error updating profile picture in Firebase Auth:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoaded,
    isSignedIn: !!currentUser,
    signUp,
    signIn,
    logout,
    checkUsernameAvailability,
    updateProfilePicture,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
