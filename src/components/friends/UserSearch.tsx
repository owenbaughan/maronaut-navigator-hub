
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { UserSearchProps } from './types';
import SearchResultsList from './SearchResultsList';
import { useUserSearch } from '@/hooks/use-user-search';

const UserSearch: React.FC<UserSearchProps> = ({ onUserAdded }) => {
  const { currentUser } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    noResults,
    isFollowingUser,
    processingUserId,
    handleSearch,
    handleFollowUser
  } = useUserSearch(currentUser?.uid, onUserAdded);

  return (
    <>
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-maronaut-400" />
        </div>
        <Input
          type="text"
          className="pl-10 pr-4 py-3 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
          placeholder="Search for sailors by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 bg-maronaut-500 text-white rounded-r-lg hover:bg-maronaut-600 transition-colors"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
            <DialogDescription>
              {searchResults.length > 0 
                ? `Found ${searchResults.length} sailors matching '${searchQuery}'` 
                : `No sailors found matching '${searchQuery}'`}
            </DialogDescription>
          </DialogHeader>
          
          <SearchResultsList
            searchResults={searchResults}
            isFollowingUser={isFollowingUser}
            processingUserId={processingUserId}
            onFollowUser={handleFollowUser}
            searchQuery={searchQuery}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSearch;
