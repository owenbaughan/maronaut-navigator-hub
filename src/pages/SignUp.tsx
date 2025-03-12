
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp = () => {
  const { signUp, checkUsernameAvailability } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 flex items-center justify-center">
        <div className="container mx-auto px-4 py-10">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Sign up to join the Maronaut community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpForm 
                signUp={signUp}
                checkUsernameAvailability={checkUsernameAvailability}
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link to="/signin" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
