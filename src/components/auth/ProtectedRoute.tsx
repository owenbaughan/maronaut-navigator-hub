
import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if Clerk has loaded AND user is not signed in
    if (isLoaded && !isSignedIn) {
      // Redirect to sign-in page with the return URL
      navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [isSignedIn, isLoaded, navigate, location.pathname]);

  // Show loading state only while Clerk is loading
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If isLoaded is true and isSignedIn is null or false, we'll redirect in the useEffect
  // If isLoaded is true and isSignedIn is true, we can render the children
  return isSignedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
