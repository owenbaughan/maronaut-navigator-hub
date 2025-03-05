
import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto glass-panel p-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-maronaut-700 mb-6 text-center">Join Maronaut</h1>
              <div className="mb-6">
                <ClerkSignUp 
                  signInUrl="/sign-in"
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
                  Already have an account? <Link to="/sign-in" className="text-maronaut-500 hover:text-maronaut-600 font-medium">Sign in</Link>
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
