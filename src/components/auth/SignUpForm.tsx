
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import UsernameInput from './UsernameInput';
import EmailInput from './EmailInput';
import PasswordFields from './PasswordFields';

interface SignUpFormProps {
  signUp: (username: string, email: string, password: string) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ signUp, checkUsernameAvailability }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log("[SignUpForm] Form submission started");
    
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
      
      // Check username availability one more time before signup
      console.log("[SignUpForm] Checking username availability before signup");
      const normalizedUsername = username.trim().toLowerCase();
      const isAvailable = await checkUsernameAvailability(normalizedUsername);
      console.log(`[SignUpForm] Username "${normalizedUsername}" availability: ${isAvailable}`);
      
      if (!isAvailable) {
        setError('This username is already taken. Please choose another one.');
        setUsernameAvailable(false);
        setIsLoading(false);
        return;
      }
      
      // Proceed with signup
      console.log("[SignUpForm] Username is available, proceeding with signup");
      await signUp(normalizedUsername, email, password);
      toast({
        title: "Account created successfully",
        description: "Welcome aboard!",
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error("[SignUpForm] Error during signup:", err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <UsernameInput 
        username={username}
        setUsername={setUsername}
        error={error}
        setError={setError}
        checkAvailability={checkUsernameAvailability}
        isAvailable={usernameAvailable}
        setIsAvailable={setUsernameAvailable}
        isChecking={isCheckingUsername}
        setIsChecking={setIsCheckingUsername}
      />
      
      <EmailInput 
        email={email}
        setEmail={setEmail}
      />
      
      <PasswordFields
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || isCheckingUsername || usernameAvailable === false}
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignUpForm;
