import { useState, useEffect } from 'react';
import { Heart, Star, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { favouriteApi, Favourite } from '@/services/favouriteApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { MenuItemResponse } from '@/services/chefApi';
import { ratingApi, MenuItemRatingStats } from '@/services/ratingApi';

interface ModernFavouritesProps {
  onAddToCart: (item: MenuItemResponse) => void;
}

export const ModernFavourites = ({ onAddToCart }: ModernFavouritesProps) => {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [menuItemRatings, setMenuItemRatings] = useState<Map<number, { rating: number; count: number }>>(new Map());
  const { token } = useAuth();
  const { toast } = useToast();
  const itemsPerPage = 9;

  useEffect(() => {
    if (token) {
      loadFavourites();
      loadRatings();
    }
  }, [token]);

  const loadFavourites = async () => {
    try {
      const result = await favouriteApi.getMyFavourites();
      if (result.success && result.data) {
        setFavourites(result.data);
      }
    } catch (error) {
      console.error('Error loading favourites:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load favourites'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    if (!token) return;
    
    try {
      const result = await ratingApi.getAllRatings();
      const ratingsMap = new Map<number, { rating: number; count: number }>();
      
      result.menuItemRatings.forEach((rating: MenuItemRatingStats) => {
        ratingsMap.set(rating.menuItemId, {
          rating: rating.averageRating,
          count: rating.totalRatings
        });
      });
      
      setMenuItemRatings(ratingsMap);
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const removeFavourite = async (menuItemId: number) => {
    try {
      const result = await favouriteApi.removeFavourite(menuItemId);
      if (result.success) {
        setFavourites(prev => prev.filter(fav => fav.menuItem.id !== menuItemId));
        toast({
          title: 'Removed from favourites',
          description: 'Item removed from your favourites'
        });
      }
    } catch (error) {
      console.error('Error removing favourite:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove favourite'
      });
    }
  };

  const filteredFavourites = favourites.filter(fav =>
    fav.menuItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredFavourites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredFavourites.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Your Favourites
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Quickly reorder your most-loved dishes and culinary discoveries.
        </p>
      </div>

      {/* Search Bar - Mobile */}
      <div className="md:hidden mb-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400 w-4 h-4" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border-none bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Search your favourites..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredFavourites.length === 0 && (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {searchQuery ? 'No favourites found' : 'No favourites yet'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {searchQuery 
              ? 'Try searching with different keywords' 
              : 'Start adding your favorite dishes to see them here'}
          </p>
        </div>
      )}

      {/* Favourites Grid */}
      {currentItems.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((favourite) => (
            <div
              key={favourite.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt={favourite.menuItem.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={favourite.menuItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
                />
                <button
                  onClick={() => removeFavourite(favourite.menuItem.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full flex items-center justify-center text-primary transition-all hover:scale-110"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
                {favourite.menuItem.vegetarian && (
                  <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="text-[10px] font-bold uppercase text-white">Veg</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {favourite.menuItem.name}
                  </h3>
                  {menuItemRatings.has(favourite.menuItem.id) && menuItemRatings.get(favourite.menuItem.id)!.count > 0 ? (
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {menuItemRatings.get(favourite.menuItem.id)!.rating.toFixed(1)}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-xs font-bold">
                      <Star className="w-3 h-3" />
                      New
                    </div>
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                  {favourite.menuItem.description || 'Delicious dish prepared with fresh ingredients'}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-bold">₹{favourite.menuItem.price.toFixed(2)}</span>
                  <button
                    onClick={() => onAddToCart(favourite.menuItem)}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
