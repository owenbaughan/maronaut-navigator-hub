
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const SignOutButton: React.FC = () => {
  const { logout } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await logout();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <Button 
      variant="ghost"
      className="w-full p-3 text-center flex items-center justify-center text-red-500 hover:text-red-600 font-medium glass-panel animate-fade-in animate-delay-5"
      onClick={handleSignOut}
    >
      <LogOut size={18} className="mr-2" />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
