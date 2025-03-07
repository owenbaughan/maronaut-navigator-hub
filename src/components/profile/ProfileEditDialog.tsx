
import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
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
import PersonalInfoSection from "./PersonalInfoSection";
import BoatDetailsSection from "./BoatDetailsSection";

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
          <PersonalInfoSection
            name={name}
            setName={setName}
            email={currentUser?.email}
            location={location}
            setLocation={setLocation}
            sailingSince={sailingSince}
            setSailingSince={setSailingSince}
            bio={bio}
            setBio={setBio}
          />
          
          <BoatDetailsSection
            boatDetails={boatDetails}
            setBoatDetails={setBoatDetails}
          />
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
