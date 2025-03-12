
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

interface PasswordFieldsProps {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
}) => {
  return (
    <>
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
    </>
  );
};

export default PasswordFields;
