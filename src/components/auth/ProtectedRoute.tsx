
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        // Save the attempted URL for redirecting after login
        const returnUrl = encodeURIComponent(location.pathname);
        toast.info("Please sign in to access this feature");
        navigate(`/sign-in?returnUrl=${returnUrl}`);
      }
      setIsChecking(false);
    }
  }, [isSignedIn, isLoaded, navigate, location]);

  if (!isLoaded || isChecking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isSignedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
