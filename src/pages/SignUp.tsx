
import React, { useEffect } from 'react';
import { SignUp as ClerkSignUp, useAuth } from '@clerk/clerk-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const SignUp = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl');

  useEffect(() => {
    if (isSignedIn && returnUrl) {
      navigate(decodeURIComponent(returnUrl));
    } else if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate, returnUrl]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto glass-panel p-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-maronaut-700 mb-6 text-center">Create an Account</h1>
              <div className="mb-6">
                <ClerkSignUp 
                  signInUrl={returnUrl ? `/sign-in?returnUrl=${returnUrl}` : "/sign-in"}
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
                  Already have an account? <Link to={returnUrl ? `/sign-in?returnUrl=${returnUrl}` : "/sign-in"} className="text-maronaut-500 hover:text-maronaut-600 font-medium">Sign in</Link>
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

export default SignUp;
