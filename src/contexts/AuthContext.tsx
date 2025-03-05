
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isSignedIn: boolean | null;
  userId: string | null;
  isLoaded: boolean;
  requireAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, userId, isLoaded } = useClerkAuth();
  const navigate = useNavigate();

  // Don't wait for auth initialization on public pages
  const requireAuth = () => {
    if (isLoaded && !isSignedIn) {
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
    }
  };

  // Render children immediately - let ProtectedRoute handle protected content
  return (
    <AuthContext.Provider value={{ isSignedIn: isSignedIn || false, userId, isLoaded, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const SignedInContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }
  
  return isSignedIn ? <>{children}</> : null;
};

export const SignedOutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }
  
  return !isSignedIn ? <>{children}</> : null;
};
