
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMinus } from 'lucide-react';
import { FollowingData } from '@/services/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FollowingListProps {
  following: FollowingData[];
  isLoading: boolean;
  onViewProfile: (userId: string) => void;
  onUnfollow: (userId: string) => void;
}

const FollowingList: React.FC<FollowingListProps> = ({
  following,
  isLoading,
  onViewProfile,
  onUnfollow
}) => {
  const formatDisplayName = (user: FollowingData) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maronaut-700 mx-auto"></div>
        <p className="mt-4 text-maronaut-600">Loading following...</p>
      </div>
    );
  }

  if (following.length === 0) {
    return (
      <div className="text-center p-6 text-maronaut-500">
        You're not following anyone yet. Search for sailors to connect with!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {following.map(user => (
        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
              {user.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium">{user.username}</p>
              {formatDisplayName(user) && (
                <p className="text-sm text-maronaut-600">{formatDisplayName(user)}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewProfile(user.followingId)}
            >
              View Profile
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <UserMinus className="h-4 w-4 mr-1" />
                  Unfollow
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unfollow User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to unfollow {user.username}? 
                    {formatDisplayName(user) && ` (${formatDisplayName(user)})`}
                    You'll no longer see their trips in your feed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => onUnfollow(user.followingId)}
                  >
                    Unfollow
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingList;
