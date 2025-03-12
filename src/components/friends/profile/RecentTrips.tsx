
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

const RecentTrips: React.FC = () => {
  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
        Recent Trips
      </h2>
      <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-maronaut-600">San Francisco Bay Cruise</h3>
          <span className="text-sm text-maronaut-500">3 days ago</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center text-sm text-maronaut-600">
            <MapPin size={16} className="mr-2 text-maronaut-500" />
            San Francisco Bay
          </div>
          <div className="flex items-center text-sm text-maronaut-600">
            <Calendar size={16} className="mr-2 text-maronaut-500" />
            3h 45m
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTrips;
