
import React, { useState, useEffect } from 'react';
import { getPublicUserProfile } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Calendar, Ship, Anchor, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProfilePicture from '@/components/profile/ProfilePicture';
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onBackToResults} 
          className="text-maronaut-500"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Search Results
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : profile ? (
        <div className="space-y-8">
          {/* Profile Overview Section */}
          <div className="glass-panel p-8 mb-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <ProfilePicture 
                  url={profile.profilePicture}
                  username={profile.username || "User"}
                  size="md"
                  editable={false}
                />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-maronaut-700 mb-2">
                  {profile.username}
                </h1>
                {profile.firstName && profile.lastName && (
                  <h2 className="text-xl text-maronaut-600 mb-2">
                    {profile.firstName} {profile.lastName}
                  </h2>
                )}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-maronaut-600 mb-4">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {profile.location}
                    </div>
                  )}
                  {profile.sailingSince && (
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Sailing since {profile.sailingSince}
                    </div>
                  )}
                </div>
                <p className="text-maronaut-600/80 max-w-xl">
                  {profile.bio || "No bio provided."}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-maronaut-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-maronaut-700">24</div>
                <div className="text-sm text-maronaut-600">Trips</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-maronaut-700">376</div>
                <div className="text-sm text-maronaut-600">Nautical Miles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-maronaut-700">12</div>
                <div className="text-sm text-maronaut-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-maronaut-700">8</div>
                <div className="text-sm text-maronaut-600">Badges</div>
              </div>
            </div>
          </div>

          {/* Boat Details Section (if available) */}
          {profile.boatDetails && Object.values(profile.boatDetails).some(val => val) && (
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                Boat Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.boatDetails.name && (
                  <div>
                    <h3 className="text-sm font-medium text-maronaut-600">Boat Name</h3>
                    <p className="text-maronaut-700">{profile.boatDetails.name}</p>
                  </div>
                )}
                
                {profile.boatDetails.type && (
                  <div>
                    <h3 className="text-sm font-medium text-maronaut-600">Type</h3>
                    <p className="text-maronaut-700">{profile.boatDetails.type}</p>
                  </div>
                )}
                
                {profile.boatDetails.length && (
                  <div>
                    <h3 className="text-sm font-medium text-maronaut-600">Length</h3>
                    <p className="text-maronaut-700">{profile.boatDetails.length}</p>
                  </div>
                )}
                
                {profile.boatDetails.homeMarina && (
                  <div>
                    <h3 className="text-sm font-medium text-maronaut-600">Home Marina</h3>
                    <p className="text-maronaut-700">{profile.boatDetails.homeMarina}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
                  <Award size={28} />
                </div>
                <span className="text-sm text-center text-maronaut-600">First Voyage</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
                  <Ship size={28} />
                </div>
                <span className="text-sm text-center text-maronaut-600">100nm Club</span>
              </div>
            </div>
          </div>

          {/* Recent Trip Section */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
              Recent Trips
            </h2>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-maronaut-600">San Francisco Bay Cruise</h3>
                <span className="text-sm text-maronaut-500">3 days ago</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-sm text-maronaut-600">
                  <MapPin size={16} className="mr-2 text-maronaut-500" />
                  San Francisco Bay
                </div>
                <div className="flex items-center text-sm text-maronaut-600">
                  <Calendar size={16} className="mr-2 text-maronaut-500" />
                  3h 45m
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Marinas */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
              Favorite Marinas
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Anchor size={20} className="mr-3 text-maronaut-500" />
                  <span>Harbor Marina</span>
                </div>
                <span className="text-sm text-maronaut-500">Visited 3 times</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Anchor size={20} className="mr-3 text-maronaut-500" />
                  <span>Bay Yacht Club</span>
                </div>
                <span className="text-sm text-maronaut-500">Visited 2 times</span>
              </div>
            </div>
          </div>
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
