
import React from 'react';

interface BoatDetailsProps {
  boatDetails: {
    name?: string;
    type?: string;
    length?: string;
    homeMarina?: string;
  } | undefined;
}

const BoatDetails: React.FC<BoatDetailsProps> = ({ boatDetails }) => {
  if (!boatDetails || !Object.values(boatDetails).some(val => val)) {
    return null;
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
        Boat Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boatDetails.name && (
          <div>
            <h3 className="text-sm font-medium text-maronaut-600">Boat Name</h3>
            <p className="text-maronaut-700">{boatDetails.name}</p>
          </div>
        )}
        
        {boatDetails.type && (
          <div>
            <h3 className="text-sm font-medium text-maronaut-600">Type</h3>
            <p className="text-maronaut-700">{boatDetails.type}</p>
          </div>
        )}
        
        {boatDetails.length && (
          <div>
            <h3 className="text-sm font-medium text-maronaut-600">Length</h3>
            <p className="text-maronaut-700">{boatDetails.length}</p>
          </div>
        )}
        
        {boatDetails.homeMarina && (
          <div>
            <h3 className="text-sm font-medium text-maronaut-600">Home Marina</h3>
            <p className="text-maronaut-700">{boatDetails.homeMarina}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoatDetails;
