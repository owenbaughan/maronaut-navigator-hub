
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Check, X } from 'lucide-react';

interface UsernameInputProps {
  username: string;
  setUsername: (value: string) => void;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  error: string;
  setError: (error: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  username,
  setUsername,
  checkUsernameAvailability,
  error,
  setError
}) => {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecked, setUsernameChecked] = useState(false);

  useEffect(() => {
    const checkUsername = async () => {
      const trimmedUsername = username.trim();
      if (trimmedUsername.length >= 3 && /^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
        setIsCheckingUsername(true);
        setUsernameChecked(false);
        try {
          console.log("UsernameInput: Initiating username availability check for:", trimmedUsername);
          const isAvailable = await checkUsernameAvailability(trimmedUsername);
          console.log("UsernameInput: Username check result:", isAvailable);
          setIsUsernameAvailable(isAvailable);
          setUsernameChecked(true);
          if (error.includes("username")) {
            setError('');
          }
        } catch (error: any) {
          console.error("UsernameInput: Error checking username:", error);
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
  }, [username, checkUsernameAvailability, error, setError]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameChecked(false);
    if (error.includes("username")) {
      setError('');
    }
  };

  return (
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
  );
};

export default UsernameInput;
