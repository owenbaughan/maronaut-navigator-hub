
import React from 'react';
import { Activity } from 'lucide-react';

const RecentTrips: React.FC = () => {
  return (
    <div className="glass-panel p-6 animate-fade-in animate-delay-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-maronaut-700">
          Recent Trips
        </h2>
        <button className="text-sm text-maronaut-500 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium text-maronaut-700">San Francisco Bay Cruise</h3>
            <div className="flex items-center text-maronaut-500">
              <Activity size={16} className="mr-1" />
              12.4 nm
            </div>
          </div>
          <p className="text-sm text-maronaut-600 mb-3">
            A beautiful day sailing around Alcatraz and under the Golden Gate Bridge.
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-maronaut-500">Jul 15, 2023</span>
            <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
              Details
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium text-maronaut-700">Half Moon Bay Overnight</h3>
            <div className="flex items-center text-maronaut-500">
              <Activity size={16} className="mr-1" />
              28.6 nm
            </div>
          </div>
          <p className="text-sm text-maronaut-600 mb-3">
            Weekend trip to Half Moon Bay with an overnight stay at the marina.
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-maronaut-500">Jun 24, 2023</span>
            <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTrips;
