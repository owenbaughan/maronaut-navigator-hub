
import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Anchor, Ship } from 'lucide-react';

const About = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-maronaut-700 mb-6 animate-fade-in flex items-center">
                <Ship className="mr-3 text-maronaut-500" size={32} />
                About Maronaut
              </h1>
              
              <div className="mb-12 bg-white p-8 rounded-2xl shadow-xl animate-fade-in animate-delay-1">
                <h2 className="text-2xl font-semibold text-maronaut-600 mb-4 flex items-center">
                  <Anchor className="mr-2 text-maronaut-500" />
                  Our Mission
                </h2>
                <div className="prose prose-lg text-maronaut-600">
                  <p className="mb-6">
                    At Maronaut, our name reflects our purpose: exploration and connection on the water. 
                    Inspired by the Spanish word "Mar" meaning "sea," and the Latin word "Naut" 
                    meaning "sailor" or "navigator," Maronaut embodies the spirit of those who seek 
                    adventure and innovation in the maritime world.
                  </p>
                  <p>
                    We are committed to empowering sailors, explorers, and marine enthusiasts with 
                    tools and community-driven features that enhance every aspect of their journeys, 
                    whether navigating new waters or sharing stories with fellow adventurers.
                  </p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-maronaut-700 mb-8 animate-fade-in animate-delay-2">
                Meet Our Co-Founders
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 animate-fade-in animate-delay-3">
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden rounded-xl mb-4">
                    <img 
                      src="/lovable-uploads/34772c51-7e57-4aa5-a7a6-3c28b820245a.png" 
                      alt="Owen Baughan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-maronaut-700 mb-1">Owen Baughan</h3>
                  <p className="text-maronaut-500 font-medium mb-3">Co-Founder & CEO</p>
                  <p className="text-maronaut-600">
                    Owen combines his passion for sailing with his expertise in technology to lead Maronaut's 
                    vision of transforming the maritime experience. With a background in both nautical 
                    navigation and software development, Owen brings a unique perspective to 
                    building tools that sailors truly need.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden rounded-xl mb-4">
                    <img 
                      src="/lovable-uploads/e9a79a88-6ff4-4b4e-b526-5f14758d1e99.png" 
                      alt="Robert Davis" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-maronaut-700 mb-1">Robert Davis</h3>
                  <p className="text-maronaut-500 font-medium mb-3">Co-Founder & CTO</p>
                  <p className="text-maronaut-600">
                    Robert brings extensive experience in maritime navigation systems and software engineering
                    to Maronaut. His innovative approach to solving complex technical challenges ensures that
                    our platform delivers powerful features while maintaining an intuitive user experience
                    for sailors of all experience levels.
                  </p>
                </div>
              </div>
              
              <div className="mt-16 text-center animate-fade-in animate-delay-4">
                <p className="text-maronaut-600 italic">
                  "We built Maronaut to be the companion we always wished we had on our own sailing adventures."
                </p>
                <p className="text-maronaut-500 mt-2">— Owen & Robert</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
