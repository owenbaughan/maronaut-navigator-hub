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
import { useToast } from '@/components/ui/use-toast';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const { signUp, checkUsernameAvailability } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUsername = async () => {
      const trimmedUsername = username.trim();
      if (trimmedUsername.length >= 3 && /^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
        setIsCheckingUsername(true);
        setUsernameChecked(false);
        try {
          console.log("SignUp: Initiating username availability check for:", trimmedUsername);
          const isAvailable = await checkUsernameAvailability(trimmedUsername);
          console.log("SignUp: Username check result:", isAvailable);
          setIsUsernameAvailable(isAvailable);
          setUsernameChecked(true);
          if (error.includes("username")) {
            setError('');
          }
        } catch (error: any) {
          console.error("SignUp: Error checking username:", error);
          setError('');
          setUsernameChecked(false);
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameChecked(false);
        setIsUsernameAvailable(null);
      }
    };
    
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username, checkUsernameAvailability, error]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameChecked(false);
    if (error.includes("username")) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setError('Username can only contain letters and numbers (no spaces or special characters)');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Proceed with signup
      await signUp(username.trim().toLowerCase(), email, password);
      toast({
        title: "Account created successfully",
        description: "Welcome aboard!",
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error("SignUp: Error during signup:", err);
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
                      placeholder="Choose a username"
                      value={username}
                      onChange={handleUsernameChange}
                      required
                      minLength={3}
                      className={`${
                        usernameChecked && username.length >= 3 
                          ? isUsernameAvailable === false
                            ? "border-red-500 focus:border-red-500" 
                            : "border-green-500 focus:border-green-500" 
                          : ""
                      }`}
                    />
                    {isCheckingUsername && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-maronaut-600 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                    {!isCheckingUsername && usernameChecked && username.length >= 3 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {!isUsernameAvailable ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {username && username.length < 3 && (
                    <p className="text-xs text-amber-500">Username must be at least 3 characters</p>
                  )}
                  {username && !/^[a-zA-Z0-9]+$/.test(username) && (
                    <p className="text-xs text-amber-500">Username can only contain letters and numbers</p>
                  )}
                  {usernameChecked && username.length >= 3 && !isUsernameAvailable && (
                    <p className="text-xs text-red-500">This username is already taken</p>
                  )}
                  {usernameChecked && username.length >= 3 && isUsernameAvailable && (
                    <p className="text-xs text-green-500">Username is available</p>
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
                  disabled={isLoading || isUsernameAvailable === false}>
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
