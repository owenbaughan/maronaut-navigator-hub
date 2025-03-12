
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import UserSearch from '@/components/friends/UserSearch';
import SocialTabs from '@/components/friends/feed/SocialTabs';
import { useFriendsData } from '@/hooks/use-friends-data';

const FriendsFeed = () => {
  const { currentUser } = useAuth();
  
  // User profile viewing state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("trips");
  const [prevActiveTab, setPrevActiveTab] = useState("trips");
  
  // Get friends data using our custom hook
  const { 
    following, 
    followers, 
    incomingRequests, 
    isLoading, 
    fetchFollowData, 
    handleUnfollowUser 
  } = useFriendsData(currentUser?.uid || null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    // Setup event listener for user profile viewing
    const handleViewUserProfileEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.userId) {
        console.log('View profile event received for user:', customEvent.detail.userId);
        handleViewUserProfile(customEvent.detail.userId);
      }
    };
    
    // Add event listener
    document.addEventListener('viewUserProfile', handleViewUserProfileEvent);
    
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('viewUserProfile', handleViewUserProfileEvent);
    };
  }, []);
  
  const handleViewUserProfile = (userId: string) => {
    console.log('Handling view profile for user:', userId);
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
              
              <SocialTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                following={following}
                followers={followers}
                incomingRequests={incomingRequests}
                isLoading={isLoading}
                showUserProfile={showUserProfile}
                selectedUserId={selectedUserId}
                onViewProfile={handleViewUserProfile}
                onUnfollowUser={handleUnfollowUser}
                onBackToList={handleBackToList}
                fetchFollowData={fetchFollowData}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FriendsFeed;
