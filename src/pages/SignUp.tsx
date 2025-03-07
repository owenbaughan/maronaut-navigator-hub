
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, AlertCircle, User, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const { signUp, checkUsername } = useAuth();
  const navigate = useNavigate();

  // Clear validation state when username changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    // Reset validation when input changes
    if (isUsernameValid !== null) {
      setIsUsernameValid(null);
    }
  };

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.trim().length < 3) {
      setIsUsernameValid(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const trimmedUsername = username.trim().toLowerCase();
        const isAvailable = await checkUsername(trimmedUsername);
        console.log(`Username check result for ${trimmedUsername}: ${isAvailable}`);
        setIsUsernameValid(isAvailable);
      } catch (error) {
        console.error("Error checking username:", error);
        setIsUsernameValid(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate username
    if (!isUsernameValid) {
      setError(username.trim().length < 3 ? 'Username must be at least 3 characters' : 'Username already taken');
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      await signUp(username.trim().toLowerCase(), email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

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
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User size={16} />
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={handleUsernameChange}
                      className={`pr-10 ${
                        isUsernameValid === true ? 'border-green-500' : 
                        isUsernameValid === false ? 'border-red-500' : ''
                      }`}
                      required
                      minLength={3}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      {isCheckingUsername && (
                        <span className="animate-spin">
                          <User size={16} className="text-gray-400" />
                        </span>
                      )}
                      {!isCheckingUsername && isUsernameValid === true && (
                        <Check size={16} className="text-green-500" />
                      )}
                      {!isCheckingUsername && isUsernameValid === false && (
                        <X size={16} className="text-red-500" />
                      )}
                    </div>
                  </div>
                  {username && username.length < 3 && (
                    <p className="text-xs text-amber-500">Username must be at least 3 characters</p>
                  )}
                  {isUsernameValid === false && username.length >= 3 && (
                    <p className="text-xs text-red-500">Username already taken</p>
                  )}
                  {isUsernameValid === true && (
                    <p className="text-xs text-green-500">Username available</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock size={16} />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock size={16} />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || isCheckingUsername || !isUsernameValid}>
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
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
