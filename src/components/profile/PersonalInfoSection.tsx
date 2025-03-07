
import React from "react";
import { User, MapPin, Calendar, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  location: string;
  bio: string;
  sailingSince: string;
  email: string | undefined;
  disabled?: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setLocation: (value: string) => void;
  setBio: (value: string) => void;
  setSailingSince: (value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  firstName,
  lastName,
  location,
  bio,
  sailingSince,
  email,
  disabled = false,
  setFirstName,
  setLastName,
  setLocation,
  setBio,
  setSailingSince,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Personal Information</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User size={16} />
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              disabled={disabled}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <User size={16} />
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
