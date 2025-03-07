
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { MapPin, Clock, Compass, Wind, Anchor, Share2 } from 'lucide-react';
import { getUserProfile, UserProfile } from '@/services/profileService';

const Dashboard = () => {
  const { currentUser, isLoaded, isSignedIn } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (isLoaded && isSignedIn && currentUser) {
        try {
          setIsLoading(true);
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            console.log("Dashboard: Profile data loaded:", profile);
            setProfileData(profile);
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isLoaded, isSignedIn, currentUser]);

  // Get the greeting with the user's first name
  const getGreeting = () => {
    if (profileData?.firstName) {
      return `Welcome back, Captain ${profileData.firstName}`;
    } else if (currentUser?.displayName) {
      // Fallback to display name if profile not loaded
      const firstName = currentUser.displayName.split(' ')[0];
      return `Welcome back, Captain ${firstName}`;
    }
    return "Welcome back, Captain";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-6 animate-fade-in">
                {isLoading ? "Loading..." : getGreeting()}
              </h1>
              <p className="text-lg text-maronaut-600/80 mb-8 animate-fade-in animate-delay-1">
                Track your trips, monitor weather conditions, and view your sailing statistics.
              </p>

              <div className="glass-panel p-8 mb-8 animate-fade-in animate-delay-2">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="glass-panel p-6 animate-fade-in animate-delay-3">
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

                <div className="glass-panel p-6 animate-fade-in animate-delay-4">
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
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
