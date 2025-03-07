
import React from 'react';
import { MapPin, Calendar, Edit } from 'lucide-react';
import { UserProfile } from '@/services/profileService';

interface ProfileHeaderProps {
  profileData: UserProfile | null;
  currentUser: any; // Using any for simplicity, but we could type this with firebase User
  location: string;
  bio: string;
  sailingSince: string;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  currentUser,
  location,
  bio,
  sailingSince,
  onEditClick
}) => {
  return (
    <div className="glass-panel p-8 mb-8 relative animate-fade-in">
      <button 
        className="absolute top-6 right-6 p-2 rounded-full bg-maronaut-100 text-maronaut-600 hover:bg-maronaut-200 transition-colors"
        onClick={onEditClick}
      >
        <Edit size={20} />
      </button>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={currentUser?.photoURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"} 
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
            {profileData?.name || currentUser?.displayName || "Sailor"}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-maronaut-600 mb-4">
            {location && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {location}
              </div>
            )}
            {sailingSince && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                Sailing since {sailingSince}
              </div>
            )}
          </div>
          <p className="text-maronaut-600/80 max-w-xl">
            {bio || "Tell us about yourself and your sailing experience by editing your profile."}
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
  );
};

export default ProfileHeader;
