
import React from 'react';
import FeatureCard from '../ui/FeatureCard';
import { Map, Navigation, BarChart, Star, ShoppingBag, Activity } from 'lucide-react';

const FeatureSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-maronaut-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-4">
            Premium Features for Sailors
          </h2>
          <p className="text-lg text-maronaut-600/80">
            Designed with sailors in mind, Maronaut offers everything you need for a seamless experience on the water.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Navigation} 
            title="Trip Planning" 
            description="Plan detailed routes with waypoints, considering water depth, bridge clearance, and weather conditions."
            delay={1}
          />
          <FeatureCard 
            icon={Map} 
            title="Marine Charts" 
            description="Access comprehensive marine charts with detailed information for safe navigation."
            delay={2}
          />
          <FeatureCard 
            icon={Activity} 
            title="Trip Tracking" 
            description="Track your journeys with detailed metrics including speed, distance, and time on water."
            delay={3}
          />
          <FeatureCard 
            icon={Star} 
            title="Marina Reviews" 
            description="Discover and share reviews for marinas, anchorages, and nautical locations."
            delay={4}
          />
          <FeatureCard 
            icon={ShoppingBag} 
            title="Marketplace" 
            description="Find boat services, crew, and equipment in our dedicated sailing marketplace."
            delay={5}
          />
          <FeatureCard 
            icon={BarChart} 
            title="Social Sharing" 
            description="Share your sailing adventures and achievements with the community."
            delay={6}
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
