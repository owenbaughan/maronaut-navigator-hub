
import React from 'react';
import { UserPlus, UserCheck, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProfilePicture from '../profile/ProfilePicture';
import { useNavigate } from 'react-router-dom';

interface UserSearchResultProps {
  user: any;
  relationshipStatus: 'none' | 'pending' | 'accepted';
  direction?: 'sent' | 'received';
  onAddFriend: () => void;
  onCancelRequest?: () => void;
}

const UserSearchResult: React.FC<UserSearchResultProps> = ({ 
  user, 
  relationshipStatus, 
  direction,
  onAddFriend,
  onCancelRequest
}) => {
  const navigate = useNavigate();
  
  // View user profile
  const handleViewProfile = () => {
    // This would navigate to the user's profile page
    console.log("View profile for:", user.username);
    // Implementation will be added later
  };
  
  return (
    <Card className="p-4 flex items-center justify-between mb-2 bg-white">
      <div className="flex items-center gap-3">
        <ProfilePicture 
          url={user.profilePicture} 
          username={user.username} 
          size="sm" 
        />
        <div>
          <h3 className="font-medium">{user.username}</h3>
          {user.location && <p className="text-sm text-muted-foreground">{user.location}</p>}
        </div>
      </div>
      
      <div className="flex gap-2">
        {relationshipStatus === 'none' && (
          <Button 
            size="sm" 
            onClick={onAddFriend}
            className="bg-maronaut-500 hover:bg-maronaut-600"
          >
            <UserPlus size={16} className="mr-1" />
            Add Friend
          </Button>
        )}
        
        {relationshipStatus === 'pending' && direction === 'sent' && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={onCancelRequest}
          >
            <Clock size={16} className="mr-1" />
            Request Sent
          </Button>
        )}
        
        {relationshipStatus === 'pending' && direction === 'received' && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewProfile}
          >
            <Clock size={16} className="mr-1" />
            Respond to Request
          </Button>
        )}
        
        {relationshipStatus === 'accepted' && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewProfile}
          >
            <UserCheck size={16} className="mr-1" />
            Friends
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UserSearchResult;
