
import React, { useState } from 'react';
import { Users, User, UserX, MessageSquare, Ship } from 'lucide-react';
import { toast } from '../../components/ui/use-toast';

// Mock data for friends list
const MOCK_FRIENDS = [
  {
    id: 301,
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'San Francisco, CA',
    lastActive: 'Online now',
    stats: {
      trips: 42,
      distance: 867,
    },
  },
  {
    id: 302,
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Los Angeles, CA',
    lastActive: '2 hours ago',
    stats: {
      trips: 23,
      distance: 437,
    },
  },
  {
    id: 303,
    name: 'Olivia Thompson',
    avatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'San Diego, CA',
    lastActive: '3 days ago',
    stats: {
      trips: 16,
      distance: 215,
    },
  },
];

// Mock data for friend requests
const MOCK_REQUESTS = [
  {
    id: 401,
    name: 'Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Vancouver, BC',
    mutualFriends: 2,
  },
  {
    id: 402,
    name: 'Sophia Martinez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Miami, FL',
    mutualFriends: 0,
  },
];

const FriendsList = () => {
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [friendRequests, setFriendRequests] = useState(MOCK_REQUESTS);
  
  const handleAcceptRequest = (requestId) => {
    const request = friendRequests.find(req => req.id === requestId);
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    
    if (request) {
      // Convert request to friend with mock stats
      const newFriend = {
        ...request,
        lastActive: 'Just now',
        stats: {
          trips: Math.floor(Math.random() * 20),
          distance: Math.floor(Math.random() * 300),
        },
      };
      
      setFriends([...friends, newFriend]);
      
      toast({
        title: "Friend request accepted",
        description: `${request.name} has been added to your friends`,
      });
    }
  };
  
  const handleRejectRequest = (requestId) => {
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    
    toast({
      title: "Friend request declined",
    });
  };
  
  const handleRemoveFriend = (friendId) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
    
    toast({
      title: "Friend removed",
      description: "They will no longer see your private trips",
    });
  };
  
  return (
    <div className="space-y-8">
      {/* Friend requests section */}
      {friendRequests.length > 0 && (
        <div className="glass-panel p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-maronaut-700 flex items-center mb-4">
            <User size={20} className="mr-2" />
            Friend Requests ({friendRequests.length})
          </h2>
          
          <div className="space-y-4">
            {friendRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-maronaut-100">
                <div className="flex items-center">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div className="ml-3">
                    <h3 className="font-semibold text-maronaut-700">{request.name}</h3>
                    <p className="text-sm text-maronaut-500">{request.location}</p>
                    {request.mutualFriends > 0 && (
                      <p className="text-xs text-maronaut-400">
                        {request.mutualFriends} mutual {request.mutualFriends === 1 ? 'friend' : 'friends'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1.5 bg-maronaut-500 text-white rounded-lg hover:bg-maronaut-600 transition-colors"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1.5 border border-maronaut-200 text-maronaut-600 rounded-lg hover:bg-maronaut-50 transition-colors"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Friends list section */}
      <div className="glass-panel p-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-maronaut-700 flex items-center mb-4">
          <Users size={20} className="mr-2" />
          My Friends ({friends.length})
        </h2>
        
        {friends.length > 0 ? (
          <div className="space-y-4">
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-maronaut-100">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      friend.lastActive === 'Online now' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-maronaut-700">{friend.name}</h3>
                    <p className="text-sm text-maronaut-500">{friend.location}</p>
                    <p className="text-xs text-maronaut-400">{friend.lastActive}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="flex items-center justify-end text-maronaut-600">
                      <Ship size={16} className="mr-1" />
                      <span>{friend.stats.trips} trips</span>
                    </div>
                    <div className="text-sm text-maronaut-500">
                      {friend.stats.distance} nautical miles
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button className="p-2 text-maronaut-500 bg-maronaut-50 rounded-full hover:bg-maronaut-100 transition-colors">
                      <MessageSquare size={18} />
                    </button>
                    <button 
                      className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      <UserX size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-maronaut-500">
            You don't have any friends yet. Use the search to find people you know.
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
