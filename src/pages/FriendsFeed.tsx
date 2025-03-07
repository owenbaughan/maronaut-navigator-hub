
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TripTimeline from '../components/friends/TripTimeline';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

// Dummy data for friends
interface Friend {
  id: string;
  username: string;
  photoURL: string | null;
}

// Dummy data for friend requests
interface FriendRequest {
  id: string;
  username: string;
  photoURL: string | null;
  timestamp: string;
}

const FriendsFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  
  // Dummy data for friends list
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', username: 'sailor_jack', photoURL: null },
    { id: '2', username: 'marina_blue', photoURL: null },
    { id: '3', username: 'captain_morgan', photoURL: null },
    { id: '4', username: 'sea_explorer', photoURL: null },
  ]);
  
  // Dummy data for pending friend requests (sent by the user)
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([
    { id: '5', username: 'ocean_wanderer', photoURL: null, timestamp: '2 days ago' },
    { id: '6', username: 'island_hopper', photoURL: null, timestamp: '5 days ago' },
  ]);
  
  // Dummy data for incoming friend requests (received by the user)
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([
    { id: '7', username: 'wave_rider', photoURL: null, timestamp: '1 day ago' },
    { id: '8', username: 'nautical_nancy', photoURL: null, timestamp: '3 days ago' },
    { id: '9', username: 'sailing_sam', photoURL: null, timestamp: 'Just now' },
  ]);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    console.log("Searching for:", searchQuery);
    // Search logic would be implemented here
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log("Accepting request:", requestId);
    // In a real implementation, this would call a service to accept the request
    setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
    setFriends(prev => [...prev, 
      ...incomingRequests.filter(req => req.id === requestId)
        .map(req => ({ id: req.id, username: req.username, photoURL: req.photoURL }))
    ]);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log("Rejecting request:", requestId);
    // In a real implementation, this would call a service to reject the request
    setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleCancelRequest = (requestId: string) => {
    console.log("Cancelling request:", requestId);
    // In a real implementation, this would call a service to cancel the request
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-8 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold text-maronaut-700 mb-6 animate-fade-in">
                Trip Feed
              </h1>
              
              <div className="glass-panel p-6 animate-fade-in mb-8">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-maronaut-400" />
                  </div>
                  <Input
                    type="text"
                    className="pl-10 pr-4 py-3 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                    placeholder="Search by sailor name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="absolute inset-y-0 right-0 px-4 bg-maronaut-500 text-white rounded-r-lg hover:bg-maronaut-600 transition-colors"
                  >
                    Search
                  </Button>
                </form>
              </div>
              
              <Tabs defaultValue="trips" className="animate-fade-in mb-10">
                <TabsList className="grid grid-cols-3 w-full mb-6">
                  <TabsTrigger value="trips">Trips</TabsTrigger>
                  <TabsTrigger value="friends">Friends</TabsTrigger>
                  <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trips">
                  <TripTimeline />
                </TabsContent>
                
                <TabsContent value="friends">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Friends</CardTitle>
                      <CardDescription>
                        View and manage your current friends.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {friends.length === 0 ? (
                        <div className="text-center p-6 text-maronaut-500">
                          You don't have any friends yet. Search for sailors to connect with!
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {friends.map(friend => (
                            <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                                  {friend.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium">{friend.username}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => console.log("View profile", friend.id)}>
                                View Profile
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="requests">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Incoming friend requests */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Incoming Requests</CardTitle>
                        <CardDescription>
                          Friend requests you've received
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {incomingRequests.length === 0 ? (
                          <div className="text-center p-4 text-maronaut-500">
                            No incoming friend requests
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {incomingRequests.map(request => (
                              <div key={request.id} className="p-3 rounded-lg border border-maronaut-200">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                                    {request.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium">{request.username}</p>
                                    <p className="text-xs text-maronaut-500">{request.timestamp}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Button 
                                    size="sm" 
                                    className="w-full bg-maronaut-500 hover:bg-maronaut-600"
                                    onClick={() => handleAcceptRequest(request.id)}
                                  >
                                    Accept
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full" 
                                    onClick={() => handleRejectRequest(request.id)}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Pending friend requests */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                        <CardDescription>
                          Friend requests you've sent
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {pendingRequests.length === 0 ? (
                          <div className="text-center p-4 text-maronaut-500">
                            No pending friend requests
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {pendingRequests.map(request => (
                              <div key={request.id} className="p-3 rounded-lg border border-maronaut-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                                      {request.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium">{request.username}</p>
                                      <p className="text-xs text-maronaut-500">{request.timestamp}</p>
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => handleCancelRequest(request.id)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FriendsFeed;
