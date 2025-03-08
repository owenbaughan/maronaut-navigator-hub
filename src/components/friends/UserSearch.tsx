
import React, { useState } from 'react';
import { 
  searchUsers, 
  sendFriendRequest, 
  addFriendDirectly, 
  checkFriendRequestExists, 
  checkFriendshipExists 
} from '@/services/friendService';
import { Search, UserPlus, UserCheck, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/services/profileService';

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
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
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
      console.log(`Searching for username: "${searchQuery}" from user ID: ${currentUser.uid}, displayName: ${currentUser.displayName || 'No display name'}`);
      
      // Special debug for gracejeanne user
      if (searchQuery.toLowerCase().includes('grace')) {
        console.log("🔎 SEARCHING FOR GRACE: Looking for a username containing 'grace'");
      }
      
      const users = await searchUsers(searchQuery, currentUser.uid);
      console.log("Search results returned:", users.length, "users");
      console.log("Raw search results:", JSON.stringify(users));
      
      if (users.length === 0) {
        console.log("⚠️ No results found for query:", searchQuery);
        setNoResults(true);
        setSearchResults([]);
        toast({
          title: "No users found",
          description: `No sailors matching '${searchQuery}' were found.`,
          variant: "default"
        });
        return;
      }
      
      // Check friendship status for each user and get complete profile data
      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          console.log("Checking friendship status for user:", user.username);
          const { sentRequest, receivedRequest } = await checkFriendRequestExists(currentUser.uid, user.id);
          const isFriend = await checkFriendshipExists(currentUser.uid, user.id);
          
          // Get complete profile to ensure we have privacy settings
          const fullProfile = await getUserProfile(user.id);
          console.log("Full profile for user:", user.username, fullProfile);
          
          let status = null;
          if (isFriend) {
            status = 'friend';
          } else if (sentRequest) {
            status = 'pending';
          } else if (receivedRequest) {
            status = 'received';
          }
          
          // Merge the privacy settings from the full profile
          const privacySettings = fullProfile?.privacySettings || {
            isPublicProfile: true,
            autoAcceptFriends: true, // Default to true if not specified
            showEmail: false,
            showLocation: true,
            showBoatDetails: true
          };
          
          console.log("Status and privacy determined for", user.username, ":", 
            { status, privacySettings });
          
          return {
            ...user,
            status,
            privacySettings
          };
        })
      );
      
      setSearchResults(usersWithStatus);
      setNoResults(usersWithStatus.length === 0);
      
      if (usersWithStatus.length === 0) {
        console.log("No users with status found");
        toast({
          title: "No users found",
          description: `No sailors matching '${searchQuery}' were found.`,
          variant: "default"
        });
      } else {
        console.log("✅ Found users:", usersWithStatus.length);
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      toast({
        title: "Search failed",
        description: "There was a problem searching for users",
        variant: "destructive"
      });
      setNoResults(true);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (user: UserSearchResult) => {
    if (!currentUser) return;
    
    try {
      setIsAddingFriend(true);
      setProcessingUserId(user.id);
      
      console.log(`Starting friend addition process for user ${user.username} (${user.id})`);
      console.log("User privacy settings:", user.privacySettings);
      
      // Double-check privacy settings by getting the latest profile data
      const latestProfile = await getUserProfile(user.id);
      console.log("Latest profile data for privacy check:", latestProfile);
      
      const autoAccept = latestProfile?.privacySettings?.autoAcceptFriends ?? true;
      console.log("Auto accept setting from latest profile:", autoAccept);
      
      // Check if the user's privacy settings allow auto-accepting friends
      if (autoAccept) {
        console.log("Auto-accept is enabled, adding friend directly");
        
        // Check if already friends first
        const alreadyFriends = await checkFriendshipExists(currentUser.uid, user.id);
        if (alreadyFriends) {
          console.log("Already friends, updating UI only");
          toast({
            title: "Already friends",
            description: `You are already friends with ${user.username}`,
          });
          
          // Update the user's status in search results to 'friend'
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'friend' } 
                : result
            )
          );
          
          return;
        }
        
        // Add friend directly
        const success = await addFriendDirectly(currentUser.uid, user.id);
        console.log("Friend addition result:", success);
        
        // Verify that the friendship was created successfully
        const friendshipCreated = await checkFriendshipExists(currentUser.uid, user.id);
        console.log("Friendship created confirmation:", friendshipCreated);
        
        if (friendshipCreated) {
          toast({
            title: "Friend added",
            description: `${user.username} is now your friend`,
          });
          
          // Update the user's status in search results to 'friend'
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'friend' } 
                : result
            )
          );
          
          // Call the callback if provided to refresh the friends list
          if (onUserAdded) {
            console.log("Calling onUserAdded callback to refresh friends list");
            onUserAdded();
          }
        } else {
          console.error("Friendship verification failed after addition");
          throw new Error("Failed to create friendship");
        }
      } else {
        console.log("Auto-accept is disabled, sending friend request");
        await sendFriendRequest(currentUser.uid, user.id);
        toast({
          title: "Friend request sent",
          description: `A friend request has been sent to ${user.username}`,
        });
        
        // Update the user's status in search results to 'pending'
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
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Friend request failed",
        description: "There was a problem sending the friend request",
        variant: "destructive"
      });
    } finally {
      setIsAddingFriend(false);
      setProcessingUserId(null);
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
                      disabled={isAddingFriend && processingUserId === user.id}
                    >
                      <UserPlus size={16} className="mr-1" />
                      {isAddingFriend && processingUserId === user.id ? 'Adding...' : 'Add Friend'}
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
