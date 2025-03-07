
import React from 'react';
import { MapPin, Calendar, Edit } from 'lucide-react';
import { UserProfile } from '@/services/profileService';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  photoURL: string | null;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, photoURL, onEditClick }) => {
  const displayName = profile 
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "Sailor";

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="relative">
        <img 
          src={photoURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"} 
          alt="Profile" 
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <button 
          className="absolute bottom-0 right-0 p-2 rounded-full bg-maronaut-500 text-white hover:bg-maronaut-600 transition-colors"
          onClick={onEditClick}
        >
          <Edit size={16} />
        </button>
      </div>
      
      <div className="text-center md:text-left flex-1">
        <h1 className="text-2xl md:text-3xl font-bold text-maronaut-700 mb-2">
          {displayName}
        </h1>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-maronaut-600 mb-4">
          {profile?.location && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {profile.location}
            </div>
          )}
          {profile?.sailingSince && (
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Sailing since {profile.sailingSince}
            </div>
          )}
        </div>
        <p className="text-maronaut-600/80 max-w-xl">
          {profile?.bio || "Tell us about yourself and your sailing experience by editing your profile."}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
