
import React from 'react';
import { Award, Ship } from 'lucide-react';

const Achievements: React.FC = () => {
  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
        Achievements
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
            <Award size={28} />
          </div>
          <span className="text-sm text-center text-maronaut-600">First Voyage</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
            <Ship size={28} />
          </div>
          <span className="text-sm text-center text-maronaut-600">100nm Club</span>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
