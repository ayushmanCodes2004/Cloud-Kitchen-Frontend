import { useState, useEffect, useRef } from 'react';
import { Heart, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { menuApi } from '@/services/menuApi';
import { MenuItemResponse } from '@/services/chefApi';
import { useToast } from '@/components/ui/use-toast';
import { aiApi, MenuItem } from '@/services/aiApi';
import { favouriteApi } from '@/services/favouriteApi';
import { useAuth } from '@/contexts/AuthContext';
import { ratingApi, MenuItemRatingStats } from '@/services/ratingApi';

interface ModernMenuGridProps {
  onAddToCart: (item: MenuItemResponse) => void;
  searchQuery?: string;
}

export const ModernMenuGrid = ({ onAddToCart, searchQuery = '' }: ModernMenuGridProps) => {
  const [menuItems, setMenuItems] = useState<MenuItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All Dishes"]);
  const [selectedCategory, setSelectedCategory] = useState("All Dishes");
  const [aiRecommendations, setAiRecommendations] = useState<MenuItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [favouriteItems, setFavouriteItems] = useState<Set<number>>(new Set());
  const [menuItemRatings, setMenuItemRatings] = useState<Map<number, { rating: number; count: number }>>(new Map());
  const itemsPerPage = 9;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    loadMenuItems();
    loadAIRecommendations();
    if (token) {
      loadFavourites();
      loadRatings();
    }
  }, [token]);

  const loadMenuItems = async () => {
    try {
      const result = await menuApi.getAllMenuItems();
      if (result.success && result.data) {
        setMenuItems(result.data);
        
        // Extract unique categories from menu items
        const uniqueCategories = Array.from(
          new Set(result.data.map(item => item.category).filter(Boolean))
        ).sort();
        
        // Format categories: replace underscores with spaces and capitalize properly
        const formattedCategories = uniqueCategories.map(cat => 
          cat.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
        );
        
        // Add "All Dishes" at the beginning
        setCategories(["All Dishes", ...formattedCategories]);
      }
    } catch (error) {
      console.error('Error loading menu:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load menu items'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAIRecommendations = async () => {
    try {
      const result = await aiApi.getSuggestedCombinations(3);
      if (result.success && result.items) {
        setAiRecommendations(result.items);
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const loadFavourites = async () => {
    if (!token) return;
    
    try {
      const result = await favouriteApi.getFavouriteIds();
      if (result.success && result.data) {
        const favouriteIds = new Set(result.data);
        setFavouriteItems(favouriteIds);
      }
    } catch (error) {
      console.error('Error loading favourites:', error);
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

  const toggleFavourite = async (menuItemId: number) => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please login to add items to favourites'
      });
      return;
    }

    const isFavourite = favouriteItems.has(menuItemId);

    try {
      if (isFavourite) {
        const result = await favouriteApi.removeFavourite(menuItemId);
        if (result.success) {
          setFavouriteItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(menuItemId);
            return newSet;
          });
          toast({
            title: 'Removed from favourites',
            description: 'Item removed from your favourites'
          });
        }
      } else {
        const result = await favouriteApi.addFavourite(menuItemId);
        if (result.success) {
          setFavouriteItems(prev => new Set(prev).add(menuItemId));
          toast({
            title: 'Added to favourites',
            description: 'Item added to your favourites'
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update favourites'
      });
    }
  };

  const scrollToNext = () => {
    if (!scrollContainerRef.current || aiRecommendations.length === 0) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.scrollWidth / aiRecommendations.length;
    const nextIndex = (currentScrollIndex + 1) % aiRecommendations.length;
    
    container.scrollTo({
      left: cardWidth * nextIndex,
      behavior: 'smooth'
    });
    
    setCurrentScrollIndex(nextIndex);
  };

  const scrollToPrev = () => {
    if (!scrollContainerRef.current || aiRecommendations.length === 0) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.scrollWidth / aiRecommendations.length;
    const prevIndex = currentScrollIndex === 0 ? aiRecommendations.length - 1 : currentScrollIndex - 1;
    
    container.scrollTo({
      left: cardWidth * prevIndex,
      behavior: 'smooth'
    });
    
    setCurrentScrollIndex(prevIndex);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    // Format the item category for comparison (replace underscores with spaces and capitalize)
    const formattedItemCategory = item.category.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    const matchesCategory = selectedCategory === "All Dishes" || formattedItemCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handleAddFeaturedToCart = (item: MenuItem) => {
    // Convert AI MenuItem to MenuItemResponse format
    const cartItem: MenuItemResponse = {
      id: item.id,
      name: item.name,
      price: item.price,
      vegetarian: item.vegetarian,
      chefId: 0,
      chefName: item.chefName || 'Unknown Chef',
      category: item.category || '',
      description: '',
      available: true,
      imageUrl: undefined,
      preparationTime: 15
    };
    onAddToCart(cartItem);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Section - AI Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Chef's Specials</h2>
          <div className="flex gap-2">
            <button
              onClick={scrollToPrev}
              disabled={loadingRecommendations || aiRecommendations.length === 0}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToNext}
              disabled={loadingRecommendations || aiRecommendations.length === 0}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loadingRecommendations ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x">
            <div className="relative min-w-[calc(50%-12px)] aspect-video rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center snap-center">
              <div className="text-slate-400">Loading...</div>
            </div>
            <div className="relative min-w-[calc(50%-12px)] aspect-video rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center snap-center">
              <div className="text-slate-400">Loading...</div>
            </div>
          </div>
        ) : aiRecommendations.length > 0 ? (
          <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x scroll-smooth">
            {aiRecommendations.map((item, index) => (
              <div key={item.id} className="relative min-w-[calc(50%-12px)] aspect-video rounded-2xl overflow-hidden snap-center group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <div
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `url('${item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}')` 
                  }}
                ></div>
                
                {/* Badge - Top Left */}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`${index === 0 ? 'bg-primary' : 'bg-amber-500'} text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider`}>
                    {index === 0 ? 'Most Popular' : 'New Arrival'}
                  </span>
                </div>

                {/* Content - Bottom Left */}
                <div className="absolute bottom-0 left-0 p-6 z-20 text-white max-w-[70%]">
                  <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                  <p className="text-slate-200 text-sm line-clamp-2">
                    {item.description || 
                     `Delicious ${item.category?.toLowerCase()} prepared with fresh ingredients and authentic flavors.`}
                  </p>
                </div>

                {/* Add to Cart Button - Bottom Right */}
                <div className="absolute bottom-6 right-6 z-20">
                  <button 
                    onClick={() => handleAddFeaturedToCart(item)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/30 text-sm"
                  >
                    Add to Cart
                    <span className="text-white">• ₹{item.price.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative min-w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <div className="text-center">
              <Star className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">No recommendations available</p>
            </div>
          </div>
        )}
      </section>

      {/* Category Filter */}
      <div className="sticky top-16 z-40 bg-[#f8f6f6] dark:bg-[#221510] -mx-8 px-8 py-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 font-semibold rounded-full shrink-0 transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col h-full"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
              />
              <button 
                onClick={() => toggleFavourite(item.id)}
                className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:scale-110"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    favouriteItems.has(item.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-slate-400 hover:text-red-500'
                  }`} 
                />
              </button>
              {item.vegetarian && (
                <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase text-white">Veg</span>
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                {menuItemRatings.has(item.id) && menuItemRatings.get(item.id)!.count > 0 ? (
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    {menuItemRatings.get(item.id)!.rating.toFixed(1)}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-xs font-bold">
                    <Star className="w-3 h-3" />
                    New
                  </div>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                {item.description || 'Delicious dish prepared with fresh ingredients'}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xl font-bold">₹{item.price.toFixed(2)}</span>
                <button
                  onClick={() => onAddToCart(item)}
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
