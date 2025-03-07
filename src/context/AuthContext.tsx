
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User
} from '@/lib/firebase';
import { createInitialProfile, isUsernameAvailable } from '@/services/profileService';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUsername: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoaded(true);
    });

    return unsubscribe;
  }, []);

  const checkUsername = async (username: string): Promise<boolean> => {
    if (!username || username.trim().length < 3) {
      console.log("Username too short, not checking availability");
      return false;
    }
    
    const trimmedUsername = username.trim().toLowerCase();
    console.log("AuthContext: Checking username availability:", trimmedUsername);
    const result = await isUsernameAvailable(trimmedUsername);
    console.log("AuthContext: Username availability result:", result);
    return result;
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const trimmedUsername = username.trim().toLowerCase();
      
      // First check if the username is available
      const isAvailable = await isUsernameAvailable(trimmedUsername);
      if (!isAvailable) {
        console.log("Username already taken:", trimmedUsername);
        throw new Error("Username already taken. Please choose another one.");
      }
      
      console.log("Creating new user account with username:", trimmedUsername);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name with the username
      await updateProfile(user, { displayName: trimmedUsername });
      
      // Create initial profile with username
      await createInitialProfile(user.uid, email, trimmedUsername);
      
      toast({
        title: "Account created",
        description: "Welcome to Maronaut! You're now signed in.",
      });
      
    } catch (error: any) {
      console.error("Error creating account:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "There was a problem creating your account.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: error.message || "There was a problem signing you out.",
        variant: "destructive",
      });
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
    checkUsername,
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
