
import React from 'react';
import { Anchor } from 'lucide-react';

const FavoriteMarinas: React.FC = () => {
  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
        Favorite Marinas
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Anchor size={20} className="mr-3 text-maronaut-500" />
            <span>Harbor Marina</span>
          </div>
          <span className="text-sm text-maronaut-500">Visited 3 times</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Anchor size={20} className="mr-3 text-maronaut-500" />
            <span>Bay Yacht Club</span>
          </div>
          <span className="text-sm text-maronaut-500">Visited 2 times</span>
        </div>
      </div>
    </div>
  );
};

export default FavoriteMarinas;
