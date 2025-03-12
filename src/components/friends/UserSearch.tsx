
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { UserSearchProps } from './types';
import SearchResultsList from './SearchResultsList';
import { useUserSearch } from '@/hooks/use-user-search';

const UserSearch: React.FC<UserSearchProps> = ({ onUserAdded }) => {
  const { currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    noResults,
    isFollowingUser,
    processingUserId,
    handleSearchInput,
    handleFollowUser
  } = useUserSearch(currentUser?.uid, onUserAdded);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Open dropdown when typing and there are results
  useEffect(() => {
    if (searchQuery && searchResults.length > 0) {
      setDropdownOpen(true);
    }
  }, [searchQuery, searchResults]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setDropdownOpen(false);
  };

  const handleViewProfile = (userId: string) => {
    // Close the dropdown
    setDropdownOpen(false);
    setSearchQuery('');
    
    // Dispatch a custom event that will be captured by the parent component
    const event = new CustomEvent('viewUserProfile', { 
      detail: { userId },
      bubbles: true // Make sure the event bubbles up through the DOM
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="relative" ref={searchInputRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-maronaut-400" />
        </div>
        <Input
          type="text"
          className="pl-10 pr-10 py-3 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
          placeholder="Search for sailors by username..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearchInput(e.target.value);
          }}
          onFocus={() => {
            if (searchQuery && searchResults.length > 0) {
              setDropdownOpen(true);
            }
          }}
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X size={18} className="text-maronaut-400 hover:text-maronaut-600" />
          </button>
        )}
      </div>

      {dropdownOpen && searchQuery && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-maronaut-200 max-h-[60vh] overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-maronaut-500">
                {isSearching 
                  ? 'Searching...' 
                  : searchResults.length > 0 
                    ? `Found ${searchResults.length} sailors matching '${searchQuery}'` 
                    : `No sailors found matching '${searchQuery}'`}
              </p>
            </div>
            <SearchResultsList
              searchResults={searchResults}
              isFollowingUser={isFollowingUser}
              processingUserId={processingUserId}
              onFollowUser={handleFollowUser}
              onViewProfile={handleViewProfile}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
