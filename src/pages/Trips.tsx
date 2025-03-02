
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Plus, MapPin, Anchor, Wind, Waves, Navigation } from 'lucide-react';

const Trips = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-2 animate-fade-in">
                  Trip Planning
                </h1>
                <p className="text-lg text-maronaut-600/80 animate-fade-in animate-delay-1">
                  Plan and track your sailing journeys with precision.
                </p>
              </div>
              <button className="btn-primary flex items-center animate-fade-in animate-delay-2">
                <Plus size={20} className="mr-2" />
                New Trip
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="glass-panel p-4 h-[500px] relative animate-fade-in animate-delay-2">
                  <div className="absolute inset-0 m-4 rounded-xl bg-maronaut-100 flex items-center justify-center">
                    <div className="text-center">
                      <Navigation size={48} className="mx-auto mb-4 text-maronaut-500" />
                      <h3 className="text-xl font-semibold text-maronaut-700 mb-2">Interactive Map</h3>
                      <p className="text-maronaut-600/80 max-w-md mx-auto">
                        Marine charts with depth contours, navigation aids, and interactive route planning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-panel p-6 animate-fade-in animate-delay-3">
                  <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                    Trip Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-maronaut-600 mb-1">
                        Trip Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter trip name"
                        className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-maronaut-600 mb-1">
                          Start Date
                        </label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-maronaut-600 mb-1">
                          Start Time
                        </label>
                        <input 
                          type="time" 
                          className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 animate-fade-in animate-delay-4">
                  <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                    Waypoints
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-maronaut-100 text-maronaut-600">
                        <MapPin size={18} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-maronaut-600 mb-1">
                          Starting Point
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter location"
                          className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-maronaut-100 text-maronaut-600">
                        <Anchor size={18} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-maronaut-600 mb-1">
                          Destination
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter destination"
                          className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                        />
                      </div>
                    </div>
                    <button className="text-sm text-maronaut-500 hover:text-maronaut-600 font-medium">
                      + Add Waypoint
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6 animate-fade-in animate-delay-5">
                  <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                    Conditions
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Wind size={18} className="text-maronaut-500" />
                      <div>
                        <h3 className="text-sm font-medium">Wind</h3>
                        <p className="text-maronaut-600">8-12 knots SW</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Waves size={18} className="text-maronaut-500" />
                      <div>
                        <h3 className="text-sm font-medium">Tide</h3>
                        <p className="text-maronaut-600">High at 14:30</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Trips;
