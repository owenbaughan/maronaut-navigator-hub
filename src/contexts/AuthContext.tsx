
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Define the shape of our auth context
interface AuthContextType {
  isSignedIn: boolean;
  userId: string | null;
  isLoaded: boolean;
  requireAuth: () => void;
}

// Create the context with default values that won't cause flashing
const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  userId: null,
  isLoaded: false,
  requireAuth: () => {}
});

// AuthProvider component that will wrap our app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, userId, isLoaded } = useClerkAuth();
  const navigate = useNavigate();

  // Function to redirect to login when needed
  const requireAuth = () => {
    if (isLoaded && !isSignedIn) {
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
    }
  };

  // Create the context value
  const contextValue = {
    isSignedIn: !!isSignedIn, // Convert to boolean to avoid null
    userId, 
    isLoaded, 
    requireAuth
  };

  // Always render children, even before Clerk is loaded
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Component that only renders its children when user is signed in
export const SignedInContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }
  
  return isSignedIn ? <>{children}</> : null;
};

// Component that only renders its children when user is signed out
export const SignedOutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }
  
  return !isSignedIn ? <>{children}</> : null;
};
