
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FriendProfile from '@/components/friends/FriendProfile';
import { ArrowLeft } from 'lucide-react';

interface ProfileTabProps {
  selectedUserId: string | null;
  onBackToList: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ selectedUserId, onBackToList }) => {
  return (
    selectedUserId ? (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={onBackToList} 
              className="text-maronaut-500 mr-2"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <CardTitle>User Profile</CardTitle>
          </div>
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
