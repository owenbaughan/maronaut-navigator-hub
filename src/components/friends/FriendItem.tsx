
import React from 'react';
import { UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProfilePicture from '../profile/ProfilePicture';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FriendItemProps {
  friend: any;
  requestId: string;
  onRemoveFriend: (requestId: string) => Promise<void>;
}

const FriendItem: React.FC<FriendItemProps> = ({ 
  friend, 
  requestId,
  onRemoveFriend
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRemoveFriend = async () => {
    try {
      await onRemoveFriend(requestId);
      toast({
        title: `Removed ${friend.username} from friends`,
      });
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend",
        variant: "destructive"
      });
    }
  };
  
  const handleViewProfile = () => {
    // This would navigate to the user's profile page
    console.log("View profile for:", friend.username);
    // Implementation will be added later
  };
  
  return (
    <Card className="p-4 flex items-center justify-between mb-2 bg-white">
      <div className="flex items-center gap-3">
        <ProfilePicture 
          url={friend.profilePicture} 
          username={friend.username} 
          size="sm" 
        />
        <div>
          <h3 className="font-medium">{friend.username}</h3>
          {friend.location && <p className="text-sm text-muted-foreground">{friend.location}</p>}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          className="bg-maronaut-500 hover:bg-maronaut-600"
          onClick={handleViewProfile}
        >
          <UserCheck size={16} className="mr-1" />
          View Profile
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleRemoveFriend}
        >
          <UserX size={16} className="mr-1" />
          Remove
        </Button>
      </div>
    </Card>
  );
};

export default FriendItem;
