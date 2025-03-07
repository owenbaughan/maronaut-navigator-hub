import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Ship, MapPin, User, Mail, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getUserProfile, saveUserProfile, BoatDetails, UserProfile } from "@/services/profileService";
import { updateProfile } from "@/lib/firebase";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdated?: () => void;
}

const ProfileEditDialog = ({ open, onOpenChange, onProfileUpdated }: ProfileEditDialogProps) => {
  const { currentUser, isLoaded } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [profileData, setProfileData] = React.useState<Partial<UserProfile>>({});
  
  // For basic user data from Firebase Auth
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  
  // For custom data (to be stored in Firebase)
  const [bio, setBio] = React.useState("");
  const [sailingSince, setSailingSince] = React.useState("");
  const [boatDetails, setBoatDetails] = React.useState<BoatDetails>({
    name: "",
    type: "",
    length: "",
    homeMarina: "",
  });
  
  // Load user data when dialog opens
  React.useEffect(() => {
    if (isLoaded && currentUser && open) {
      setName(currentUser.displayName || "");
      
      // Load profile data from Firebase
      const loadProfileData = async () => {
        try {
          setLoading(true);
          if (currentUser.uid) {
            console.log("Loading profile data for:", currentUser.uid);
            const profile = await getUserProfile(currentUser.uid);
            if (profile) {
              console.log("Loaded profile data:", profile);
              setProfileData(profile);
              setName(profile.name || currentUser.displayName || "");
              setLocation(profile.location || "");
              setBio(profile.bio || "");
              setSailingSince(profile.sailingSince || "");
              setBoatDetails(profile.boatDetails || {
                name: "",
                type: "",
                length: "",
                homeMarina: "",
              });
            } else {
              console.log("No profile data found");
            }
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      loadProfileData();
    }
  }, [isLoaded, currentUser, open]);
  
  const handleSave = async () => {
    if (!currentUser) {
      console.error("No current user found");
      toast({
        title: "Error saving profile",
        description: "You must be signed in to save your profile.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      console.log("Updating profile for user:", currentUser.uid);
      
      // Update user profile in Firebase Auth
      await updateProfile(currentUser, {
        displayName: name
      });
      
      // Prepare profile data for saving to Firestore
      const updatedProfile: UserProfile = {
        userId: currentUser.uid,
        name,
        location,
        bio,
        sailingSince,
        boatDetails,
        email: currentUser.email || undefined,
        // Preserve original creation date if it exists
        createdAt: profileData.createdAt || new Date(),
        updatedAt: new Date(),
      };
      
      console.log("Saving profile with data:", updatedProfile);
      
      // Save custom data to Firebase
      await saveUserProfile(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Notify parent component that profile has been updated
      if (onProfileUpdated) {
        onProfileUpdated();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and boat details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User size={16} />
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </Label>
                <Input
                  id="email"
                  value={currentUser?.email || ""}
                  disabled
                  placeholder="Your email"
                />
                <p className="text-xs text-muted-foreground">
                  Email can only be changed in account settings.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin size={16} />
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sailingSince" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Sailing Since
                </Label>
                <Input
                  id="sailingSince"
                  value={sailingSince}
                  onChange={(e) => setSailingSince(e.target.value)}
                  placeholder="e.g., 2015"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  About You
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a bit about yourself and your sailing experience"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Boat Details</h3>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="boatName" className="flex items-center gap-2">
                  <Ship size={16} />
                  Boat Name
                </Label>
                <Input
                  id="boatName"
                  value={boatDetails.name}
                  onChange={(e) => setBoatDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Name of your vessel"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="boatType">
                  Type
                </Label>
                <Input
                  id="boatType"
                  value={boatDetails.type}
                  onChange={(e) => setBoatDetails(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Make and model"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="boatLength">
                  Length
                </Label>
                <Input
                  id="boatLength"
                  value={boatDetails.length}
                  onChange={(e) => setBoatDetails(prev => ({ ...prev, length: e.target.value }))}
                  placeholder="Length in feet"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="homeMarina">
                  Home Marina
                </Label>
                <Input
                  id="homeMarina"
                  value={boatDetails.homeMarina}
                  onChange={(e) => setBoatDetails(prev => ({ ...prev, homeMarina: e.target.value }))}
                  placeholder="Where your boat is based"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
