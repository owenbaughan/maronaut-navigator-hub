
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Activity, Award, Star, Bookmark, LogOut, Ship } from 'lucide-react';
import EditProfileForm from '../components/profile/EditProfileForm';
import ProfileDisplay from '../components/profile/ProfileDisplay';
import BoatDetails from '../components/profile/BoatDetails';

const Profile = () => {
  const { user, isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="glass-panel p-8 mb-8 relative animate-fade-in">
                {isSignedIn && <EditProfileForm />}
                <ProfileDisplay />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div className="glass-panel p-6 animate-fade-in animate-delay-1">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-maronaut-700">
                        Recent Trips
                      </h2>
                      <button className="text-sm text-maronaut-500 font-medium">
                        View All
                      </button>
                    </div>
                    
                    {isSignedIn ? (
                      <div className="text-center py-8 text-maronaut-500">
                        No trips added yet. Plan your first sailing adventure!
                      </div>
                    ) : (
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
                    )}
                  </div>
                  
                  <div className="glass-panel p-6 animate-fade-in animate-delay-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-maronaut-700">
                        My Reviews
                      </h2>
                      <button className="text-sm text-maronaut-500 font-medium">
                        View All
                      </button>
                    </div>
                    
                    {isSignedIn ? (
                      <div className="text-center py-8 text-maronaut-500">
                        No reviews yet. Share your experiences with the community!
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="glass-panel p-6 animate-fade-in animate-delay-3">
                    <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                      Achievements
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
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
                      
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
                          <Star size={28} />
                        </div>
                        <span className="text-sm text-center text-maronaut-600">10 Reviews</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-maronaut-100 flex items-center justify-center text-maronaut-500 mb-2">
                          <Bookmark size={28} />
                        </div>
                        <span className="text-sm text-center text-maronaut-600">5 Harbors</span>
                      </div>
                    </div>
                  </div>
                  
                  <BoatDetails />
                  
                  {isSignedIn && (
                    <button className="w-full p-3 text-center flex items-center justify-center text-red-500 hover:text-red-600 font-medium glass-panel animate-fade-in animate-delay-5">
                      <LogOut size={18} className="mr-2" />
                      Sign Out
                    </button>
                  )}
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

export default Profile;
