
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FriendProfile from '@/components/friends/FriendProfile';

interface ProfileTabProps {
  selectedUserId: string | null;
  onBackToList: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ selectedUserId, onBackToList }) => {
  return (
    selectedUserId ? (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <Button 
            variant="ghost" 
            onClick={onBackToList} 
            className="text-maronaut-500 mt-2"
          >
            &larr; Back
          </Button>
        </CardHeader>
        <CardContent>
          <FriendProfile
            friendId={selectedUserId}
            onBackToResults={onBackToList}
          />
        </CardContent>
      </Card>
    ) : null
  );
};

export default ProfileTab;
