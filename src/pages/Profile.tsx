
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Settings, Edit, MapPin, Ship, Activity, Award, Star, Bookmark, LogOut, Calendar } from 'lucide-react';
import ProfileEditDialog from '../components/profile/ProfileEditDialog';
import { Button } from '@/components/ui/button';
import { getUserProfile, BoatDetails, UserProfile } from '@/services/profileService';

const Profile = () => {
  const { currentUser, isLoaded, isSignedIn } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for user data
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
          setFirstName(profile.firstName || "");
          setLastName(profile.lastName || "");
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
          // Set default first and last name from display name if available
          if (currentUser.displayName) {
            const nameParts = currentUser.displayName.split(' ');
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(' ') || "");
          }
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
  
  // Get full name for display
  const fullName = `${firstName} ${lastName}`.trim() || "Sailor";
  
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
                <div className="glass-panel p-8 mb-8 relative animate-fade-in">
                  <button 
                    className="absolute top-6 right-6 p-2 rounded-full bg-maronaut-100 text-maronaut-600 hover:bg-maronaut-200 transition-colors"
                    onClick={handleOpenEditDialog}
                  >
                    <Settings size={20} />
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
                        onClick={handleOpenEditDialog}
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-maronaut-700 mb-2">
                        {fullName}
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <div className="glass-panel p-6 animate-fade-in animate-delay-1">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-maronaut-700">
                          Recent Trips
                        </h2>
                        <button className="text-sm text-maronaut-500 font-medium">
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium text-maronaut-700">San Francisco Bay Cruise</h3>
                            <div className="flex items-center text-maronaut-500">
                              <Activity size={16} className="mr-1" />
                              12.4 nm
                            </div>
                          </div>
                          <p className="text-sm text-maronaut-600 mb-3">
                            A beautiful day sailing around Alcatraz and under the Golden Gate Bridge.
                          </p>
                          <div className="flex justify-between text-sm">
                            <span className="text-maronaut-500">Jul 15, 2023</span>
                            <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
                              Details
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium text-maronaut-700">Half Moon Bay Overnight</h3>
                            <div className="flex items-center text-maronaut-500">
                              <Activity size={16} className="mr-1" />
                              28.6 nm
                            </div>
                          </div>
                          <p className="text-sm text-maronaut-600 mb-3">
                            Weekend trip to Half Moon Bay with an overnight stay at the marina.
                          </p>
                          <div className="flex justify-between text-sm">
                            <span className="text-maronaut-500">Jun 24, 2023</span>
                            <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-panel p-6 animate-fade-in animate-delay-2">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-maronaut-700">
                          My Reviews
                        </h2>
                        <button className="text-sm text-maronaut-500 font-medium">
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium text-maronaut-700">Sausalito Yacht Harbor</h3>
                            <div className="flex items-center text-maronaut-500">
                              <Star size={16} fill="currentColor" className="mr-1" />
                              4.5
                            </div>
                          </div>
                          <p className="text-sm text-maronaut-600 mb-3">
                            Great facilities and friendly staff. The showers are clean and the location is perfect.
                          </p>
                          <div className="flex justify-between text-sm">
                            <span className="text-maronaut-500">May 18, 2023</span>
                            <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="glass-panel p-6 animate-fade-in animate-delay-3">
                      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                        Achievements
                      </h2>
                      
                      <div className="grid grid-cols-2 gap-4">
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
                        
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
                            <Star size={28} />
                          </div>
                          <span className="text-sm text-center text-maronaut-600">10 Reviews</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
                            <Bookmark size={28} />
                          </div>
                          <span className="text-sm text-center text-maronaut-600">5 Harbors</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-panel p-6 animate-fade-in animate-delay-4">
                      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                        Boat Details
                      </h2>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium text-maronaut-600">Boat Name</h3>
                          <p className="text-maronaut-700">{boatDetails.name || "Not specified"}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-maronaut-600">Type</h3>
                          <p className="text-maronaut-700">{boatDetails.type || "Not specified"}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-maronaut-600">Length</h3>
                          <p className="text-maronaut-700">{boatDetails.length || "Not specified"}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-maronaut-600">Home Marina</h3>
                          <p className="text-maronaut-700">{boatDetails.homeMarina || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost"
                        className="w-full mt-4 py-2 text-center text-maronaut-500 hover:text-maronaut-600 font-medium border-t border-maronaut-100"
                        onClick={handleOpenEditDialog}
                      >
                        Edit Boat Details
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost"
                      className="w-full p-3 text-center flex items-center justify-center text-red-500 hover:text-red-600 font-medium glass-panel animate-fade-in animate-delay-5"
                      onClick={() => window.location.href = "/signin"}
                    >
                      <LogOut size={18} className="mr-2" />
                      Sign Out
                    </Button>
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
