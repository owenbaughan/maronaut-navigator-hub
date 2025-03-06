
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { MapPin, Ship, Award, Star, Bookmark } from 'lucide-react';

const ProfileDisplay = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const userData = {
    fullName: user.fullName || 'User',
    location: user.unsafeMetadata?.location as string || 'Location not set',
    sailingSince: user.unsafeMetadata?.sailingSince as string || '',
    bio: user.unsafeMetadata?.bio as string || 'No bio added yet',
    boatName: user.unsafeMetadata?.boatName as string || '',
    boatType: user.unsafeMetadata?.boatType as string || '',
    boatLength: user.unsafeMetadata?.boatLength as string || '',
    homeMarina: user.unsafeMetadata?.homeMarina as string || '',
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={user.imageUrl} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-maronaut-700 mb-2">
            {userData.fullName}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-maronaut-600 mb-4">
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {userData.location}
            </div>
            {userData.sailingSince && (
              <div className="flex items-center">
                <Ship size={16} className="mr-1" />
                Sailing since {userData.sailingSince}
              </div>
            )}
          </div>
          <p className="text-maronaut-600/80 max-w-xl">
            {userData.bio}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-maronaut-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-maronaut-700">0</div>
          <div className="text-sm text-maronaut-600">Trips</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-maronaut-700">0</div>
          <div className="text-sm text-maronaut-600">Nautical Miles</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-maronaut-700">0</div>
          <div className="text-sm text-maronaut-600">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-maronaut-700">0</div>
          <div className="text-sm text-maronaut-600">Badges</div>
        </div>
      </div>
    </>
  );
};

export default ProfileDisplay;
