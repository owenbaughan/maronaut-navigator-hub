
import * as React from "react";
import { Ship } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BoatDetails } from "@/services/profileService";

interface BoatDetailsSectionProps {
  boatDetails: BoatDetails;
  setBoatDetails: (boatDetails: BoatDetails) => void;
}

const BoatDetailsSection: React.FC<BoatDetailsSectionProps> = ({
  boatDetails,
  setBoatDetails
}) => {
  // Helper function to update a single field
  const updateField = (field: keyof BoatDetails, value: string) => {
    setBoatDetails({
      ...boatDetails,
      [field]: value
    });
  };

  return (
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
            onChange={(e) => updateField('name', e.target.value)}
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
            onChange={(e) => updateField('type', e.target.value)}
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
            onChange={(e) => updateField('length', e.target.value)}
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
            onChange={(e) => updateField('homeMarina', e.target.value)}
            placeholder="Where your boat is based"
          />
        </div>
      </div>
    </div>
  );
};

export default BoatDetailsSection;
