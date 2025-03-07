
import * as React from "react";
import { useAuth } from "@/context/AuthContext";
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
import { 
  getUserProfile, 
  saveUserProfile, 
  BoatDetails, 
  validateBoatType 
} from "@/services/profileService";
import { updateProfile } from "@/lib/firebase";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate?: () => void;
}

const ProfileEditDialog = ({ open, onOpenChange, onProfileUpdate }: ProfileEditDialogProps) => {
  const { currentUser, isLoaded } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // For basic user data
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [sailingSince, setSailingSince] = React.useState("");
  
  // For custom data
  const [bio, setBio] = React.useState("");
  const [boatDetails, setBoatDetails] = React.useState<BoatDetails>({
    name: "",
    type: "",
    brand: "",
    length: "",
    homeMarina: "",
  });
  
  // Load user data when dialog opens
  React.useEffect(() => {
    if (isLoaded && currentUser && open) {
      // Load profile data from Firebase
      const loadProfileData = async () => {
        try {
          setError(null);
          if (currentUser.uid) {
            const profile = await getUserProfile(currentUser.uid);
            if (profile) {
              setFirstName(profile.firstName || "");
              setLastName(profile.lastName || "");
              setLocation(profile.location || "");
              setBio(profile.bio || "");
              setSailingSince(profile.sailingSince || "");
              setBoatDetails(profile.boatDetails || {
                name: "",
                type: "",
                brand: "",
                length: "",
                homeMarina: "",
              });
            } else {
              // Parse display name into first and last name if profile doesn't exist
              const displayName = currentUser.displayName || "";
              const nameParts = displayName.split(" ");
              setFirstName(nameParts[0] || "");
              setLastName(nameParts.slice(1).join(" ") || "");
            }
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
          setError("Failed to load profile data. Please try again.");
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile data.",
            variant: "destructive",
          });
        }
      };
      
      loadProfileData();
    }
  }, [isLoaded, currentUser, open]);
  
  const handleSave = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Validate boat type
      if (boatDetails.type && !validateBoatType(boatDetails.type)) {
        setError("Boat type must be one of: catamaran, sailboat, or motorboat");
        setLoading(false);
        return;
      }
      
      // Update display name in Firebase Auth
      const fullName = `${firstName} ${lastName}`.trim();
      await updateProfile(currentUser, {
        displayName: fullName
      });
      
      // Save custom data to Firestore
      if (currentUser.uid) {
        const userProfile = await getUserProfile(currentUser.uid);
        
        await saveUserProfile({
          userId: currentUser.uid,
          firstName,
          lastName,
          location,
          bio,
          sailingSince,
          boatDetails,
          email: currentUser.email || undefined,
          createdAt: userProfile?.createdAt || new Date(),
          updatedAt: new Date(),
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update profile", error);
      setError(error.message || "Failed to update profile. Please try again.");
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
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User size={16} />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
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
                  <Ship size={16} />
                  Sailing Since
                </Label>
                <Input
                  id="sailingSince"
                  value={sailingSince}
                  onChange={(e) => setSailingSince(e.target.value)}
                  placeholder="e.g. 2015"
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
                <Select 
                  value={boatDetails.type} 
                  onValueChange={(value) => setBoatDetails(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select boat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="catamaran">Catamaran</SelectItem>
                    <SelectItem value="sailboat">Sailboat</SelectItem>
                    <SelectItem value="motorboat">Motorboat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="boatBrand">
                  Brand / Model
                </Label>
                <Input
                  id="boatBrand"
                  value={boatDetails.brand}
                  onChange={(e) => setBoatDetails(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Brand and model"
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
