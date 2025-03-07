
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <img 
              src="/lovable-uploads/fad8a600-3469-4ef3-8235-248370b68c0e.png" 
              alt="Maronaut Logo" 
              className="h-12 w-auto mb-4" 
            />
            <p className="text-gray-300 mb-4">
              The ultimate companion app for sailors and boating enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/trips" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Trip Planning
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Tracking
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Navigation Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/marketplace-policy" className="text-gray-300 hover:text-maronaut-300 transition-colors">
                  Marketplace Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Maronaut. All rights reserved.
          </p>
          <p className="flex items-center justify-center mt-2 text-sm text-gray-400">
            Made with <Heart size={14} className="mx-1 text-red-400" /> for sailors around the world
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
