
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { auth } from '@/lib/firebase';

interface FirebaseInitializerProps {
  children: React.ReactNode;
}

const FirebaseInitializer: React.FC<FirebaseInitializerProps> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // If Clerk is loaded, we can initialize Firebase
    if (isLoaded) {
      // We're not actually connecting to Firebase Auth yet, just allowing the app to render
      console.log("Firebase initialization skipped - app will continue to render");
      setIsFirebaseInitialized(true);
    }
  }, [isLoaded, isSignedIn, user]);

  // Show loading state while Firebase is initializing
  if (!isFirebaseInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maronaut-700 mx-auto"></div>
        <p className="mt-4 text-maronaut-600">Initializing app...</p>
      </div>
    </div>;
  }

  return <>{children}</>;
};

export default FirebaseInitializer;
