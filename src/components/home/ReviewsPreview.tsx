
import React from 'react';
import { Star, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewCard = ({ name, location, rating, image, tags }: { 
  name: string; 
  location: string; 
  rating: number; 
  image: string;
  tags: string[];
}) => {
  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="relative rounded-xl overflow-hidden mb-4 aspect-video">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-maronaut-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              fill={i < rating ? "currentColor" : "none"} 
              className={i < rating ? "text-maronaut-500" : "text-maronaut-300"} 
            />
          ))}
          <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center text-sm text-maronaut-500">
          <MapPin size={14} className="mr-1" />
          {location}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-maronaut-700 mb-3">{name}</h3>
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
      <Link 
        to="/reviews" 
        className="mt-auto text-maronaut-500 text-sm font-medium hover:text-maronaut-600 transition-colors flex items-center"
      >
        View Details <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

const ReviewsPreview = () => {
  const reviews = [
    {
      name: "Harbor Marina & Yacht Club",
      location: "San Francisco, CA",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1587132569067-3243dd1cea34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Protected Harbor", "Full Service", "Clean Facilities"]
    },
    {
      name: "Clearwater Cove",
      location: "Key West, FL",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1623709533181-28c19382188d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Snorkeling", "Quiet Anchorage", "Crystal Water"]
    },
    {
      name: "Blue Ocean Marina",
      location: "Newport, RI",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      tags: ["Historic", "Restaurant", "Fuel Station"]
    }
  ];

  return (
    <section className="py-24 bg-maronaut-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-maronaut-100 text-maronaut-600 text-sm font-medium mb-4">
            Discover Top Locations
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-4">
            Marina & Location Reviews
          </h2>
          <p className="text-lg text-maronaut-600/80">
            Explore and share reviews of marinas, anchorages, and sailing destinations from our community of sailors.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
          
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <button className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-maronaut-200 text-maronaut-600 hover:bg-maronaut-100 transition-colors shadow-md">
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <button className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-maronaut-200 text-maronaut-600 hover:bg-maronaut-100 transition-colors shadow-md">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/reviews" className="btn-primary">
            Explore All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReviewsPreview;
