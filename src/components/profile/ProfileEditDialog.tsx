
import * as React from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { Ship, MapPin, User, Mail } from "lucide-react";
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
import { getUserProfile, saveUserProfile, BoatDetails } from "@/services/profileService";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditDialog = ({ open, onOpenChange }: ProfileEditDialogProps) => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = React.useState(false);
  
  // For basic user data from Clerk
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  
  // For custom data (to be stored in Firebase)
  const [bio, setBio] = React.useState("");
  const [boatDetails, setBoatDetails] = React.useState<BoatDetails>({
    name: "",
    type: "",
    length: "",
    homeMarina: "",
  });
  
  // Load user data when dialog opens
  React.useEffect(() => {
    if (isLoaded && user && open) {
      setName(user.fullName || "");
      
      // Load profile data from Firebase
      const loadProfileData = async () => {
        try {
          if (user.id) {
            const profile = await getUserProfile(user.id);
            if (profile) {
              setLocation(profile.location || "");
              setBio(profile.bio || "");
              setBoatDetails(profile.boatDetails || {
                name: "",
                type: "",
                length: "",
                homeMarina: "",
              });
            }
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile data.",
            variant: "destructive",
          });
        }
      };
      
      loadProfileData();
    }
  }, [isLoaded, user, open]);
  
  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update user profile in Clerk
      await user.update({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
      });
      
      // Save custom data to Firebase
      if (user.id) {
        await saveUserProfile({
          userId: user.id,
          name,
          location,
          bio,
          boatDetails,
          email: user.primaryEmailAddress?.emailAddress,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
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
                  value={user?.primaryEmailAddress?.emailAddress || ""}
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
