import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeatureSection from '../components/home/FeatureSection';
import TripPlanning from '../components/home/TripPlanning';
import ReviewsPreview from '../components/home/ReviewsPreview';
import MarketplacePreview from '../components/home/MarketplacePreview';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const FriendsFeedPreview = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-maronaut-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-3 animate-fade-in">
                Connect with Fellow Sailors
              </h2>
              <p className="text-maronaut-600 max-w-lg animate-fade-in animate-delay-1">
                Follow your friends' sailing adventures, share your own journeys, and build your sailing community.
              </p>
            </div>
            <Link to="/friends" className="btn-primary mt-4 md:mt-0 flex items-center animate-fade-in animate-delay-2">
              <Users size={18} className="mr-2" />
              Explore Social Feed
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl animate-fade-in animate-delay-2">
            <div className="aspect-video overflow-hidden rounded-xl bg-maronaut-100 relative">
              <img 
                src="https://images.unsplash.com/photo-1565772838491-cbabdab3692a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Friends sailing trip" 
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-white/90 rounded-xl max-w-md">
                  <h3 className="text-xl font-bold text-maronaut-700 mb-2">Share Your Sailing Journey</h3>
                  <p className="text-maronaut-600 mb-4">See what your friends are up to, comment on their trips, and get inspired for your next adventure.</p>
                  <Link to="/friends" className="btn-primary inline-flex items-center">
                    <Users size={18} className="mr-2" />
                    View Social Feed
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Check if we should scroll to features section
    if (location.state?.scrollToFeatures) {
      const timer = setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        // Clear the state to avoid scrolling on future navigations
        window.history.replaceState({}, document.title);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeatureSection />
        <TripPlanning />
        <FriendsFeedPreview />
        <ReviewsPreview />
        <MarketplacePreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
