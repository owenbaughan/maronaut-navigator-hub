import React, { useState } from 'react';
import { 
  searchUsers, 
  followUser, 
  checkFollowingStatus, 
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
    autoAcceptFollows?: boolean;
    autoAcceptFriends?: boolean;
  };
  status?: 'following' | 'requested' | null;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
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
      console.log(`Searching for username: "${searchQuery}" from user ID: ${currentUser.uid}`);
      
      const users = await searchUsers(searchQuery, currentUser.uid);
      console.log("Search results returned:", users.length, "users");
      
      if (users.length === 0) {
        setNoResults(true);
        setSearchResults([]);
        toast({
          title: "No users found",
          description: `No sailors matching '${searchQuery}' were found.`,
          variant: "default"
        });
        return;
      }
      
      // Check following status for each user
      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          console.log("Checking following status for user:", user.username);
          const isFollowing = await checkFollowingStatus(currentUser.uid, user.id);
          
          let status = null;
          if (isFollowing) {
            status = 'following';
          }
          
          return {
            ...user,
            status
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

  const handleFollowUser = async (user: UserSearchResult) => {
    if (!currentUser) return;
    
    try {
      setIsFollowingUser(true);
      setProcessingUserId(user.id);
      
      console.log(`Starting follow process for user ${user.username} (${user.id})`);
      
      // Double-check if already following first
      const alreadyFollowing = await checkFollowingStatus(currentUser.uid, user.id);
      if (alreadyFollowing) {
        console.log("Already following this user, updating UI only");
        toast({
          title: "Already following",
          description: `You are already following ${user.username}`,
        });
        
        // Update the user's status in search results to 'following'
        setSearchResults(prev => 
          prev.map(result => 
            result.id === user.id 
              ? { ...result, status: 'following' } 
              : result
          )
        );
        
        if (onUserAdded) {
          onUserAdded();
        }
        
        return;
      }
      
      // Get target user's auto-accept setting
      const targetProfile = await getUserProfile(user.id);
      
      // Important: Check BOTH settings for backward compatibility
      // If either is missing or false, default to true for auto-accept
      const autoAcceptFollows = targetProfile?.privacySettings?.autoAcceptFollows;
      const autoAcceptFriends = targetProfile?.privacySettings?.autoAcceptFriends;
      
      // If either setting is explicitly set to false, don't auto-accept
      // Otherwise default to auto-accepting (both undefined or null = auto-accept)
      const autoAccept = !(autoAcceptFollows === false || autoAcceptFriends === false);
      
      console.log("Auto accept setting:", autoAccept, "from:", targetProfile?.privacySettings);
      console.log("autoAcceptFollows:", autoAcceptFollows, "autoAcceptFriends:", autoAcceptFriends);
      
      // Follow user
      console.log(`Following user: ${currentUser.uid} -> ${user.id}`);
      const success = await followUser(currentUser.uid, user.id);
      console.log("Follow result:", success);
      
      if (success) {
        if (autoAccept) {
          toast({
            title: "Now following",
            description: `You are now following ${user.username}`,
          });
          
          // Update the user's status in search results to 'following'
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'following' } 
                : result
            )
          );
        } else {
          toast({
            title: "Follow request sent",
            description: `A follow request has been sent to ${user.username}`,
          });
          
          // Update the user's status in search results to 'requested'
          setSearchResults(prev => 
            prev.map(result => 
              result.id === user.id 
                ? { ...result, status: 'requested' } 
                : result
            )
          );
        }
        
        // Call the callback if provided to refresh the following list
        if (onUserAdded) {
          console.log("Calling onUserAdded callback to refresh following list");
          onUserAdded();
        }
      } else {
        toast({
          title: "Failed to follow",
          description: "There was a problem following this user",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        title: "Failed to follow",
        description: "There was a problem following this user",
        variant: "destructive"
      });
    } finally {
      setIsFollowingUser(false);
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
                  
                  {/* Following status buttons */}
                  {user.status === 'following' ? (
                    <div className="flex items-center text-green-600">
                      <UserCheck size={18} className="mr-1" />
                      <span className="text-sm">Following</span>
                    </div>
                  ) : user.status === 'requested' ? (
                    <div className="flex items-center text-amber-600">
                      <Clock size={18} className="mr-1" />
                      <span className="text-sm">Requested</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      className="bg-maronaut-500 hover:bg-maronaut-600"
                      onClick={() => handleFollowUser(user)}
                      disabled={isFollowingUser && processingUserId === user.id}
                    >
                      <UserPlus size={16} className="mr-1" />
                      {isFollowingUser && processingUserId === user.id ? 'Following...' : 'Follow'}
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
