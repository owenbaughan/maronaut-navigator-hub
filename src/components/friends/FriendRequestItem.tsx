
import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProfilePicture from '../profile/ProfilePicture';
import { useNavigate } from 'react-router-dom';
import { updateFriendRequestStatus } from '@/services/friendService';
import { useToast } from '@/hooks/use-toast';

interface FriendRequestItemProps {
  request: {
    id: string;
    status: string;
  };
  user: any; // User data (sender or receiver)
  direction: 'sent' | 'received';
  onStatusUpdate: () => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({ 
  request, 
  user, 
  direction,
  onStatusUpdate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAccept = async () => {
    try {
      await updateFriendRequestStatus(request.id, 'accepted');
      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${user.username}`,
      });
      onStatusUpdate();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive"
      });
    }
  };
  
  const handleDecline = async () => {
    try {
      await updateFriendRequestStatus(request.id, 'declined');
      toast({
        title: "Friend request declined",
      });
      onStatusUpdate();
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast({
        title: "Error",
        description: "Failed to decline friend request",
        variant: "destructive"
      });
    }
  };
  
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
        {direction === 'received' && request.status === 'pending' && (
          <>
            <Button 
              size="sm" 
              className="bg-maronaut-500 hover:bg-maronaut-600"
              onClick={handleAccept}
            >
              <UserCheck size={16} className="mr-1" />
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleDecline}
            >
              <UserX size={16} className="mr-1" />
              Decline
            </Button>
          </>
        )}
        
        {direction === 'sent' && request.status === 'pending' && (
          <Button 
            size="sm" 
            variant="outline"
            disabled
          >
            <Clock size={16} className="mr-1" />
            Pending
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FriendRequestItem;
