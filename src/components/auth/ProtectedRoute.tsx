
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  // Show nothing while loading
  if (!isLoaded) {
    return null;
  }

  // Redirect to sign-in if not signed in
  if (!isSignedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is signed in, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
