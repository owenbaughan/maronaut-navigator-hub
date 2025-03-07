
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProfileEditDialog from '../components/profile/ProfileEditDialog';
import ProfileHeader from '../components/profile/ProfileHeader';
import RecentTrips from '../components/profile/RecentTrips';
import ReviewsSection from '../components/profile/ReviewsSection';
import AchievementsSection from '../components/profile/AchievementsSection';
import BoatDetailsSidebar from '../components/profile/BoatDetailsSidebar';
import SignOutButton from '../components/profile/SignOutButton';
import { getUserProfile, BoatDetails, UserProfile } from '@/services/profileService';

const Profile = () => {
  const { currentUser, isLoaded, isSignedIn } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for user data
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [sailingSince, setSailingSince] = useState("");
  const [boatDetails, setBoatDetails] = useState<BoatDetails>({
    name: "",
    type: "",
    length: "",
    homeMarina: "",
  });
  
  // Load user data
  const loadProfileData = async () => {
    if (isLoaded && isSignedIn && currentUser) {
      try {
        setIsLoading(true);
        console.log("Loading profile data for user:", currentUser.uid);
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          console.log("Profile data loaded:", profile);
          setProfileData(profile);
          setBio(profile.bio || "");
          setLocation(profile.location || "");
          setSailingSince(profile.sailingSince || "");
          setBoatDetails(profile.boatDetails || {
            name: "",
            type: "",
            length: "",
            homeMarina: "",
          });
        } else {
          console.log("No profile data found for user:", currentUser.uid);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadProfileData();
  }, [isLoaded, isSignedIn, currentUser]);
  
  // Function to open edit dialog
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };
  
  // Function to handle profile updates
  const handleProfileUpdated = () => {
    console.log("Profile updated, refreshing data");
    loadProfileData();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maronaut-500"></div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <ProfileHeader 
                  profileData={profileData}
                  currentUser={currentUser}
                  location={location}
                  bio={bio}
                  sailingSince={sailingSince}
                  onEditClick={handleOpenEditDialog}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <RecentTrips />
                    <ReviewsSection />
                  </div>
                  
                  <div className="space-y-8">
                    <AchievementsSection />
                    <BoatDetailsSidebar 
                      boatDetails={boatDetails}
                      onEditClick={handleOpenEditDialog}
                    />
                    <SignOutButton />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      
      <ProfileEditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
};

export default Profile;
