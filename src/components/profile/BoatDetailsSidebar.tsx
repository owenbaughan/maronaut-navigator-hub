
import React from 'react';
import { Button } from '@/components/ui/button';
import { BoatDetails } from '@/services/profileService';

interface BoatDetailsSidebarProps {
  boatDetails: BoatDetails;
  onEditClick: () => void;
}

const BoatDetailsSidebar: React.FC<BoatDetailsSidebarProps> = ({ boatDetails, onEditClick }) => {
  return (
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
        onClick={onEditClick}
      >
        Edit Boat Details
      </Button>
    </div>
  );
};

export default BoatDetailsSidebar;
