
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Info, Layout } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-md' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <NavLink to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/fad8a600-3469-4ef3-8235-248370b68c0e.png" 
            alt="Maronaut Logo" 
            className="h-10 w-auto" 
          />
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isSignedIn ? (
            // Navigation for logged-in users
            <>
              <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
              <NavLink to="/trips" className="nav-link">Trip Planning</NavLink>
              <NavLink to="/friends" className="nav-link">Friends Feed</NavLink>
              <NavLink to="/reviews" className="nav-link">Reviews</NavLink>
              <NavLink to="/marketplace" className="nav-link">Marketplace</NavLink>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            // Navigation for non-logged-in users
            <>
              <Button 
                variant="ghost" 
                className="nav-link flex items-center gap-2" 
                onClick={scrollToFeatures}
              >
                <Layout size={18} />
                Features
              </Button>
              <NavLink to="/about" className="nav-link flex items-center gap-2">
                <Info size={18} />
                About
              </NavLink>
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-maronaut-600 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {isSignedIn ? (
              // Mobile navigation for logged-in users
              <>
                <NavLink 
                  to="/dashboard" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/trips" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trip Planning
                </NavLink>
                <NavLink 
                  to="/friends" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Friends Feed
                </NavLink>
                <NavLink 
                  to="/reviews" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reviews
                </NavLink>
                <NavLink 
                  to="/marketplace" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Marketplace
                </NavLink>
                <div className="py-2 px-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              // Mobile navigation for non-logged-in users
              <>
                <Button
                  variant="ghost"
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg text-left flex items-center gap-2"
                  onClick={scrollToFeatures}
                >
                  <Layout size={18} />
                  Features
                </Button>
                <NavLink 
                  to="/about" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Info size={18} />
                  About
                </NavLink>
                <div className="flex flex-col space-y-2">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full">Sign Up</Button>
                  </SignUpButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
