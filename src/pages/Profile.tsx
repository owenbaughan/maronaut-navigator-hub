
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Settings, Edit, User, Mail, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import ProfileEditDialog from '../components/profile/ProfileEditDialog';
import { getUserProfile, saveUserProfile, BoatDetails, UserProfile } from '@/services/profileService';

const Profile = () => {
  const { currentUser, isLoaded, isSignedIn } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Privacy settings
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [autoAcceptFriends, setAutoAcceptFriends] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [showBoatDetails, setShowBoatDetails] = useState(true);
  
  // State for user data
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  
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
          
          // Initialize privacy settings from profile if they exist
          if (profile.privacySettings) {
            setIsPublicProfile(profile.privacySettings.isPublicProfile ?? true);
            setAutoAcceptFriends(profile.privacySettings.autoAcceptFriends ?? false);
            setShowEmail(profile.privacySettings.showEmail ?? false);
            setShowLocation(profile.privacySettings.showLocation ?? true);
            setShowBoatDetails(profile.privacySettings.showBoatDetails ?? true);
          }
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
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };
  
  // Function to save privacy settings
  const savePrivacySettings = async () => {
    if (!currentUser || !profileData) return;
    
    try {
      const updatedProfile = {
        ...profileData,
        privacySettings: {
          isPublicProfile,
          autoAcceptFriends,
          showEmail,
          showLocation,
          showBoatDetails
        },
        updatedAt: new Date()
      };
      
      await saveUserProfile(updatedProfile);
      
      toast({
        title: "Privacy settings saved",
        description: "Your privacy preferences have been updated successfully."
      });
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your privacy settings.",
        variant: "destructive"
      });
    }
  };
  
  const handleTabChange = (value) => {
    setActiveTab(value);
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
              <div className="max-w-4xl mx-auto">
                <div className="glass-panel p-8 mb-8 animate-fade-in">
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
                        Profile Settings
                      </h1>
                      <p className="text-maronaut-600/80 mb-4">
                        Manage your account settings and privacy preferences
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleOpenEditDialog}
                        >
                          <Settings size={16} className="mr-2" />
                          Edit Profile
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.href = "/dashboard"}
                        >
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-panel p-6 animate-fade-in">
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="personal">
                        <User size={16} className="mr-2" />
                        Personal Info
                      </TabsTrigger>
                      <TabsTrigger value="privacy">
                        <Shield size={16} className="mr-2" />
                        Privacy
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="personal" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Email</Label>
                              <div className="flex items-center mt-1">
                                <Mail size={16} className="text-maronaut-500 mr-2" />
                                <span className="text-maronaut-700">{currentUser?.email || "No email set"}</span>
                              </div>
                              <p className="text-sm text-maronaut-500 mt-1">Your email address is used for account recovery</p>
                            </div>
                            <div>
                              <Label>Username</Label>
                              <div className="flex items-center mt-1">
                                <User size={16} className="text-maronaut-500 mr-2" />
                                <span className="text-maronaut-700">{profileData?.username || currentUser?.displayName || "Not set"}</span>
                              </div>
                              <p className="text-sm text-maronaut-500 mt-1">This is how others see you on Maronaut</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={handleOpenEditDialog}>Edit Profile</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Account Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button 
                            variant="destructive"
                            className="w-full md:w-auto"
                            onClick={() => window.location.href = "/signin"}
                          >
                            <LogOut size={16} className="mr-2" />
                            Sign Out
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="privacy" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Privacy Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="public-profile">Public Profile</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow anyone to view your profile
                              </p>
                            </div>
                            <Switch 
                              id="public-profile" 
                              checked={isPublicProfile}
                              onCheckedChange={setIsPublicProfile}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="auto-accept">Auto-Accept Friend Requests</Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically accept all friend requests
                              </p>
                            </div>
                            <Switch 
                              id="auto-accept" 
                              checked={autoAcceptFriends}
                              onCheckedChange={setAutoAcceptFriends}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-email">Show Email</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow others to see your email address
                              </p>
                            </div>
                            <Switch 
                              id="show-email" 
                              checked={showEmail}
                              onCheckedChange={setShowEmail}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-location">Show Location</Label>
                              <p className="text-sm text-muted-foreground">
                                Display your location on your profile
                              </p>
                            </div>
                            <Switch 
                              id="show-location" 
                              checked={showLocation}
                              onCheckedChange={setShowLocation}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-boat">Show Boat Details</Label>
                              <p className="text-sm text-muted-foreground">
                                Share your boat information with others
                              </p>
                            </div>
                            <Switch 
                              id="show-boat" 
                              checked={showBoatDetails}
                              onCheckedChange={setShowBoatDetails}
                            />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={savePrivacySettings}>Save Privacy Settings</Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  </Tabs>
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
