
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { auth, signInWithCustomToken } from '@/lib/firebase';
import { createInitialProfile } from '@/services/profileService';

interface FirebaseInitializerProps {
  children: React.ReactNode;
}

const FirebaseInitializer: React.FC<FirebaseInitializerProps> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const setupFirebaseAuth = async () => {
        try {
          // In a real implementation, you would call your backend to get a Firebase custom token
          // based on the Clerk user ID. This would require setting up a server endpoint.
          
          // For now, we'll just consider Firebase initialized without the token
          // and create a profile if needed
          
          // Check if user profile exists and create one if it doesn't
          try {
            await createInitialProfile(
              user.id,
              user.primaryEmailAddress?.emailAddress || '',
              user.fullName || ''
            );
          } catch (error) {
            console.log("Profile might already exist:", error);
          }
          
          setIsFirebaseInitialized(true);
        } catch (error) {
          console.error("Error initializing Firebase:", error);
        }
      };

      setupFirebaseAuth();
    } else if (isLoaded && !isSignedIn) {
      // If user is not signed in, we still want to render the children
      setIsFirebaseInitialized(true);
    }
  }, [isLoaded, isSignedIn, user]);

  // Show loading state while Firebase is initializing
  if (!isFirebaseInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maronaut-700 mx-auto"></div>
        <p className="mt-4 text-maronaut-600">Loading your profile...</p>
      </div>
    </div>;
  }

  return <>{children}</>;
};

export default FirebaseInitializer;
