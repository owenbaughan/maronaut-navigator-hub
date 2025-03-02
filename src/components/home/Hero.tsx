
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80')",
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-maronaut-600/40 via-maronaut-600/30 to-background"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <img 
            src="/lovable-uploads/fad8a600-3469-4ef3-8235-248370b68c0e.png" 
            alt="Maronaut Logo" 
            className="h-24 md:h-32 mx-auto mb-6 animate-fade-in" 
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in animate-delay-1">
            Navigate Your Sailing Journey
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in animate-delay-2">
            Your complete companion for planning trips, tracking journeys, finding services and connecting with the sailing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-3">
            <Link to="/trips" className="btn-primary">
              Plan Your Trip
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={scrollToFeatures}
      >
        <ChevronDown className="text-white h-8 w-8" />
      </div>
    </section>
  );
};

export default Hero;
