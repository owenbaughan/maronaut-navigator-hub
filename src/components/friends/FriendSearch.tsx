import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { toast } from '../../components/ui/use-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const FriendSearch = () => {
  const { user, isSignedIn } = useUser();
  const { users } = useClerk();
  const [searchType, setSearchType] = useState('email'); // 'email' or 'username'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const clerkUsers = await users.getUserList();
      
      const query = searchQuery.toLowerCase();
      const filtered = clerkUsers
        .filter(clerkUser => {
          if (clerkUser.id === user.id) return false;
          
          switch(searchType) {
            case 'email':
              const userEmail = clerkUser.primaryEmailAddress?.emailAddress || 
                               (clerkUser.emailAddresses && clerkUser.emailAddresses[0]?.emailAddress);
              return userEmail?.toLowerCase().includes(query);
            case 'username':
              return clerkUser.username?.toLowerCase().includes(query);
            default:
              return false;
          }
        })
        .map(clerkUser => ({
          id: clerkUser.id,
          username: clerkUser.username || 'No username',
          email: clerkUser.primaryEmailAddress?.emailAddress || 'No email',
          avatar: clerkUser.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          location: 'Location not available',
          mutualFriends: 0
        }));
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching for users:', error);
      toast({
        title: "Search error",
        description: "There was an error searching for users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleAddFriend = (userId) => {
    setPendingRequests([...pendingRequests, userId]);
    
    toast({
      title: "Friend request sent",
      description: "They'll be notified of your request",
    });
  };
  
  if (!isSignedIn) {
    return (
      <div className="glass-panel p-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
          Sign In to Find Friends
        </h2>
        <p className="text-maronaut-600">
          You need to be signed in to search for and add friends. Please sign in to continue.
        </p>
      </div>
    );
  }
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
        Find Friends
      </h2>
      
      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant={searchType === 'email' ? 'default' : 'outline'}
              className="text-sm flex-1"
              onClick={() => setSearchType('email')}
            >
              Email
            </Button>
            <Button 
              type="button" 
              variant={searchType === 'username' ? 'default' : 'outline'}
              className="text-sm flex-1"
              onClick={() => setSearchType('username')}
            >
              Username
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-maronaut-400" />
          </div>
          <Input
            type="text"
            className="pl-10 pr-4 py-3 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
            placeholder={`Search by ${searchType}...`}
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
        </div>
      </form>
      
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-maronaut-100">
              <div className="flex items-center">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
                <div className="ml-3">
                  <h3 className="font-semibold text-maronaut-700">@{user.username}</h3>
                  <p className="text-sm text-maronaut-500">{user.email}</p>
                  <p className="text-sm text-maronaut-500">{user.location}</p>
                  {user.mutualFriends > 0 && (
                    <p className="text-xs text-maronaut-400">
                      {user.mutualFriends} mutual {user.mutualFriends === 1 ? 'friend' : 'friends'}
                    </p>
                  )}
                </div>
              </div>
              
              {pendingRequests.includes(user.id) ? (
                <Button
                  className="px-3 py-1.5"
                  variant="outline"
                  disabled
                >
                  Requested
                </Button>
              ) : (
                <Button
                  className="px-3 py-1.5"
                  onClick={() => handleAddFriend(user.id)}
                >
                  <UserPlus size={16} className="mr-1" />
                  Add Friend
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : searchQuery !== '' && !isSearching ? (
        <div className="text-center py-8 text-maronaut-500">
          No users found matching "{searchQuery}"
        </div>
      ) : null}
    </div>
  );
};

export default FriendSearch;
