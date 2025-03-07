
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  // Show loading indicator while authentication is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maronaut-700 mx-auto"></div>
          <p className="mt-4 text-maronaut-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not signed in
  if (!isSignedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is signed in, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
