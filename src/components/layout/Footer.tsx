
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-maronaut-600 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <img 
              src="/lovable-uploads/fad8a600-3469-4ef3-8235-248370b68c0e.png" 
              alt="Maronaut Logo" 
              className="h-12 w-auto mb-4" 
            />
            <p className="text-maronaut-100 mb-4">
              The ultimate companion app for sailors and boating enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-maronaut-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-maronaut-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-maronaut-300 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/trips" className="text-maronaut-100 hover:text-white transition-colors">
                  Trip Planning
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-maronaut-100 hover:text-white transition-colors">
                  Tracking
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-maronaut-100 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-maronaut-100 hover:text-white transition-colors">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-maronaut-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-maronaut-100 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-maronaut-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-maronaut-100 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-maronaut-100 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-maronaut-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-maronaut-100 hover:text-white transition-colors">
                  Navigation Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/marketplace-policy" className="text-maronaut-100 hover:text-white transition-colors">
                  Marketplace Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-maronaut-500 pt-8 mt-8 text-center">
          <p className="text-maronaut-200 text-sm">
            &copy; {new Date().getFullYear()} Maronaut. All rights reserved.
          </p>
          <p className="flex items-center justify-center mt-2 text-sm text-maronaut-200">
            Made with <Heart size={14} className="mx-1 text-red-400" /> for sailors around the world
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
