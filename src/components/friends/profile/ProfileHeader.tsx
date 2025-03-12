
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProfilePicture from '@/components/profile/ProfilePicture';

interface ProfileHeaderProps {
  profile: any;
  onBackToResults: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onBackToResults }) => {
  return (
    <>
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

      <div className="glass-panel p-8 mb-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <ProfilePicture 
              url={profile.profilePicture}
              username={profile.username || "User"}
              size="lg"
              editable={false}
            />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-maronaut-700 mb-2">
              {profile.username}
            </h1>
            {profile.firstName && profile.lastName ? (
              <h2 className="text-xl text-maronaut-600 mb-2">
                {profile.firstName} {profile.lastName}
              </h2>
            ) : profile.firstName ? (
              <h2 className="text-xl text-maronaut-600 mb-2">
                {profile.firstName}
              </h2>
            ) : profile.lastName ? (
              <h2 className="text-xl text-maronaut-600 mb-2">
                {profile.lastName}
              </h2>
            ) : null}
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
    </>
  );
};

export default ProfileHeader;
