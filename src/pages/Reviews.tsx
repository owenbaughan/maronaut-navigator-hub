
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Star, MapPin, Search, Filter, Plus, Navigation, Users, Locate } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewCard = ({ name, location, rating, image, tags, description, reviewCount }: { 
  name: string; 
  location: string; 
  rating: number; 
  image: string;
  tags: string[];
  description: string;
  reviewCount: number;
}) => {
  return (
    <div className="glass-panel overflow-hidden animate-fade-in">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
          <Star size={16} fill="currentColor" className="text-maronaut-500 mr-1" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <div className="flex items-center ml-2 text-maronaut-500 text-xs border-l border-maronaut-200 pl-2">
            <Users size={12} className="mr-1" />
            {reviewCount}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-maronaut-500 mb-2">
          <MapPin size={14} className="mr-1" />
          {location}
        </div>
        <h3 className="text-xl font-semibold text-maronaut-700 mb-3">{name}</h3>
        <p className="text-maronaut-600/80 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-maronaut-100 text-maronaut-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between border-t border-maronaut-100 mt-4 pt-4">
          <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
            View Details
          </button>
          <Link 
            to={`/trips?destination=${encodeURIComponent(name)}&location=${encodeURIComponent(location)}`}
            className="text-maronaut-500 hover:text-maronaut-600 font-medium flex items-center"
            title="Plan a trip to this location"
          >
            <Navigation size={16} className="mr-1" /> Plan Trip
          </Link>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  const [radiusFilter, setRadiusFilter] = useState<number>(50);
  
  const reviews = [
    {
      name: "Harbor Marina & Yacht Club",
      location: "San Francisco, CA",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1587132569067-3243dd1cea34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Protected Harbor", "Full Service", "Clean Facilities"],
      description: "Excellent marina with full amenities, including power, water, and clean restrooms. Staff is always helpful and friendly.",
      reviewCount: 42,
      distance: 12
    },
    {
      name: "Clearwater Cove",
      location: "Key West, FL",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1623709533181-28c19382188d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Snorkeling", "Quiet Anchorage", "Crystal Water"],
      description: "Beautiful protected anchorage with crystal clear water. Perfect for overnight stays and swimming.",
      reviewCount: 27,
      distance: 320
    },
    {
      name: "Blue Ocean Marina",
      location: "Newport, RI",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Historic", "Restaurant", "Fuel Station"],
      description: "Historic marina with great restaurant on site. Fuel station is convenient and staff is knowledgeable.",
      reviewCount: 18,
      distance: 42
    },
    {
      name: "Sailor's Rest Marina",
      location: "Seattle, WA",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1559631526-5716df3cf317?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Transient Slips", "Laundry", "Ship Store"],
      description: "Modern marina with excellent facilities. The ship store is well-stocked and the staff is very helpful.",
      reviewCount: 35,
      distance: 105
    },
    {
      name: "Sunset Bay Anchorage",
      location: "San Diego, CA",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Beautiful Sunset", "Protected", "Clean Water"],
      description: "Gorgeous anchorage with stunning sunset views. Well protected from swells and winds.",
      reviewCount: 22,
      distance: 28
    },
    {
      name: "Harbor Lights Marina",
      location: "Miami, FL",
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1505245208761-ba872912fac0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Nightlife", "Restaurants", "Shopping"],
      description: "Great location near restaurants and shopping. Perfect for those looking to explore the city.",
      reviewCount: 15,
      distance: 245
    }
  ];

  // Filter reviews based on radius
  const filteredReviews = reviews.filter(review => review.distance <= radiusFilter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-2 animate-fade-in">
                  Marina & Location Reviews
                </h1>
                <p className="text-lg text-maronaut-600/80 animate-fade-in animate-delay-1">
                  Discover and share reviews of marinas, anchorages, and sailing destinations.
                </p>
              </div>
              <button className="btn-primary flex items-center animate-fade-in animate-delay-2">
                <Plus size={20} className="mr-2" />
                Add Review
              </button>
            </div>

            <div className="glass-panel p-4 md:p-6 flex flex-col md:flex-row gap-4 mb-8 animate-fade-in animate-delay-2">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maronaut-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or location" 
                  className="w-full pl-10 pr-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-maronaut-200 rounded-lg">
                  <Locate size={18} className="text-maronaut-500" />
                  <div className="flex flex-col w-full">
                    <label htmlFor="radius" className="text-xs text-maronaut-600 mb-1">
                      Distance: {radiusFilter} miles
                    </label>
                    <input
                      id="radius"
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={radiusFilter}
                      onChange={(e) => setRadiusFilter(Number(e.target.value))}
                      className="w-full h-1 bg-maronaut-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                <button className="flex items-center justify-center px-4 py-2 border border-maronaut-200 rounded-lg text-maronaut-600 hover:bg-maronaut-50">
                  <Filter size={18} className="mr-2" />
                  Filters
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredReviews.map((review, index) => (
                <ReviewCard 
                  key={index} 
                  name={review.name}
                  location={review.location}
                  rating={review.rating}
                  image={review.image}
                  tags={review.tags}
                  description={review.description}
                  reviewCount={review.reviewCount}
                />
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-10">
                <p className="text-lg text-maronaut-600/80">
                  No locations found within {radiusFilter} miles. Try increasing your search radius.
                </p>
              </div>
            )}

            {filteredReviews.length > 0 && (
              <div className="flex justify-center">
                <div className="glass-panel p-2 inline-flex">
                  <button className="px-4 py-2 text-maronaut-600 hover:bg-maronaut-100 rounded-lg">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-maronaut-500 text-white rounded-lg mx-1">
                    1
                  </button>
                  <button className="px-4 py-2 text-maronaut-600 hover:bg-maronaut-100 rounded-lg mx-1">
                    2
                  </button>
                  <button className="px-4 py-2 text-maronaut-600 hover:bg-maronaut-100 rounded-lg mx-1">
                    3
                  </button>
                  <button className="px-4 py-2 text-maronaut-600 hover:bg-maronaut-100 rounded-lg">
                    Next
                  </button>
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

export default Reviews;
