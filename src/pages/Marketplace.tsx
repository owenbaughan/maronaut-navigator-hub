
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Search, Filter, Star, DollarSign, MapPin, User, Tag, Calendar } from 'lucide-react';

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
    <div className="glass-panel overflow-hidden flex flex-col md:flex-row animate-fade-in">
      <div className="md:w-1/3 h-48 md:h-auto relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
        <div className="absolute top-4 left-4 bg-maronaut-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          {category}
        </div>
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-maronaut-700">{title}</h3>
          <div className="flex items-center text-lg font-bold text-maronaut-700">
            <DollarSign size={18} className="text-maronaut-500" />
            {price}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center text-maronaut-500">
            <MapPin size={14} className="mr-1" />
            {location}
          </div>
          <div className="flex items-center text-maronaut-500">
            <User size={14} className="mr-1" />
            {seller}
          </div>
          <div className="flex items-center text-maronaut-500">
            <Star size={14} fill="currentColor" className="mr-1" />
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center text-maronaut-500">
            <Calendar size={14} className="mr-1" />
            {date}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="flex items-center px-2 py-1 bg-maronaut-100 text-maronaut-600 text-xs rounded-full"
            >
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between mt-4 pt-4 border-t border-maronaut-100">
          <button className="text-maronaut-500 hover:text-maronaut-600 font-medium">
            View Details
          </button>
          <button className="px-4 py-1 bg-maronaut-500 text-white rounded-full text-sm font-medium">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const listings = [
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
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-2 animate-fade-in">
              Sailing Marketplace
            </h1>
            <p className="text-lg text-maronaut-600/80 mb-8 animate-fade-in animate-delay-1">
              Find services, equipment, boats, and crew for your sailing needs.
            </p>

            <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 mb-8 animate-fade-in animate-delay-2">
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

            <div className="space-y-8 mb-12">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
