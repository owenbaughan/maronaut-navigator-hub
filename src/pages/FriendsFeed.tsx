
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TripTimeline from '../components/friends/TripTimeline';
import { Search, UserCheck, UserPlus, UserMinus, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import UserSearch from '@/components/friends/UserSearch';
import { useToast } from '@/components/ui/use-toast';
import { 
  FollowingData, 
  getFollowing, 
  getFollowers,
  unfollowUser
} from '@/services/friendService';
import FriendProfileDialog from '@/components/friends/FriendProfileDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FriendsFeed = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [following, setFollowing] = useState<FollowingData[]>([]);
  const [followers, setFollowers] = useState<FollowingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unfollowingUserId, setUnfollowingUserId] = useState<string | null>(null);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (currentUser) {
      fetchFollowData();
    }
  }, [currentUser]);
  
  const fetchFollowData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching follow data for user:", currentUser.uid);
      
      const followingList = await getFollowing(currentUser.uid);
      console.log("Fetched following:", followingList.length);
      setFollowing(followingList);
      
      const followersList = await getFollowers(currentUser.uid);
      console.log("Fetched followers:", followersList.length);
      setFollowers(followersList);
      
    } catch (error) {
      console.error("Error fetching follow data:", error);
      toast({
        title: "Failed to load following/followers",
        description: "There was a problem loading your network connections",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUnfollowUser = async (targetUserId: string) => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const success = await unfollowUser(currentUser.uid, targetUserId);
      
      if (success) {
        setFollowing(prev => prev.filter(user => user.followingId !== targetUserId));
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user",
        });
      } else {
        toast({
          title: "Failed to unfollow",
          description: "There was a problem unfollowing this user",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast({
        title: "Failed to unfollow",
        description: "There was a problem unfollowing this user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setUnfollowingUserId(null);
    }
  };

  const handleViewUserProfile = (userId: string) => {
    setSelectedUserId(userId);
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
                Social Feed
              </h1>
              
              <div className="glass-panel p-6 animate-fade-in mb-8">
                <UserSearch onUserAdded={fetchFollowData} />
              </div>
              
              <Tabs defaultValue="trips" className="animate-fade-in mb-10">
                <TabsList className="grid grid-cols-3 w-full mb-6">
                  <TabsTrigger value="trips">Trips</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                  <TabsTrigger value="followers">Followers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trips">
                  <TripTimeline />
                </TabsContent>
                
                <TabsContent value="following">
                  <Card>
                    <CardHeader>
                      <CardTitle>Following</CardTitle>
                      <CardDescription>
                        Sailors you are following
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="text-center p-6">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maronaut-700 mx-auto"></div>
                          <p className="mt-4 text-maronaut-600">Loading following...</p>
                        </div>
                      ) : following.length === 0 ? (
                        <div className="text-center p-6 text-maronaut-500">
                          You're not following anyone yet. Search for sailors to connect with!
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {following.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                                  {user.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                  <p className="font-medium">{user.username}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewUserProfile(user.followingId)}
                                >
                                  View Profile
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                    >
                                      <UserMinus className="h-4 w-4 mr-1" />
                                      Unfollow
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Unfollow User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to unfollow {user.username}? 
                                        You'll no longer see their trips in your feed.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => handleUnfollowUser(user.followingId)}
                                      >
                                        Unfollow
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="followers">
                  <Card>
                    <CardHeader>
                      <CardTitle>Followers</CardTitle>
                      <CardDescription>
                        Sailors who are following you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="text-center p-6">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maronaut-700 mx-auto"></div>
                          <p className="mt-4 text-maronaut-600">Loading followers...</p>
                        </div>
                      ) : followers.length === 0 ? (
                        <div className="text-center p-6 text-maronaut-500">
                          You don't have any followers yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {followers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-maronaut-200 hover:bg-maronaut-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-maronaut-300 rounded-full text-white flex items-center justify-center">
                                  {user.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                  <p className="font-medium">{user.username}</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewUserProfile(user.userId)}
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
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <FriendProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        friendId={selectedUserId}
      />
    </div>
  );
};

export default FriendsFeed;
