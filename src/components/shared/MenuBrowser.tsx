import { useState, useEffect } from 'react';
import { menuApi } from '@/services/menuApi';
import { MenuItemResponse } from '@/services/chefApi';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ratingApi } from '@/services/ratingApi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, Clock, User, Loader2, ShoppingCart, Star, CheckCircle, MessageSquare, BadgeCheck } from 'lucide-react';
import { ReviewsModal } from '@/components/ui/ReviewsModal';

interface MenuBrowserProps {
  onOrderClick?: (item: MenuItemResponse) => void;
  showOrderButton?: boolean;
  userRole?: 'student' | 'chef' | 'admin';
}

export const MenuBrowser = ({ onOrderClick, showOrderButton = false, userRole }: MenuBrowserProps) => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItemResponse[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [availableOnly, setAvailableOnly] = useState(true);
  const [ratedChefs, setRatedChefs] = useState<Set<number>>(new Set());
  const [ratedMenuItems, setRatedMenuItems] = useState<Set<number>>(new Set());
  const [reviewsModal, setReviewsModal] = useState<{
    isOpen: boolean;
    menuItemId: number;
    menuItemName: string;
  }>({ isOpen: false, menuItemId: 0, menuItemName: '' });

  useEffect(() => {
    loadMenuItems();
  }, [availableOnly]);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, searchQuery, categoryFilter]);

  // Load rated items for students
  useEffect(() => {
    const loadRatedItems = async () => {
      if (userRole === 'student' && token) {
        try {
          const [ratedChefIds, ratedMenuItemKeys] = await Promise.all([
            ratingApi.getMyRatedOrders(token),
            ratingApi.getMyRatedMenuItems(token)
          ]);
          
          // Extract chef IDs from rated orders
          const chefIds = new Set<number>();
          // Note: We need chef IDs, but getMyRatedOrders returns order IDs
          // We'll track by checking if chef was rated in any order
          setRatedChefs(chefIds);
          
          // Extract menu item IDs from rated menu items (format: "orderId-menuItemId")
          const menuItemIds = new Set<number>();
          ratedMenuItemKeys.forEach(key => {
            const parts = key.split('-');
            if (parts.length === 2) {
              menuItemIds.add(parseInt(parts[1]));
            }
          });
          setRatedMenuItems(menuItemIds);
        } catch (error) {
          console.error('Failed to load rated items:', error);
        }
      }
    };

    loadRatedItems();
  }, [userRole, token]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = availableOnly 
        ? await menuApi.getAvailableMenuItems()
        : await menuApi.getAllMenuItems();
      
      if (response.success && response.data) {
        setMenuItems(response.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || 'Failed to load menu items'
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to load menu items'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = [...menuItems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chefName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const getCategoryStats = () => {
    const categories = ['STARTER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SNACK'];
    return categories.map(cat => ({
      name: cat,
      count: menuItems.filter(item => item.category === cat).length
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {getCategoryStats().map(stat => (
          <Card key={stat.name}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stat.count}</div>
              <div className="text-xs text-gray-600 mt-1">
                {stat.name.replace('_', ' ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search menu items, chef name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="STARTER">Starter</SelectItem>
            <SelectItem value="MAIN_COURSE">Main Course</SelectItem>
            <SelectItem value="DESSERT">Dessert</SelectItem>
            <SelectItem value="BEVERAGE">Beverage</SelectItem>
            <SelectItem value="SNACK">Snack</SelectItem>
          </SelectContent>
        </Select>

        {userRole === 'admin' && (
          <Button
            variant={availableOnly ? "default" : "outline"}
            onClick={() => setAvailableOnly(!availableOnly)}
            className="w-full md:w-auto"
          >
            {availableOnly ? 'Available Only' : 'Show All'}
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredItems.length} of {menuItems.length} items
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No menu items found. Try adjusting your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {item.vegetarian ? (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    🌱 Veg
                  </Badge>
                ) : (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    🥩 Non-Veg
                  </Badge>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg">Unavailable</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {item.category.replace('_', ' ')}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Chef {item.chefName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{item.preparationTime} min</span>
                  </div>
                  
                  {/* Ratings Section */}
                  <div className="space-y-1 pt-2 border-t border-gray-100">
                    {/* Chef Rating */}
                    {item.chefAverageRating !== undefined && item.chefAverageRating > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Chef Rating:</span>
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-semibold">{item.chefAverageRating.toFixed(1)}</span>
                          <span className="text-gray-500">({item.chefTotalRatings})</span>
                          {item.chefVerified && (
                            <span title="Verified Chef">
                              <BadgeCheck className="w-4 h-4 text-green-600 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Food Rating */}
                    {item.menuItemAverageRating !== undefined && item.menuItemAverageRating > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">Food Rating:</span>
                          <div className="flex items-center gap-1 text-orange-600">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="font-semibold">{item.menuItemAverageRating.toFixed(1)}</span>
                            <span className="text-gray-500">({item.menuItemTotalRatings})</span>
                          </div>
                        </div>
                        {userRole === 'student' && (
                          <button
                            onClick={() => setReviewsModal({
                              isOpen: true,
                              menuItemId: item.id,
                              menuItemName: item.name
                            })}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            View Reviews
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                  {showOrderButton && item.available && onOrderClick && (
                    <Button 
                      onClick={() => onOrderClick(item)}
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={reviewsModal.isOpen}
        onClose={() => setReviewsModal({ isOpen: false, menuItemId: 0, menuItemName: '' })}
        menuItemId={reviewsModal.menuItemId}
        menuItemName={reviewsModal.menuItemName}
      />
    </div>
  );
};
