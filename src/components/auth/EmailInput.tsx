
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => {
  return (
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
  );
};

export default EmailInput;
