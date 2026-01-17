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
  Sparkles
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
import { OrderList } from './OrderList';
import { AiRecommendationBanner } from './AiRecommendationBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestimonialForm } from '@/components/shared/TestimonialForm';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Favourites } from './Favourites';
import { useNavigate } from 'react-router-dom';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300"
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex relative overflow-hidden">
      {/* Food Background Image with Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1920&q=80')",
            filter: "blur(4px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-slate-900/40 to-slate-950/60" />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Sidebar Navigation */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-700/50 shadow-xl fixed left-0 top-0 h-screen overflow-y-auto flex flex-col z-40"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex items-center gap-3 mb-8 p-6"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-500/30 backdrop-blur-xl flex items-center justify-center border border-orange-500/20 overflow-hidden"
          >
            <img src="/best.png" alt="PlatePal" className="w-7 h-7 object-contain" />
          </motion.div>
          <span className="text-xl font-bold text-white">PlatePal</span>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1 p-4 flex flex-col">
          <div className="space-y-2">
            {[
              { icon: UtensilsCrossed, label: 'Menu', tab: 'menu', onClick: () => setActiveTab('menu') },
              { icon: Heart, label: 'Favourites', tab: 'favourites', onClick: () => setActiveTab('favourites') },
              { icon: PackageSearch, label: 'My Orders', tab: 'orders', onClick: () => setActiveTab('orders') },
              { icon: Crown, label: 'Gold Plan', tab: null, onClick: () => navigate('/student/subscription') },
              { icon: Sparkles, label: 'AI Meal Builder', tab: null, onClick: () => navigate('/student/ai-meal-builder') },
              { icon: MessageCircle, label: 'Testimonial', tab: 'testimonial', onClick: () => setActiveTab('testimonial') }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 200 }}
              >
                <NavItemIcon 
                  icon={item.icon}
                  label={item.label} 
                  active={activeTab === item.tab}
                  onClick={item.onClick}
                />
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Logout Button - Bottom of Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="p-4"
        >
          <NavItemIcon 
            icon={LogOut}
            label="Logout" 
            active={false}
            onClick={logout}
          />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-64 relative z-10">
        {/* Top Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40"
        >
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Search Bar - Only show in menu tab */}
            <div className="flex-1 max-w-2xl">
              <AnimatePresence mode="wait">
                {activeTab === 'menu' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-base bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-8">
              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative p-2 text-slate-300 hover:bg-slate-800/50 rounded-lg transition"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cart.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-orange-500/50"
                    >
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User Profile */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 pl-4 border-l border-slate-700/50"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-semibold text-slate-400">Student</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-500/30 backdrop-blur-xl flex items-center justify-center border border-orange-500/20">
                  <User className="w-5 h-5 text-orange-400" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="p-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="hidden">
              <TabsList className="bg-transparent border-0 h-auto">
                <TabsTrigger value="menu" className="sr-only">Menu</TabsTrigger>
                <TabsTrigger value="favourites" className="sr-only">Favourites</TabsTrigger>
                <TabsTrigger value="orders" className="sr-only">My Orders</TabsTrigger>
                <TabsTrigger value="testimonial" className="sr-only">Testimonial</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="menu" className="mt-0">
              <AiRecommendationBanner onAddToCart={addToCart} />
              <MenuBrowser
                onOrderClick={addToCart}
                showOrderButton={true}
                userRole="student"
                externalSearchQuery={searchQuery}
              />
            </TabsContent>

            <TabsContent value="favourites" className="mt-0">
              <Favourites 
                onAddToCart={addToCart}
                onAddMealToCart={(meal) => {
                  // Convert saved meal items to cart items and add them
                  meal.items.forEach(item => {
                    const cartItem: CartItem = {
                      id: item.menuItemId,
                      name: item.menuItemName,
                      price: item.menuItemPrice,
                      vegetarian: false,
                      chefId: item.chefId || 0,
                      chefName: item.chefName || 'Unknown',
                      category: '',
                      description: '',
                      available: true,
                      imageUrl: item.menuItemImage || undefined,
                      preparationTime: 15,
                      quantity: item.quantity
                    };
                    
                    // Add to cart
                    const existing = cart.find(i => i.id === cartItem.id);
                    if (existing) {
                      setCart(cart.map(i => 
                        i.id === cartItem.id ? { ...i, quantity: i.quantity + cartItem.quantity } : i
                      ));
                    } else {
                      setCart(prev => [...prev, cartItem]);
                    }
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 h-auto mb-4 p-1">
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 text-slate-300 font-medium px-5 py-2.5 rounded-md text-sm md:text-base transition-all"
                  >
                    Active Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 text-slate-300 font-medium px-5 py-2.5 rounded-md text-sm md:text-base transition-all"
                  >
                    Order History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-0">
                  <OrderList
                    orders={orders.filter(order => order.status !== 'DELIVERED' && order.status !== 'CANCELLED')}
                    onReorder={handleReorder}
                  />
                </TabsContent>

                <TabsContent value="all" className="mt-0">
                  <OrderList
                    orders={orders}
                    onReorder={handleReorder}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="testimonial" className="p-6 mt-0">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Share Your Experience</h2>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="p-2 hover:bg-slate-800/50 rounded-full transition"
                    title="Back to menu"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <TestimonialForm />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

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
    </div>
  );
};

interface NavItemIconProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItemIcon = ({ icon: Icon, label, active, onClick }: NavItemIconProps) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: 4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
      active
        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/20'
        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent'
    }`}
  >
    {active && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <Icon className={`w-5 h-5 relative z-10 ${active ? 'text-orange-400' : ''}`} />
    <span className="font-medium text-sm relative z-10">{label}</span>
  </motion.button>
);
