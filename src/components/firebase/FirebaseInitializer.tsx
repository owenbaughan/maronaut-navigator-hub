
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface FirebaseInitializerProps {
  children: React.ReactNode;
}

const FirebaseInitializer: React.FC<FirebaseInitializerProps> = ({ children }) => {
  const { isLoaded } = useAuth();
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // If Auth is loaded, we can initialize Firebase
    if (isLoaded) {
      console.log("Firebase initialization complete - app will continue to render");
      setIsFirebaseInitialized(true);
    }
  }, [isLoaded]);

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
