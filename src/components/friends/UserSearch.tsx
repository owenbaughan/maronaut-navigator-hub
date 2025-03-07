
import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserSearchResult from './UserSearchResult';
import { 
  searchUsers, 
  sendFriendRequest, 
  getFriendshipStatus 
} from '@/services/friendService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserSearchProps {
  onFriendAdded?: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onFriendAdded }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [relationshipStatuses, setRelationshipStatuses] = useState<Record<string, any>>({});
  
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim() || !currentUser) return;
    
    try {
      setIsSearching(true);
      const results = await searchUsers(searchQuery, currentUser.uid);
      setSearchResults(results);
      
      // Get relationship status for each result
      const statuses: Record<string, any> = {};
      
      await Promise.all(
        results.map(async (result) => {
          const status = await getFriendshipStatus(currentUser.uid, result.userId);
          statuses[result.userId] = status;
        })
      );
      
      setRelationshipStatuses(statuses);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Search failed",
        description: "There was a problem searching for users.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle adding a friend
  const handleAddFriend = async (userId: string) => {
    if (!currentUser) return;
    
    try {
      await sendFriendRequest(currentUser.uid, userId);
      
      // Update the relationship status for this user
      const newStatus = await getFriendshipStatus(currentUser.uid, userId);
      
      setRelationshipStatuses({
        ...relationshipStatuses,
        [userId]: newStatus
      });
      
      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent successfully.",
      });
      
      if (onFriendAdded) {
        onFriendAdded();
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Request failed",
        description: "There was a problem sending the friend request.",
        variant: "destructive"
      });
    }
  };
  
  // Handle cancelling a friend request
  const handleCancelRequest = async (userId: string) => {
    // This would cancel a pending friend request
    // This functionality will be implemented later
    console.log("Cancel request for:", userId);
  };
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">Find Friends</h2>
      
      <form onSubmit={handleSearch} className="relative mb-4">
        <div className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-maronaut-400" />
            </div>
            <Input
              type="text"
              className="pl-10 pr-4 py-3 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="ml-2 bg-maronaut-500 text-white rounded-lg hover:bg-maronaut-600 transition-colors"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : (
              <Search size={18} className="mr-2" />
            )}
            Search
          </Button>
        </div>
      </form>
      
      {searchResults.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm text-maronaut-600">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
          </div>
          
          <div className="space-y-2">
            {searchResults.map((user) => (
              <UserSearchResult
                key={user.userId}
                user={user}
                relationshipStatus={relationshipStatuses[user.userId]?.status || 'none'}
                direction={relationshipStatuses[user.userId]?.direction}
                onAddFriend={() => handleAddFriend(user.userId)}
                onCancelRequest={() => handleCancelRequest(user.userId)}
              />
            ))}
          </div>
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-4 text-maronaut-600">
          No users found matching "{searchQuery}"
        </div>
      )}
      
      <Separator className="my-6" />
    </div>
  );
};

export default UserSearch;
