import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TripTimeline from '../components/friends/TripTimeline';
import { UserCheck, UserPlus, UserMinus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import UserSearch from '@/components/friends/UserSearch';
import { 
  FollowingData, 
  getFollowing, 
  getFollowers,
  unfollowUser,
  getFollowRequests,
  FollowRequest
} from '@/services/friendService';
import FriendProfile from '@/components/friends/FriendProfile';
import FollowRequestsList from '@/components/friends/FollowRequestsList';
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
  
  const [following, setFollowing] = useState<FollowingData[]>([]);
  const [followers, setFollowers] = useState<FollowingData[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FollowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unfollowingUserId, setUnfollowingUserId] = useState<string | null>(null);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("trips");
  const [prevActiveTab, setPrevActiveTab] = useState("trips");
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (currentUser) {
      fetchFollowData();
    }
  }, [currentUser]);
  
  useEffect(() => {
    const handleViewUserProfile = (event: CustomEvent) => {
      const { userId } = event.detail;
      handleViewUserProfile(userId);
    };
    
    document.addEventListener('viewUserProfile', handleViewUserProfile as EventListener);
    
    return () => {
      document.removeEventListener('viewUserProfile', handleViewUserProfile as EventListener);
    };
  }, []);
  
  const fetchFollowData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching follow data for user:", currentUser.uid);
      
      const requests = await getFollowRequests(currentUser.uid);
      console.log("Fetched follow requests:", requests);
      setIncomingRequests(requests.incomingRequests);
      
      const followingList = await getFollowing(currentUser.uid);
      console.log("Fetched following:", followingList.length);
      setFollowing(followingList);
      
      const followersList = await getFollowers(currentUser.uid);
      console.log("Fetched followers:", followersList.length);
      setFollowers(followersList);
      
    } catch (error) {
      console.error("Error fetching follow data:", error);
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
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setIsLoading(false);
      setUnfollowingUserId(null);
    }
  };

  const handleViewUserProfile = (userId: string) => {
    if (!showUserProfile) {
      setPrevActiveTab(activeTab);
    }
    
    setSelectedUserId(userId);
    setShowUserProfile(true);
    setActiveTab("profile");
  };
  
  const handleBackToList = () => {
    setShowUserProfile(false);
    setSelectedUserId(null);
    setActiveTab(prevActiveTab);
  };

  const formatDisplayName = (user: FollowingData) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return null;
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
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in mb-10">
                <TabsList className="grid grid-cols-4 w-full mb-6">
                  <TabsTrigger value="trips">Trips</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                  <TabsTrigger value="followers">
                    Followers
                    {incomingRequests.length > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {incomingRequests.length}
                      </span>
                    )}
                  </TabsTrigger>
                  {showUserProfile && (
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                  )}
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
                                  {formatDisplayName(user) && (
                                    <p className="text-sm text-maronaut-600">{formatDisplayName(user)}</p>
                                  )}
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
                                        {formatDisplayName(user) && ` (${formatDisplayName(user)})`}
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
                      ) : (
                        <>
                          <FollowRequestsList 
                            requests={incomingRequests} 
                            onRequestAction={fetchFollowData} 
                          />
                          
                          {followers.length === 0 && incomingRequests.length === 0 ? (
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
                                      {formatDisplayName(user) && (
                                        <p className="text-sm text-maronaut-600">{formatDisplayName(user)}</p>
                                      )}
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
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="profile">
                  {selectedUserId && (
                    <Card>
                      <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <Button 
                          variant="ghost" 
                          onClick={handleBackToList} 
                          className="text-maronaut-500 mt-2"
                        >
                          &larr; Back
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <FriendProfile
                          friendId={selectedUserId}
                          onBackToResults={handleBackToList}
                        />
                      </CardContent>
                    </Card>
                  )}
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
