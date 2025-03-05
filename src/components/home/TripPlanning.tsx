
import React from 'react';
import { Anchor, Navigation, Wind, Waves, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TripPlanning = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="max-w-lg animate-fade-in-right">
              <div className="inline-block px-4 py-1 rounded-full bg-maronaut-100 text-maronaut-600 text-sm font-medium mb-4">
                Advanced Trip Planning
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-6">
                Plan Your Perfect Sailing Journey
              </h2>
              <p className="text-lg text-maronaut-600/80 mb-8">
                Our advanced trip planning system considers water depth, bridge height, wind conditions, and other crucial factors to create the optimal route for your vessel.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-maronaut-100 text-maronaut-600 mt-1">
                    <Anchor size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-maronaut-700">Multiple Waypoints</h4>
                    <p className="text-maronaut-600/80">Set multiple stops along your journey with detailed information for each location.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-maronaut-100 text-maronaut-600 mt-1">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-maronaut-700">Intelligent Routing</h4>
                    <p className="text-maronaut-600/80">Routes automatically adjust to water depth requirements for your vessel.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-maronaut-100 text-maronaut-600 mt-1">
                    <Wind size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-maronaut-700">Wind & Weather</h4>
                    <p className="text-maronaut-600/80">Real-time wind and weather data to optimize sailing efficiency.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-maronaut-100 text-maronaut-600 mt-1">
                    <Waves size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-maronaut-700">Tide Predictions</h4>
                    <p className="text-maronaut-600/80">Accurate tide predictions to ensure safe passage through shallow areas.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/trips" className="inline-flex items-center text-maronaut-500 font-medium hover:text-maronaut-600 transition-colors">
                Start Planning Your Trip <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2 animate-fade-in-left">
            <div className="relative glass-panel p-2 max-w-xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80" 
                alt="Trip Planning Interface" 
                className="rounded-xl shadow-lg" 
              />
              <div className="absolute -top-4 -right-4 bg-maronaut-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Premium Feature
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripPlanning;
