
import React, { useState } from 'react';
import { FollowRequest } from '@/services/types';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { acceptFollowRequest, rejectFollowRequest } from '@/services/requestService';
import { toast } from "sonner";

interface FollowRequestsListProps {
  requests: FollowRequest[];
  onRequestAction: () => void;
}

const FollowRequestsList: React.FC<FollowRequestsListProps> = ({ 
  requests, 
  onRequestAction 
}) => {
  const [processingRequestIds, setProcessingRequestIds] = useState<string[]>([]);

  if (requests.length === 0) {
    return null;
  }

  const formatDisplayName = (request: FollowRequest) => {
    if (request.senderFirstName && request.senderLastName) {
      return `${request.senderFirstName} ${request.senderLastName}`;
    } else if (request.senderFirstName) {
      return request.senderFirstName;
    } else if (request.senderLastName) {
      return request.senderLastName;
    }
    return null;
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setProcessingRequestIds(prev => [...prev, requestId]);
      console.log("Accepting follow request with ID:", requestId);
      
      const success = await acceptFollowRequest(requestId);
      console.log("Accept follow request result:", success);
      
      if (success) {
        toast.success("Follow request accepted");
        onRequestAction();
      } else {
        toast.error("Failed to accept follow request");
      }
    } catch (error) {
      console.error("Error accepting follow request:", error);
      toast.error("Error accepting follow request");
    } finally {
      setProcessingRequestIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setProcessingRequestIds(prev => [...prev, requestId]);
      
      const success = await rejectFollowRequest(requestId);
      if (success) {
        toast.success("Follow request declined");
        onRequestAction();
      } else {
        toast.error("Failed to decline follow request");
      }
    } catch (error) {
      console.error("Error rejecting follow request:", error);
      toast.error("Error declining follow request");
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
              {formatDisplayName(request) && (
                <p className="text-sm text-maronaut-600">{formatDisplayName(request)}</p>
              )}
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
