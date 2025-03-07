
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ship, MapPin, User, Calendar } from 'lucide-react';
import { getPublicUserProfile } from '@/services/profileService';
import { Skeleton } from '@/components/ui/skeleton';
import ProfilePicture from '@/components/profile/ProfilePicture';

interface FriendProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendId: string | null;
}

const FriendProfileDialog: React.FC<FriendProfileDialogProps> = ({
  open,
  onOpenChange,
  friendId
}) => {
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

    if (open && friendId) {
      loadProfile();
    }
  }, [open, friendId]);

  if (!open || !friendId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Friend Profile</DialogTitle>
        </DialogHeader>

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
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ProfilePicture 
                url={profile.profilePicture}
                username={profile.username || "User"}
                size="md"
                editable={false}
              />
              <div>
                <h3 className="text-lg font-semibold">{profile.username}</h3>
                {profile.firstName && profile.lastName && (
                  <p className="text-sm text-gray-600">{profile.firstName} {profile.lastName}</p>
                )}
              </div>
            </div>

            {profile.bio && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-maronaut-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.sailingSince && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-maronaut-500" />
                  <span>Sailing since {profile.sailingSince}</span>
                </div>
              )}
              
              {profile.email && (
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-maronaut-500" />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>

            {profile.boatDetails && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ship size={16} className="text-maronaut-500" />
                    <h4 className="font-medium">Boat Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    {profile.boatDetails.name && (
                      <>
                        <span className="text-gray-600">Name:</span>
                        <span>{profile.boatDetails.name}</span>
                      </>
                    )}
                    {profile.boatDetails.type && (
                      <>
                        <span className="text-gray-600">Type:</span>
                        <span>{profile.boatDetails.type}</span>
                      </>
                    )}
                    {profile.boatDetails.length && (
                      <>
                        <span className="text-gray-600">Length:</span>
                        <span>{profile.boatDetails.length}</span>
                      </>
                    )}
                    {profile.boatDetails.homeMarina && (
                      <>
                        <span className="text-gray-600">Home Marina:</span>
                        <span>{profile.boatDetails.homeMarina}</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-maronaut-500">Could not load profile information.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FriendProfileDialog;
