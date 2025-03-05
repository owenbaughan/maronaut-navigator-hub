
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only redirect after Clerk has loaded
    if (isLoaded) {
      if (!isSignedIn) {
        // Redirect to sign-in page with the return URL
        navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      }
      setIsChecking(false);
    }
  }, [isSignedIn, isLoaded, navigate, location.pathname]);

  // Show loading state while Clerk is loading or we're checking auth
  if (!isLoaded || isChecking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Only render children when authenticated
  return isSignedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
