
import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { toast } from '../../components/ui/use-toast';

// Mock search results
const MOCK_USERS = [
  {
    id: 201,
    name: 'Jessica Torres',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Marina del Rey, CA',
    mutualFriends: 3,
  },
  {
    id: 202,
    name: 'Robert Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Seattle, WA',
    mutualFriends: 1,
  },
  {
    id: 203,
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'San Diego, CA',
    mutualFriends: 5,
  },
  {
    id: 204,
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Portland, OR',
    mutualFriends: 0,
  },
];

const FriendSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Simulate search with mock data
    const filtered = MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered);
  };
  
  const handleAddFriend = (userId) => {
    setPendingRequests([...pendingRequests, userId]);
    
    toast({
      title: "Friend request sent",
      description: "They'll be notified of your request",
    });
  };
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
        Find Friends
      </h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-maronaut-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-4 bg-maronaut-500 text-white rounded-r-lg hover:bg-maronaut-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-maronaut-100">
              <div className="flex items-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
                <div className="ml-3">
                  <h3 className="font-semibold text-maronaut-700">{user.name}</h3>
                  <p className="text-sm text-maronaut-500">{user.location}</p>
                  {user.mutualFriends > 0 && (
                    <p className="text-xs text-maronaut-400">
                      {user.mutualFriends} mutual {user.mutualFriends === 1 ? 'friend' : 'friends'}
                    </p>
                  )}
                </div>
              </div>
              
              {pendingRequests.includes(user.id) ? (
                <button
                  className="px-3 py-1.5 border border-maronaut-200 rounded-lg text-maronaut-400 cursor-default"
                  disabled
                >
                  Requested
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 bg-maronaut-500 text-white rounded-lg flex items-center hover:bg-maronaut-600 transition-colors"
                  onClick={() => handleAddFriend(user.id)}
                >
                  <UserPlus size={16} className="mr-1" />
                  Add Friend
                </button>
              )}
            </div>
          ))}
        </div>
      ) : searchQuery !== '' ? (
        <div className="text-center py-8 text-maronaut-500">
          No users found matching "{searchQuery}"
        </div>
      ) : null}
    </div>
  );
};

export default FriendSearch;
