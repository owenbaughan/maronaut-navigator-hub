
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isSignedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleFeaturesClick = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToFeatures: true } });
    } else {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Effect to handle scrolling to features when navigating from another page
  useEffect(() => {
    if (location.state?.scrollToFeatures) {
      // Small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        // Clear the state to avoid scrolling on future navigations
        window.history.replaceState({}, document.title);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Get initials for avatar
  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
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
              <NavLink to="/friends" className="nav-link">Social Feed</NavLink>
              <NavLink to="/reviews" className="nav-link">Reviews</NavLink>
              <NavLink to="/marketplace" className="nav-link">Marketplace</NavLink>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={currentUser?.photoURL || undefined} 
                        alt={currentUser?.displayName || "User"} 
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Navigation for non-logged-in users
            <>
              <button 
                className="nav-link" 
                onClick={handleFeaturesClick}
              >
                Features
              </button>
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
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
                  Social Feed
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
                <NavLink 
                  to="/profile" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg text-left"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              // Mobile navigation for non-logged-in users
              <>
                <button
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg text-left"
                  onClick={handleFeaturesClick}
                >
                  Features
                </button>
                <NavLink 
                  to="/about" 
                  className="block py-2 px-4 text-maronaut-600 hover:bg-maronaut-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      navigate('/signin');
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
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
