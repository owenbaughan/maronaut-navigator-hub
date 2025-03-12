
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

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
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
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
        />
      </div>
      {username && username.length < 3 && (
        <p className="text-xs text-amber-500">Username must be at least 3 characters</p>
      )}
      {username && !/^[a-zA-Z0-9]+$/.test(username) && (
        <p className="text-xs text-amber-500">Username can only contain letters and numbers</p>
      )}
    </div>
  );
};

export default UsernameInput;
