
import React from 'react';
import { Star } from 'lucide-react';

const ReviewsSection: React.FC = () => {
  return (
    <div className="glass-panel p-6 animate-fade-in animate-delay-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-maronaut-700">
          My Reviews
        </h2>
        <button className="text-sm text-maronaut-500 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium text-maronaut-700">Sausalito Yacht Harbor</h3>
            <div className="flex items-center text-maronaut-500">
              <Star size={16} fill="currentColor" className="mr-1" />
              4.5
            </div>
          </div>
          <p className="text-sm text-maronaut-600 mb-3">
            Great facilities and friendly staff. The showers are clean and the location is perfect.
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-maronaut-500">May 18, 2023</span>
            <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
