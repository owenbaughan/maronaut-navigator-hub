import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TripTimeline from '../components/friends/TripTimeline';
import { Search, UserCheck, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import UserSearch from '@/components/friends/UserSearch';
import { useToast } from '@/components/ui/use-toast';
import { 
  FriendData, 
  FriendRequest, 
  getFriends, 
  getFriendRequests, 
  acceptFriendRequest, 
  removeFriendRequest 
} from '@/services/friendService';
import FriendProfileDialog from '@/components/friends/FriendProfileDialog';

const FriendsFeed = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // State for friends and requests
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for friend profile dialog
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  // Fetch data on component mount and when currentUser changes
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch friends and requests if user is signed in
    if (currentUser) {
      fetchFriendsData();
    }
  }, [currentUser]);
  
  // Function to fetch all friends data
  const fetchFriendsData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Get friends
      const friendsList = await getFriends(currentUser.uid);
      setFriends(friendsList);
      
      // Get friend requests
      const { incomingRequests: incoming, outgoingRequests: outgoing } = await getFriendRequests(currentUser.uid);
      setIncomingRequests(incoming);
      setPendingRequests(outgoing);
    } catch (error) {
      console.error("Error fetching friends data:", error);
      toast({
        title: "Failed to load friends",
        description: "There was a problem loading your friends and requests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle friend request acceptance
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast({
        title: "Friend request accepted",
        description: "You are now friends with this user",
      });
      
      // Update UI
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      await fetchFriendsData(); // Refresh all data
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Failed to accept request",
        description: "There was a problem accepting the friend request",
        variant: "destructive"
      });
    }
  };
  
  // Handle friend request rejection
  const handleRejectRequest = async (requestId: string) => {
    try {
      await removeFriendRequest(requestId);
      toast({
        title: "Friend request declined",
        description: "The friend request has been declined",
      });
      
      // Update UI
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Failed to decline request",
        description: "There was a problem declining the friend request",
        variant: "destructive"
      });
    }
  };
  
  // Handle cancelling a sent friend request
  const handleCancelRequest = async (requestId: string) => {
    try {
      await removeFriendRequest(requestId);
      toast({
        title: "Friend request cancelled",
        description: "Your friend request has been cancelled",
      });
      
      // Update UI
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      toast({
        title: "Failed to cancel request",
        description: "There was a problem cancelling the friend request",
        variant: "destructive"
      });
    }
  };

  // Handle viewing a friend's profile
  const handleViewFriendProfile = (friendId: string) => {
    setSelectedFriendId(friendId);
    setProfileDialogOpen(true);
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
                <UserSearch onUserAdded={fetchFriendsData} />
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
                      {isLoading ? (
                        <div className="text-center p-6">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maronaut-700 mx-auto"></div>
                          <p className="mt-4 text-maronaut-600">Loading friends...</p>
                        </div>
                      ) : friends.length === 0 ? (
                        <div className="text-center p-6 text-maronaut-500">
                          You don't have any friends yet. Search for sailors to connect with!
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {friends.map(friend => (
                            <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                                  {friend.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                  <p className="font-medium">{friend.username}</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewFriendProfile(friend.friendId)}
                              >
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
                        {isLoading ? (
                          <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maronaut-700 mx-auto"></div>
                          </div>
                        ) : incomingRequests.length === 0 ? (
                          <div className="text-center p-4 text-maronaut-500">
                            No incoming friend requests
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {incomingRequests.map(request => (
                              <div key={request.id} className="p-3 rounded-lg border border-maronaut-200">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                                    {request.senderUsername?.charAt(0).toUpperCase() || '?'}
                                  </div>
                                  <div>
                                    <p className="font-medium">{request.senderUsername}</p>
                                    <p className="text-xs text-maronaut-500">
                                      {request.timestamp ? new Date(request.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                                    </p>
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
                        {isLoading ? (
                          <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maronaut-700 mx-auto"></div>
                          </div>
                        ) : pendingRequests.length === 0 ? (
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
                                      {request.receiverUsername?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                      <p className="font-medium">{request.receiverUsername}</p>
                                      <p className="text-xs text-maronaut-500">
                                        {request.timestamp ? new Date(request.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                                      </p>
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
      
      {/* Friend Profile Dialog */}
      <FriendProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        friendId={selectedFriendId}
      />
    </div>
  );
};

export default FriendsFeed;
