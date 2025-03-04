
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Search, Filter, Star, DollarSign, MapPin, User, Tag, Calendar, Plus } from 'lucide-react';
import AddListingForm from '../components/marketplace/AddListingForm';
import { ToastProvider } from '@/components/ui/toast';
import { ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

const ListingCard = ({ title, category, price, location, seller, image, rating, tags, date }: { 
  title: string;
  category: string;
  price: string;
  location: string;
  seller: string;
  image: string;
  rating: number;
  tags: string[];
  date: string;
}) => {
  return (
    <div className="glass-panel h-full overflow-hidden flex flex-col animate-fade-in">
      <div className="h-48 relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
        <div className="absolute top-4 left-4 bg-maronaut-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          {category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-maronaut-700 line-clamp-2">{title}</h3>
          <div className="flex items-center text-base font-bold text-maronaut-700 whitespace-nowrap ml-2">
            <DollarSign size={16} className="text-maronaut-500" />
            {price}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2 text-xs">
          <div className="flex items-center text-maronaut-500">
            <MapPin size={12} className="mr-1" />
            {location}
          </div>
          <div className="flex items-center text-maronaut-500">
            <Star size={12} fill="currentColor" className="mr-1" />
            {rating.toFixed(1)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="flex items-center px-2 py-0.5 bg-maronaut-100 text-maronaut-600 text-xs rounded-full"
            >
              <Tag size={8} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-auto pt-3 border-t border-maronaut-100 flex justify-between">
          <button className="text-xs text-maronaut-500 hover:text-maronaut-600 font-medium">
            Details
          </button>
          <button className="px-3 py-1 bg-maronaut-500 text-white rounded-full text-xs font-medium">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const { toast } = useToast();
  const [radius, setRadius] = useState<number>(50);
  const [location, setLocation] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [listings, setListings] = useState([
    {
      title: "Professional Hull Cleaning Service",
      category: "Service",
      price: "150/hr",
      location: "San Francisco Bay Area",
      seller: "Bay Area Marine Services",
      image: "https://images.unsplash.com/photo-1566847438217-76e82d383f84?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 4.8,
      tags: ["Maintenance", "Cleaning", "Hull"],
      date: "Posted 2 days ago"
    },
    {
      title: "2020 J/70 Sailboat for Sale",
      category: "For Sale",
      price: "45,000",
      location: "Newport, RI",
      seller: "John's Boat Sales",
      image: "https://images.unsplash.com/photo-1543226589-02c92190a098?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 4.5,
      tags: ["Sailboat", "J/70", "Race Ready"],
      date: "Posted 5 days ago"
    },
    {
      title: "Experienced Sailing Guide for Charter",
      category: "Crew",
      price: "300/day",
      location: "Key West, FL",
      seller: "Captain Mike",
      image: "https://images.unsplash.com/photo-1534870439272-475575042274?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 4.9,
      tags: ["Guide", "Charter", "Local Expert"],
      date: "Posted 1 week ago"
    },
    {
      title: "Premium Marine Safety Equipment",
      category: "For Sale",
      price: "1,200",
      location: "Seattle, WA",
      seller: "Marine Safety Supply",
      image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 4.7,
      tags: ["Safety", "Equipment", "Life Jackets"],
      date: "Posted 3 days ago"
    },
    {
      title: "Marine Engine Repair & Maintenance",
      category: "Service",
      price: "125/hr",
      location: "Miami, FL",
      seller: "Coastal Marine Engines",
      image: "https://images.unsplash.com/photo-1553243151-0e1129d3b721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 4.6,
      tags: ["Engine", "Repair", "Maintenance"],
      date: "Posted 1 day ago"
    },
    {
      title: "Professional Sailing Instructor",
      category: "Crew",
      price: "250/day",
      location: "Annapolis, MD",
      seller: "Captain Sarah",
      image: "https://images.unsplash.com/photo-1513618827672-0d7f5e227c9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 5.0,
      tags: ["Instructor", "Lessons", "Certification"],
      date: "Posted 4 days ago"
    },
    {
      title: "Custom Yacht Interior Design",
      category: "Service",
      price: "3,500+",
      location: "San Diego, CA",
      seller: "Luxury Marine Interiors",
      image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 4.9,
      tags: ["Design", "Interior", "Custom"],
      date: "Posted 1 week ago"
    },
    {
      title: "Vintage Sailboat Equipment Collection",
      category: "For Sale",
      price: "4,800",
      location: "Portland, ME",
      seller: "Vintage Marine Collector",
      image: "https://images.unsplash.com/photo-1516571748-3a7192b19fcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      rating: 4.3,
      tags: ["Vintage", "Collectible", "Equipment"],
      date: "Posted 2 weeks ago"
    }
  ]);

  const handleAddListing = (newListing: any) => {
    setListings([newListing, ...listings]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ToastProvider>
        <main className="flex-grow pt-20">
          <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-2 animate-fade-in">
                    Sailing Marketplace
                  </h1>
                  <p className="text-lg text-maronaut-600/80 animate-fade-in animate-delay-1">
                    Find services, equipment, boats, and crew for your sailing needs.
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-maronaut-500 text-white rounded-lg hover:bg-maronaut-600 animate-fade-in"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Listing</span>
                </button>
              </div>

              {showAddForm ? (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <AddListingForm 
                    onClose={() => setShowAddForm(false)}
                    onAddListing={handleAddListing}
                  />
                </div>
              ) : (
                <>
                  <div className="glass-panel p-4 flex flex-col gap-4 mb-8 animate-fade-in animate-delay-2">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maronaut-400" />
                        <input 
                          type="text" 
                          placeholder="Search the marketplace" 
                          className="w-full pl-10 pr-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select className="px-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300 text-maronaut-600">
                          <option>All Categories</option>
                          <option>Services</option>
                          <option>For Sale</option>
                          <option>Crew</option>
                          <option>Rentals</option>
                        </select>
                        <button className="flex items-center justify-center px-4 py-2 border border-maronaut-200 rounded-lg text-maronaut-600 hover:bg-maronaut-50">
                          <Filter size={18} className="mr-2" />
                          Filters
                        </button>
                      </div>
                    </div>
                    
                    {/* Geographical radius filter */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="relative flex-1">
                        <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maronaut-400" />
                        <input 
                          type="text" 
                          placeholder="Enter your location" 
                          className="w-full pl-10 pr-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:w-auto w-full">
                        <span className="text-maronaut-600 whitespace-nowrap">Radius: {radius} miles</span>
                        <input
                          type="range"
                          min="5"
                          max="500"
                          step="5"
                          value={radius}
                          onChange={(e) => setRadius(parseInt(e.target.value))}
                          className="w-full md:w-48 accent-maronaut-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {listings.map((listing, index) => (
                      <ListingCard 
                        key={index} 
                        {...listing} 
                      />
                    ))}
                  </div>

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
                </>
              )}
            </div>
          </section>
        </main>
        <ToastViewport />
      </ToastProvider>
      <Footer />
    </div>
  );
};

export default Marketplace;
