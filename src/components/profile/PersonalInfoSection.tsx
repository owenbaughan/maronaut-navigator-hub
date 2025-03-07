
import * as React from "react";
import { User, Mail, MapPin, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/services/profileService";

interface PersonalInfoSectionProps {
  name: string;
  setName: (name: string) => void;
  email: string | null | undefined;
  location: string;
  setLocation: (location: string) => void;
  sailingSince: string;
  setSailingSince: (sailingSince: string) => void;
  bio: string;
  setBio: (bio: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  name,
  setName,
  email,
  location,
  setLocation,
  sailingSince,
  setSailingSince,
  bio,
  setBio
}) => {
  return (
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
            value={email || ""}
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
  );
};

export default PersonalInfoSection;
