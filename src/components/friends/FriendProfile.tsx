
import React, { useState, useEffect } from 'react';
import { getPublicUserProfile } from '@/services/profileService';
import ProfileHeader from './profile/ProfileHeader';
import BoatDetails from './profile/BoatDetails';
import Achievements from './profile/Achievements';
import RecentTrips from './profile/RecentTrips';
import FavoriteMarinas from './profile/FavoriteMarinas';
import ProfileSkeleton from './profile/ProfileSkeleton';
import { MapPin, Calendar } from 'lucide-react';

interface FriendProfileProps {
  friendId: string;
  onBackToResults: () => void;
}

const FriendProfile: React.FC<FriendProfileProps> = ({ friendId, onBackToResults }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!friendId) return;
      
      setIsLoading(true);
      try {
        const userProfile = await getPublicUserProfile(friendId);
        setProfile(userProfile);
        console.log("Loaded friend profile:", userProfile);
      } catch (error) {
        console.error("Error loading friend profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (friendId) {
      loadProfile();
    }
  }, [friendId]);

  return (
    <div className="space-y-8 animate-fade-in">
      {isLoading ? (
        <ProfileSkeleton />
      ) : profile ? (
        <div className="space-y-8">
          {/* Profile Overview Section */}
          <ProfileHeader profile={profile} onBackToResults={onBackToResults} />

          {/* Boat Details Section (if available) */}
          <BoatDetails boatDetails={profile.boatDetails} />

          {/* Achievements Section */}
          <Achievements />

          {/* Recent Trip Section */}
          <RecentTrips />

          {/* Favorite Marinas */}
          <FavoriteMarinas />
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-maronaut-500">Could not load profile information.</p>
        </div>
      )}
    </div>
  );
};

export default FriendProfile;
