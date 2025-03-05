
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '@clerk/clerk-react';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  
  // Get redirect path from URL query params
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  // If user is already signed in, redirect them (but only after Clerk has loaded)
  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate(redirectPath, { replace: true });
    }
  }, [isSignedIn, isLoaded, navigate, redirectPath]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto glass-panel p-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-maronaut-700 mb-6 text-center">Welcome Back</h1>
              <div className="mb-6">
                <ClerkSignIn 
                  signUpUrl={`/sign-up${location.search}`}
                  redirectUrl={redirectPath}
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none",
                      formButtonPrimary: "bg-maronaut-500 hover:bg-maronaut-600",
                      footerActionLink: "text-maronaut-500 hover:text-maronaut-600"
                    }
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-maronaut-600">
                  Don't have an account? <Link to={`/sign-up${location.search}`} className="text-maronaut-500 hover:text-maronaut-600 font-medium">Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
