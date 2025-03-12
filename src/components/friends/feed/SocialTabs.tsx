
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TripTimeline from '../TripTimeline';
import FollowingList from './FollowingList';
import FollowersList from './FollowersList';
import FollowRequestsList from '../FollowRequestsList';
import ProfileTab from './ProfileTab';
import { FollowingData, FollowRequest } from '@/services/types';

interface SocialTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  following: FollowingData[];
  followers: FollowingData[];
  incomingRequests: FollowRequest[];
  isLoading: boolean;
  showUserProfile: boolean;
  selectedUserId: string | null;
  onViewProfile: (userId: string) => void;
  onUnfollowUser: (userId: string) => void;
  onBackToList: () => void;
  fetchFollowData: () => void;
}

const SocialTabs: React.FC<SocialTabsProps> = ({
  activeTab,
  setActiveTab,
  following,
  followers,
  incomingRequests,
  isLoading,
  showUserProfile,
  selectedUserId,
  onViewProfile,
  onUnfollowUser,
  onBackToList,
  fetchFollowData
}) => {
  return (
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
            <FollowingList 
              following={following}
              isLoading={isLoading}
              onViewProfile={onViewProfile}
              onUnfollow={onUnfollowUser}
            />
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
            <FollowRequestsList 
              requests={incomingRequests} 
              onRequestAction={fetchFollowData} 
            />
            
            <FollowersList
              followers={followers}
              isLoading={isLoading}
              onViewProfile={onViewProfile}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileTab
          selectedUserId={selectedUserId}
          onBackToList={onBackToList}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SocialTabs;
