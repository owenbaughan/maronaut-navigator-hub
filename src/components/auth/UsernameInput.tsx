
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { debounce } from '@/utils/debounce';

interface UsernameInputProps {
  username: string;
  setUsername: (value: string) => void;
  error: string;
  setError: (error: string) => void;
  checkAvailability: (username: string) => Promise<boolean>;
  isAvailable: boolean | null;
  setIsAvailable: (value: boolean | null) => void;
  isChecking: boolean;
  setIsChecking: (value: boolean) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  username,
  setUsername,
  error,
  setError,
  checkAvailability,
  isAvailable,
  setIsAvailable,
  isChecking,
  setIsChecking
}) => {
  // Create debounced function for checking username availability
  const debouncedCheckAvailability = useCallback(
    debounce(async (value: string) => {
      if (value.length < 3) {
        setIsAvailable(null);
        setIsChecking(false);
        return;
      }

      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        setIsAvailable(false);
        setIsChecking(false);
        return;
      }

      try {
        console.log(`[UsernameInput] Checking availability for: "${value}"`);
        const available = await checkAvailability(value.toLowerCase());
        console.log(`[UsernameInput] Availability result: ${available}`);
        setIsAvailable(available);
        if (!available) {
          console.log(`[UsernameInput] Username "${value}" is already taken`);
        }
      } catch (err) {
        console.error("[UsernameInput] Error checking username availability:", err);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    [checkAvailability, setIsAvailable, setIsChecking]
  );

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    if (value.length >= 3) {
      console.log(`[UsernameInput] Username changed to: "${value}", starting check`);
      setIsChecking(true);
      setIsAvailable(null);
    } else {
      setIsAvailable(null);
    }
    
    if (error.includes("username")) {
      setError('');
    }
  };

  // Check availability when username changes
  useEffect(() => {
    if (username.length >= 3) {
      debouncedCheckAvailability(username);
    }
  }, [username, debouncedCheckAvailability]);

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
          className={`pr-10 ${
            isAvailable === true
              ? 'border-green-500 focus-visible:ring-green-500'
              : isAvailable === false
              ? 'border-red-500 focus-visible:ring-red-500'
              : ''
          }`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isChecking ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : isAvailable === true ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : isAvailable === false ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : null}
        </div>
      </div>
      {username && username.length < 3 && (
        <p className="text-xs text-amber-500">Username must be at least 3 characters</p>
      )}
      {username && !/^[a-zA-Z0-9]+$/.test(username) && (
        <p className="text-xs text-amber-500">Username can only contain letters and numbers</p>
      )}
      {isAvailable === false && username.length >= 3 && /^[a-zA-Z0-9]+$/.test(username) && (
        <p className="text-xs text-red-500">This username is already taken</p>
      )}
      {isAvailable === true && (
        <p className="text-xs text-green-500">Username is available</p>
      )}
    </div>
  );
};

export default UsernameInput;
