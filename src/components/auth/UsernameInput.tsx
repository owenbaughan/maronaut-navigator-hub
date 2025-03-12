
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Check, X } from 'lucide-react';
import { isUsernameAvailable } from '@/services/profile';
import { useDebounce } from '@/utils/debounce';

interface UsernameInputProps {
  username: string;
  setUsername: (value: string) => void;
  error: string;
  setError: (error: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  username,
  setUsername,
  error,
  setError
}) => {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const checkAvailability = async () => {
      if (debouncedUsername.length < 3) {
        setAvailable(null);
        return;
      }

      if (!/^[a-zA-Z0-9]+$/.test(debouncedUsername)) {
        setAvailable(null);
        return;
      }

      try {
        setChecking(true);
        const isAvailable = await isUsernameAvailable(debouncedUsername);
        setAvailable(isAvailable);
        
        if (!isAvailable) {
          setError('This username is already taken');
        } else if (error === 'This username is already taken') {
          setError('');
        }
      } catch (err) {
        console.error("Error checking username availability:", err);
      } finally {
        setChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername, setError, error]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    if (error.includes("username") || error === 'This username is already taken') {
      setError('');
    }
    
    // Reset availability status when user is typing
    if (value !== debouncedUsername) {
      setAvailable(null);
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
          className={available === false ? "pr-10 border-red-500" : available === true ? "pr-10 border-green-500" : "pr-10"}
        />
        {checking && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        )}
        {!checking && available === true && username.length >= 3 && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
            <Check size={16} />
          </div>
        )}
        {!checking && available === false && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
            <X size={16} />
          </div>
        )}
      </div>
      {username && username.length < 3 && (
        <p className="text-xs text-amber-500">Username must be at least 3 characters</p>
      )}
      {username && !/^[a-zA-Z0-9]+$/.test(username) && (
        <p className="text-xs text-amber-500">Username can only contain letters and numbers</p>
      )}
      {available === false && username.length >= 3 && (
        <p className="text-xs text-red-500">This username is already taken</p>
      )}
      {available === true && username.length >= 3 && (
        <p className="text-xs text-green-500">Username is available</p>
      )}
    </div>
  );
};

export default UsernameInput;
