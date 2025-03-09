
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

interface AuthContextType {
  currentUser: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // If user is logged in, ensure collections exist
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

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const trimmedUsername = username.trim().toLowerCase();
      
      console.log("Creating new user account with username:", trimmedUsername);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name with the username
      await updateProfile(user, { displayName: trimmedUsername });
      
      // Create initial profile with username
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

  const value = {
    currentUser,
    isLoaded,
    isSignedIn: !!currentUser,
    signUp,
    signIn,
    logout,
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
