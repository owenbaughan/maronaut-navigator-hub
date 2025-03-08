
import React, { useEffect, useState } from 'react';
import { FollowRequest } from '@/services/types';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { acceptFollowRequest, rejectFollowRequest } from '@/services/friendService';
import { useToast } from '@/components/ui/use-toast';

interface FollowRequestsListProps {
  requests: FollowRequest[];
  onRequestAction: () => void;
}

const FollowRequestsList: React.FC<FollowRequestsListProps> = ({ 
  requests, 
  onRequestAction 
}) => {
  const { toast } = useToast();
  const [processingRequestIds, setProcessingRequestIds] = useState<string[]>([]);

  if (requests.length === 0) {
    return null;
  }

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequestIds(prev => [...prev, requestId]);
    try {
      const success = await acceptFollowRequest(requestId);
      if (success) {
        toast({
          title: "Request accepted",
          description: "You are now being followed by this user"
        });
        onRequestAction();
      } else {
        toast({
          title: "Error accepting request",
          description: "There was a problem accepting this follow request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error accepting follow request:", error);
      toast({
        title: "Error accepting request",
        description: "There was a problem accepting this follow request",
        variant: "destructive"
      });
    } finally {
      setProcessingRequestIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequestIds(prev => [...prev, requestId]);
    try {
      const success = await rejectFollowRequest(requestId);
      if (success) {
        toast({
          title: "Request rejected",
          description: "The follow request has been rejected"
        });
        onRequestAction();
      } else {
        toast({
          title: "Error rejecting request",
          description: "There was a problem rejecting this follow request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error rejecting follow request:", error);
      toast({
        title: "Error rejecting request",
        description: "There was a problem rejecting this follow request",
        variant: "destructive"
      });
    } finally {
      setProcessingRequestIds(prev => prev.filter(id => id !== requestId));
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold text-maronaut-700 mb-2">Follow Requests</h3>
      {requests.map(request => (
        <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 bg-maronaut-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
              {request.senderUsername?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium">{request.senderUsername}</p>
              <div className="flex items-center text-sm text-maronaut-500">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Requested to follow you</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => handleAcceptRequest(request.id)}
              disabled={processingRequestIds.includes(request.id)}
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => handleRejectRequest(request.id)}
              disabled={processingRequestIds.includes(request.id)}
            >
              <UserX className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowRequestsList;
