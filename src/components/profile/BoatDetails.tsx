
import React from 'react';
import { useUser } from '@clerk/clerk-react';

const BoatDetails = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const boatData = {
    boatName: user.unsafeMetadata?.boatName as string || 'Not set',
    boatType: user.unsafeMetadata?.boatType as string || 'Not set',
    boatLength: user.unsafeMetadata?.boatLength as string || 'Not set',
    homeMarina: user.unsafeMetadata?.homeMarina as string || 'Not set',
  };

  return (
    <div className="glass-panel p-6 animate-fade-in animate-delay-4">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
        Boat Details
      </h2>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-maronaut-600">Boat Name</h3>
          <p className="text-maronaut-700">{boatData.boatName}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-maronaut-600">Type</h3>
          <p className="text-maronaut-700">{boatData.boatType}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-maronaut-600">Length</h3>
          <p className="text-maronaut-700">{boatData.boatLength}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-maronaut-600">Home Marina</h3>
          <p className="text-maronaut-700">{boatData.homeMarina}</p>
        </div>
      </div>
    </div>
  );
};

export default BoatDetails;
