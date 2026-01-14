import { useState, useEffect } from 'react';
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
  Heart
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

export interface CartItem extends MenuItemResponse {
  quantity: number;
}

export const StudentDashboard = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
    
    // Auto-refresh orders every 30 seconds
    const intervalId = setInterval(() => {
      loadOrders();
    }, 30000); // 30 seconds

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm fixed left-0 top-0 h-screen overflow-y-auto flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 p-6">
          <img src="/best.png" alt="PlatePal" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-900">PlatePal</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1 p-4 flex flex-col">
          <div className="space-y-2">
            <NavItemIcon 
              icon={UtensilsCrossed}
              label="Menu" 
              active={activeTab === 'menu'}
              onClick={() => setActiveTab('menu')}
            />
            <NavItemIcon 
              icon={Heart}
              label="Favourites" 
              active={activeTab === 'favourites'}
              onClick={() => setActiveTab('favourites')}
            />
            <NavItemIcon 
              icon={PackageSearch}
              label="My Orders" 
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
            />
            <NavItemIcon 
              icon={MessageCircle}
              label="Testimonial" 
              active={activeTab === 'testimonial'}
              onClick={() => setActiveTab('testimonial')}
            />
          </div>
        </nav>

        {/* Logout Button - Bottom of Sidebar */}
        <div className="p-4">
          <NavItemIcon 
            icon={LogOut}
            label="Logout" 
            active={false}
            onClick={logout}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Search Bar - Only show in menu tab */}
            <div className="flex-1 max-w-2xl">
              {activeTab === 'menu' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-base bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-8">
              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs font-semibold text-gray-700">Student</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
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
              <Favourites onAddToCart={addToCart} />
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="bg-transparent border-0 h-auto mb-4">
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-5 py-2.5 rounded-md text-sm md:text-base"
                  >
                    Active Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-5 py-2.5 rounded-md text-sm md:text-base"
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
                  <h2 className="text-2xl font-bold">Share Your Experience</h2>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Back to menu"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <TestimonialForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>

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
