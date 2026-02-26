import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  PackageSearch, 
  UtensilsCrossed,
  MessageSquare, 
  Search,
  LogOut,
  User,
  MessageCircle,
  X,
  Heart,
  Crown,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/services/orderApi';
import { menuApi } from '@/services/menuApi';
import { MenuItemResponse } from '@/services/chefApi';
import { OrderResponse } from '@/types/api.types';
import { useToast } from '@/components/ui/use-toast';
import { MenuBrowser } from '@/components/shared/MenuBrowser';
import { Cart } from './Cart';
import { Checkout } from './Checkout';
import { AiRecommendationBanner } from './AiRecommendationBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestimonialForm } from '@/components/shared/TestimonialForm';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { ModernMenuGrid } from './ModernMenuGrid';
import { ModernFooter } from './ModernFooter';
import { ModernFavourites } from './ModernFavourites';
import { ModernOrders } from './ModernOrders';
import { NearbyChefs } from './NearbyChefs';
import { ReviewsPage } from './ReviewsPage';

export interface CartItem extends MenuItemResponse {
  quantity: number;
}

export const StudentDashboard = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [cityName, setCityName] = useState<string>(''); // Current city name
  const [loadingCity, setLoadingCity] = useState(false); // Loading state for city name

  // Reverse geocode to get city name from coordinates
  const getCityName = async (lat: number, lng: number) => {
    setLoadingCity(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch city name');
      }

      const data = await response.json();
      
      // Extract city name from response (try multiple fields)
      const city = data.address?.city || 
                   data.address?.town || 
                   data.address?.village || 
                   data.address?.state_district ||
                   data.address?.state ||
                   'Location';
      
      setCityName(city);
    } catch (error) {
      console.error('Error fetching city name:', error);
      setCityName('Location');
    } finally {
      setLoadingCity(false);
    }
  };

  // Get user's current location and city name on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getCityName(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCityName('Location');
        }
      );
    } else {
      setCityName('Location');
    }
  }, []);

  useEffect(() => {
    loadOrders();
    
    // Auto-refresh orders every 10 seconds
    const intervalId = setInterval(() => {
      loadOrders();
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [token]);

  const loadOrders = async () => {
    if (!token) return;
    
    try {
      const result = await orderApi.getMyOrders();
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      // Only show error toast on initial load, not on auto-refresh
      if (loading) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load orders. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: OrderResponse) => {
    // Add items to cart
    const itemsToAdd = order.orderItems.map(item => ({
      id: item.menuItemId,
      name: item.menuItemName,
      price: item.price,
      vegetarian: item.vegetarian || false,
      chefId: item.chefId || 0,
      chefName: item.chefName || 'Unknown',
      category: '',
      description: '',
      available: true,
      imageUrl: undefined,
      preparationTime: 15, // Default preparation time
      quantity: item.quantity
    }));

    setCart(prevCart => {
      const updatedCart = [...prevCart];
      itemsToAdd.forEach(item => {
        const existingItem = updatedCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          updatedCart.push({ ...item, quantity: item.quantity });
        }
      });
      return updatedCart;
    });

    toast({
      title: "Items added to cart",
      description: "Your order has been added to the cart.",
    });
    setShowCart(true);
  };

  const addToCart = (item: MenuItemResponse) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast({
      title: 'Added to cart',
      description: `${item.name} added to cart!`
    });
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) return;
    setShowCart(false);
    setShowCheckout(true);
  };

  const placeOrder = async (paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT') => {
    if (!token || cart.length === 0) return;

    const orderData = {
      items: cart.map(item => ({
        menuItemId: Number(item.id),
        quantity: item.quantity
      })),
      deliveryAddress: 'Student Hostel',
      specialInstructions: '',
      paymentMethod: paymentMethod
    };

    try {
      const result = await orderApi.createOrder(orderData);
      if (result.success) {
        toast({
          title: 'Order placed',
          description: 'Your order has been placed successfully.'
        });
        setCart([]);
        setShowCheckout(false);
        loadOrders();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to place order'
        });
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to place order'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#221510] transition-colors duration-300">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221510]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex justify-between items-center h-16 gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <img src="/best.png" alt="PlatePal" className="w-8 h-8" />
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Plate<span className="text-[#ff6b35]">Pal</span>
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center gap-1">
                <NavLink label="Menu" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
                <NavLink label="Favourites" active={activeTab === 'favourites'} onClick={() => setActiveTab('favourites')} />
                <NavLink label="My Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                <NavLink label="AI Meal Builder" active={false} onClick={() => navigate('/student/ai-meal-builder')} />
                <NavLink label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
              </nav>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-sm">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400 w-4 h-4" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border-none bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Search dishes..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab('nearby')}
                  className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="View Nearby Chefs"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden lg:inline">
                    {loadingCity ? 'Loading...' : (cityName || 'Location')}
                  </span>
                </button>
                
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                
                {/* Account Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Account"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {showAccountMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowAccountMenu(false)}
                      ></div>
                      
                      {/* Dropdown Menu */}
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
                      >
                        {/* User Info Header */}
                        <div className="px-4 py-4 bg-gradient-to-br from-primary/10 to-orange-600/10 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                              {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {user?.name || 'User'}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                {user?.email || ''}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowAccountMenu(false);
                              navigate('/student/subscription');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:dark:to-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-slate-900 dark:text-white">Gold Plan</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Upgrade your account</div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowAccountMenu(false);
                              setActiveTab('testimonial');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <MessageCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-slate-900 dark:text-white">Testimonials</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Share your experience</div>
                            </div>
                          </button>
                          
                          <div className="my-2 mx-4 border-t border-slate-200 dark:border-slate-800"></div>
                          
                          <button
                            onClick={() => {
                              setShowAccountMenu(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold">Logout</div>
                              <div className="text-xs text-red-500 dark:text-red-400">Sign out of your account</div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="xl:hidden flex items-center gap-4 overflow-x-auto no-scrollbar pb-3 border-t border-slate-100 dark:border-slate-800 pt-3">
              <NavLink label="Menu" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} mobile />
              <NavLink label="Favourites" active={activeTab === 'favourites'} onClick={() => setActiveTab('favourites')} mobile />
              <NavLink label="My Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} mobile />
              <NavLink label="AI Meal Builder" active={false} onClick={() => navigate('/student/ai-meal-builder')} mobile />
              <NavLink label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} mobile />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="hidden">
            <TabsList>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="favourites">Favourites</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="nearby">Nearby Chefs</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="testimonial">Testimonial</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="menu" className="mt-0">
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ModernMenuGrid onAddToCart={addToCart} searchQuery={searchQuery} />
            </motion.div>
          </TabsContent>

          <TabsContent value="favourites" className="mt-0">
            <motion.div
              key="favourites"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ModernFavourites onAddToCart={addToCart} />
            </motion.div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ModernOrders 
                orders={orders} 
                onReorder={handleReorder}
                onOrderCancelled={loadOrders}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="nearby" className="mt-0">
            <motion.div
              key="nearby"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <NearbyChefs />
            </motion.div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ReviewsPage onClose={() => setActiveTab('menu')} />
            </motion.div>
          </TabsContent>

          <TabsContent value="testimonial" className="mt-0">
            <motion.div
              key="testimonial"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Share Your Experience</h2>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <TestimonialForm />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <ModernFooter />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-[60]">
          <button
            onClick={() => setShowCart(true)}
            className="group relative flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
                {totalCartItems}
              </span>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-xs font-medium text-white/80">Checkout now</span>
              <span className="text-lg font-bold">View Cart • ₹{totalCartPrice.toFixed(2)}</span>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Modals */}
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
          onPlaceOrder={proceedToCheckout}
        />
      )}

      {showCheckout && (
        <Checkout
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onConfirmOrder={placeOrder}
        />
      )}
    </div>
  );
};

interface NavLinkProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  mobile?: boolean;
}

const NavLink = ({ label, active, onClick, icon, mobile = false }: NavLinkProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-primary whitespace-nowrap ${
      active 
        ? 'text-primary relative after:content-[""] after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-0.5 after:bg-primary' 
        : ''
    } ${mobile ? '!py-1' : ''}`}
  >
    <span className="flex items-center gap-1">
      {icon}
      {label}
    </span>
  </button>
);

interface NavItemIconProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItemIcon = ({ icon: Icon, label, active, onClick }: NavItemIconProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      active
        ? 'bg-orange-100 text-orange-600'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm">{label}</span>
  </button>
);
