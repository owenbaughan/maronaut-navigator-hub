
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { MapPin, Clock, Compass, Wind, Anchor, Share2, Calendar, Activity, Star, Bookmark, Award, Ship } from 'lucide-react';
import { getUserProfile } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  const { currentUser, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [sailingSince, setSailingSince] = useState<string>('');
  const [boatDetails, setBoatDetails] = useState({
    name: '',
    type: '',
    length: '',
    homeMarina: '',
  });
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isLoaded && currentUser?.uid) {
        setIsLoading(true);
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setBio(profile.bio || '');
            setLocation(profile.location || '');
            setSailingSince(profile.sailingSince || '');
            setBoatDetails(profile.boatDetails || {
              name: '',
              type: '',
              length: '',
              homeMarina: '',
            });
          } else if (currentUser.displayName) {
            // Fallback to first part of display name if profile not found
            const nameParts = currentUser.displayName.split(' ');
            setFirstName(nameParts[0] || 'Sailor');
            setLastName(nameParts.slice(1).join(' ') || '');
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, [isLoaded, currentUser]);
  
  // Get full name for display
  const fullName = `${firstName} ${lastName}`.trim() || currentUser?.displayName || 'Sailor';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maronaut-500"></div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                {/* Profile Overview Section */}
                <div className="glass-panel p-8 mb-8 relative animate-fade-in">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <img 
                        src={currentUser?.photoURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-maronaut-700 mb-2">
                        Welcome, Captain {firstName}
                      </h1>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-maronaut-600 mb-4">
                        {location && (
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            {location}
                          </div>
                        )}
                        {sailingSince && (
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            Sailing since {sailingSince}
                          </div>
                        )}
                      </div>
                      <p className="text-maronaut-600/80 max-w-xl">
                        {bio || "Track your trips, monitor weather conditions, and view your sailing statistics."}
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = "/profile"}>
                          Edit Profile Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-maronaut-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-maronaut-700">24</div>
                      <div className="text-sm text-maronaut-600">Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-maronaut-700">376</div>
                      <div className="text-sm text-maronaut-600">Nautical Miles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-maronaut-700">12</div>
                      <div className="text-sm text-maronaut-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-maronaut-700">8</div>
                      <div className="text-sm text-maronaut-600">Badges</div>
                    </div>
                  </div>
                </div>

                {/* Recent Trip Section */}
                <div className="glass-panel p-8 mb-8 animate-fade-in animate-delay-1">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-maronaut-700">
                      Recent Trip
                    </h2>
                    <button className="text-sm text-maronaut-500 hover:text-maronaut-600 font-medium">
                      View All Trips
                    </button>
                  </div>

                  <div className="p-4 bg-white rounded-xl shadow-sm border border-maronaut-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-maronaut-600">San Francisco Bay Cruise</h3>
                      <span className="text-sm text-maronaut-500">Yesterday</span>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-sm text-maronaut-600">
                        <MapPin size={16} className="mr-2 text-maronaut-500" />
                        San Francisco Bay
                      </div>
                      <div className="flex items-center text-sm text-maronaut-600">
                        <Clock size={16} className="mr-2 text-maronaut-500" />
                        3h 45m
                      </div>
                      <div className="flex items-center text-sm text-maronaut-600">
                        <Compass size={16} className="mr-2 text-maronaut-500" />
                        12.4 nm
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="flex items-center text-sm text-maronaut-500 hover:text-maronaut-600 font-medium">
                        <Share2 size={16} className="mr-2" />
                        Share Trip
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Weather Conditions */}
                  <div className="glass-panel p-6 animate-fade-in animate-delay-2">
                    <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                      Weather Conditions
                    </h2>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Wind size={24} className="mr-3 text-maronaut-500" />
                        <div>
                          <h3 className="font-medium">Wind Speed</h3>
                          <p className="text-2xl font-bold text-maronaut-600">12 knots</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Direction</h3>
                        <p className="text-2xl font-bold text-maronaut-600">SW</p>
                      </div>
                    </div>
                    <button className="w-full py-2 text-center text-maronaut-500 hover:text-maronaut-600 font-medium border-t border-maronaut-100">
                      View Detailed Forecast
                    </button>
                  </div>

                  {/* Nearby Marinas */}
                  <div className="glass-panel p-6 animate-fade-in animate-delay-3">
                    <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                      Nearby Marinas
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Anchor size={20} className="mr-3 text-maronaut-500" />
                          <span>Harbor Marina</span>
                        </div>
                        <span className="text-sm text-maronaut-500">0.8 nm</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Anchor size={20} className="mr-3 text-maronaut-500" />
                          <span>Bay Yacht Club</span>
                        </div>
                        <span className="text-sm text-maronaut-500">1.4 nm</span>
                      </div>
                    </div>
                    <button className="w-full py-2 text-center text-maronaut-500 hover:text-maronaut-600 font-medium border-t border-maronaut-100 mt-4">
                      View All Nearby
                    </button>
                  </div>
                  
                  {/* Achievements/Badges */}
                  <div className="glass-panel p-6 animate-fade-in animate-delay-4">
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
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Recent Reviews */}
                  <div className="glass-panel p-6 animate-fade-in animate-delay-5">
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
                  
                  {/* Boat Details */}
                  <div className="glass-panel p-6 animate-fade-in animate-delay-6">
                    <h2 className="text-xl font-semibold text-maronaut-700 mb-4">
                      Boat Details
                    </h2>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-maronaut-600">Boat Name</h3>
                        <p className="text-maronaut-700">{boatDetails.name || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-maronaut-600">Type</h3>
                        <p className="text-maronaut-700">{boatDetails.type || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-maronaut-600">Length</h3>
                        <p className="text-maronaut-700">{boatDetails.length || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-maronaut-600">Home Marina</h3>
                        <p className="text-maronaut-700">{boatDetails.homeMarina || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost"
                      className="w-full mt-4 py-2 text-center text-maronaut-500 hover:text-maronaut-600 font-medium border-t border-maronaut-100"
                      onClick={() => window.location.href = "/profile"}
                    >
                      Edit Boat Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
