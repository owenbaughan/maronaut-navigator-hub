
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 flex items-center justify-center">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
            <ClerkSignIn signUpUrl="/signup" routing="path" path="/signin" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
