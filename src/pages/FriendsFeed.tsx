
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TripTimeline from '../components/friends/TripTimeline';
import UserSearch from '../components/friends/UserSearch';
import FriendRequestItem from '../components/friends/FriendRequestItem';
import FriendItem from '../components/friends/FriendItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  UserPlus, 
  Mail,
  Send,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getFriendRequests, 
  getFriends, 
  removeFriend,
  getFriendshipStatus 
} from '@/services/friendService';
import { getUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';

const FriendsFeed = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // State for friends and requests
  const [friendsData, setFriendsData] = useState<any>({ friendIds: [], friendData: {} });
  const [friendRequests, setFriendRequests] = useState<any>({ sent: [], received: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("friends");
  
  // State for user data
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [requestsData, setRequestsData] = useState<Record<string, any>>({});
  
  // Load friends and requests data
  const loadFriendsData = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Get friends
      const friends = await getFriends(currentUser.uid);
      setFriendsData(friends);
      
      // Get friend requests
      const requests = await getFriendRequests(currentUser.uid);
      setFriendRequests(requests);
      
      // Get user data for requests
      const requestUserData: Record<string, any> = {};
      
      // Process sent requests
      await Promise.all(
        requests.sent.map(async (request: any) => {
          try {
            const profile = await getUserProfile(request.receiverId);
            if (profile) {
              requestUserData[request.receiverId] = profile;
            }
          } catch (error) {
            console.error(`Error fetching profile for user ${request.receiverId}:`, error);
          }
        })
      );
      
      // Process received requests
      await Promise.all(
        requests.received.map(async (request: any) => {
          try {
            const profile = await getUserProfile(request.senderId);
            if (profile) {
              requestUserData[request.senderId] = profile;
            }
          } catch (error) {
            console.error(`Error fetching profile for user ${request.senderId}:`, error);
          }
        })
      );
      
      setRequestsData(requestUserData);
    } catch (error) {
      console.error("Error loading friends data:", error);
      toast({
        title: "Error",
        description: "Failed to load friends data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadFriendsData();
  }, [currentUser]);
  
  // Handle friend removal
  const handleRemoveFriend = async (requestId: string) => {
    try {
      await removeFriend(requestId);
      // Reload friends data
      loadFriendsData();
    } catch (error) {
      console.error("Error removing friend:", error);
      throw error;
    }
  };
  
  // Handle friend requests status update
  const handleStatusUpdate = async () => {
    await loadFriendsData();
  };
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-8 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold text-maronaut-700 mb-6 animate-fade-in">
                Friends
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left sidebar - Friends management */}
                <div className="md:col-span-1">
                  <div className="glass-panel p-6 animate-fade-in mb-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="friends">
                          <Users size={16} className="mr-2" />
                          Friends
                        </TabsTrigger>
                        <TabsTrigger value="requests">
                          <Mail size={16} className="mr-2" />
                          Requests
                          {friendRequests.received.filter(r => r.status === 'pending').length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                              {friendRequests.received.filter(r => r.status === 'pending').length}
                            </span>
                          )}
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="friends">
                        {isLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maronaut-500"></div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-lg font-medium text-maronaut-700 mb-3">
                              Your Friends ({friendsData.friendIds.length})
                            </h3>
                            
                            {friendsData.friendIds.length === 0 ? (
                              <div className="text-center py-8 text-maronaut-600">
                                <UserPlus size={36} className="mx-auto mb-2 text-maronaut-400" />
                                <p>You don't have any friends yet.</p>
                                <p className="text-sm">
                                  Use the search to find and add friends.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {friendsData.friendIds.map((friendId: string) => {
                                  const friend = friendsData.friendData[friendId];
                                  if (!friend) return null;
                                  
                                  return (
                                    <FriendItem
                                      key={friendId}
                                      friend={friend}
                                      requestId="" // TODO: Need to store requestId for each friend
                                      onRemoveFriend={handleRemoveFriend}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="requests">
                        {isLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maronaut-500"></div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-lg font-medium text-maronaut-700 mb-3">
                              Incoming Requests ({friendRequests.received.filter(r => r.status === 'pending').length})
                            </h3>
                            
                            {friendRequests.received.filter(r => r.status === 'pending').length === 0 ? (
                              <div className="text-center py-4 text-maronaut-600">
                                <p className="text-sm">
                                  No pending friend requests.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2 mb-6">
                                {friendRequests.received
                                  .filter(r => r.status === 'pending')
                                  .map((request: any) => {
                                    const user = requestsData[request.senderId];
                                    if (!user) return null;
                                    
                                    return (
                                      <FriendRequestItem 
                                        key={request.id}
                                        request={request}
                                        user={user}
                                        direction="received"
                                        onStatusUpdate={handleStatusUpdate}
                                      />
                                    );
                                  })}
                              </div>
                            )}
                            
                            <Separator className="my-4" />
                            
                            <h3 className="text-lg font-medium text-maronaut-700 mb-3">
                              Sent Requests ({friendRequests.sent.filter(r => r.status === 'pending').length})
                            </h3>
                            
                            {friendRequests.sent.filter(r => r.status === 'pending').length === 0 ? (
                              <div className="text-center py-4 text-maronaut-600">
                                <p className="text-sm">
                                  No pending outgoing requests.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {friendRequests.sent
                                  .filter(r => r.status === 'pending')
                                  .map((request: any) => {
                                    const user = requestsData[request.receiverId];
                                    if (!user) return null;
                                    
                                    return (
                                      <FriendRequestItem 
                                        key={request.id}
                                        request={request}
                                        user={user}
                                        direction="sent"
                                        onStatusUpdate={handleStatusUpdate}
                                      />
                                    );
                                  })}
                              </div>
                            )}
                          </>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="glass-panel p-6 animate-fade-in">
                    <UserSearch onFriendAdded={loadFriendsData} />
                  </div>
                </div>
                
                {/* Main content - Trip timeline */}
                <div className="md:col-span-2">
                  <div className="glass-panel p-6 animate-fade-in">
                    <h2 className="text-2xl font-semibold text-maronaut-700 mb-6">
                      Trip Feed
                    </h2>
                    
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maronaut-500"></div>
                      </div>
                    ) : friendsData.friendIds.length === 0 ? (
                      <div className="text-center py-12 glass-panel p-6">
                        <AlertCircle size={48} className="mx-auto mb-4 text-maronaut-400" />
                        <h3 className="text-xl font-medium text-maronaut-700 mb-2">
                          No Friends Yet
                        </h3>
                        <p className="text-maronaut-600 mb-4">
                          To see trip updates, start by adding friends using the search panel.
                        </p>
                      </div>
                    ) : (
                      <TripTimeline />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FriendsFeed;
