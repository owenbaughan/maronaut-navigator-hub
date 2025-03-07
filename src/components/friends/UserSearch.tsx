
import React, { useState } from 'react';
import { 
  searchUsers, 
  sendFriendRequest, 
  addFriendDirectly, 
  checkFriendRequestExists, 
  checkFriendshipExists 
} from '@/services/friendService';
import { Search, UserPlus, UserCheck, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface UserSearchProps {
  onUserAdded?: () => void;
}

interface UserSearchResult {
  id: string;
  username: string;
  profilePicture: string | null;
  privacySettings?: {
    isPublicProfile: boolean;
    autoAcceptFriends: boolean;
  };
  status?: 'friend' | 'pending' | 'received' | null;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Not signed in",
        description: "You need to be signed in to search for users",
        variant: "destructive"
      });
      return;
    }
    
    if (searchQuery.trim() === '') return;
    
    setIsSearching(true);
    setShowResults(true);
    setNoResults(false);
    
    try {
      console.log(`Searching for username: "${searchQuery}" from user: ${currentUser.uid}`);
      const users = await searchUsers(searchQuery, currentUser.uid);
      console.log("Search results:", users);
      
      // Check friendship status for each user
      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          const { sentRequest, receivedRequest } = await checkFriendRequestExists(currentUser.uid, user.id);
          const isFriend = await checkFriendshipExists(currentUser.uid, user.id);
          
          let status = null;
          if (isFriend) {
            status = 'friend';
          } else if (sentRequest) {
            status = 'pending';
          } else if (receivedRequest) {
            status = 'received';
          }
          
          return {
            ...user,
            status
          };
        })
      );
      
      setSearchResults(usersWithStatus);
      setNoResults(usersWithStatus.length === 0);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "There was a problem searching for users",
        variant: "destructive"
      });
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (user: UserSearchResult) => {
    if (!currentUser) return;
    
    try {
      // Check if the user's privacy settings allow auto-accepting friends
      if (user.privacySettings?.autoAcceptFriends) {
        await addFriendDirectly(currentUser.uid, user.id);
        toast({
          title: "Friend added",
          description: `${user.username} is now your friend`,
        });
      } else {
        await sendFriendRequest(currentUser.uid, user.id);
        toast({
          title: "Friend request sent",
          description: `A friend request has been sent to ${user.username}`,
        });
      }
      
      // Update the user's status in search results
      setSearchResults(prev => 
        prev.map(result => 
          result.id === user.id 
            ? { ...result, status: 'pending' } 
            : result
        )
      );
      
      // Call the callback if provided
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Friend request failed",
        description: "There was a problem sending the friend request",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-maronaut-400" />
        </div>
        <Input
          type="text"
          className="pl-10 pr-4 py-3 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
          placeholder="Search for sailors by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 bg-maronaut-500 text-white rounded-r-lg hover:bg-maronaut-600 transition-colors"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
            <DialogDescription>
              {searchResults.length > 0 
                ? `Found ${searchResults.length} sailors matching '${searchQuery}'` 
                : `No sailors found matching '${searchQuery}'`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  
                  {/* Friendship status buttons */}
                  {user.status === 'friend' ? (
                    <div className="flex items-center text-green-600">
                      <UserCheck size={18} className="mr-1" />
                      <span className="text-sm">Friend</span>
                    </div>
                  ) : user.status === 'pending' ? (
                    <div className="flex items-center text-maronaut-500">
                      <Clock size={18} className="mr-1" />
                      <span className="text-sm">Pending</span>
                    </div>
                  ) : user.status === 'received' ? (
                    <div className="flex items-center text-maronaut-500">
                      <Clock size={18} className="mr-1" />
                      <span className="text-sm">Request Received</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      className="bg-maronaut-500 hover:bg-maronaut-600"
                      onClick={() => handleAddFriend(user)}
                    >
                      <UserPlus size={16} className="mr-1" />
                      Add Friend
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-maronaut-500">No users found. Try a different search term.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSearch;
