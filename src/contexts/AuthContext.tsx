
import React, { createContext, useContext } from 'react';
import { useAuth as useClerkAuth, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isSignedIn: boolean;
  userId: string | null;
  requireAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, userId } = useClerkAuth();
  const navigate = useNavigate();

  const requireAuth = () => {
    if (!isSignedIn) {
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, userId, requireAuth }}>
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
  return <SignedIn>{children}</SignedIn>;
};

export const SignedOutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SignedOut>{children}</SignedOut>;
};
