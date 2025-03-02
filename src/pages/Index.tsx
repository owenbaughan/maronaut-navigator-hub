
import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeatureSection from '../components/home/FeatureSection';
import TripPlanning from '../components/home/TripPlanning';
import ReviewsPreview from '../components/home/ReviewsPreview';
import MarketplacePreview from '../components/home/MarketplacePreview';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeatureSection />
        <TripPlanning />
        <ReviewsPreview />
        <MarketplacePreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
