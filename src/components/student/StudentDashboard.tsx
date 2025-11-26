import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  RefreshCw, 
  PackageSearch, 
  UtensilsCrossed,
  Clock, 
  MessageSquare, 
  Utensils, 
  Star, 
  Calendar,
  Search,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/services/orderApi';
import { menuApi } from '@/services/menuApi';
import { MenuItemResponse } from '@/services/chefApi';
import { OrderResponse } from '@/types/api.types';
import { useToast } from '@/components/ui/use-toast';
import { MenuBrowser } from '@/components/shared/MenuBrowser';
import { Cart } from './Cart';
import { OrderList } from './OrderList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestimonialForm } from '@/components/shared/TestimonialForm';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface CartItem extends MenuItemResponse {
  quantity: number;
}

export const StudentDashboard = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    if (!token) return;
    
    try {
      const result = await orderApi.getMyOrders(token);
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load orders. Please try again.',
      });
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

  const placeOrder = async () => {
    if (!token || cart.length === 0) return;

    const orderData = {
      items: cart.map(item => ({
        menuItemId: Number(item.id),
        quantity: item.quantity
      })),
      deliveryAddress: 'Student Hostel',
      specialInstructions: ''
    };

    try {
      const result = await orderApi.createOrder(token, orderData);
      if (result.success) {
        toast({
          title: 'Order placed',
          description: 'Your order has been placed successfully.'
        });
        setCart([]);
        setShowCart(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      {/* Modern Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img src="/best.png" alt="PlatePal Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-gray-900">PlatePal</span>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8">
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('menu')}
                className={`transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 ${
                  activeTab === 'menu'
                    ? 'text-orange-600 bg-orange-100 shadow-sm'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
                title="Browse Menu"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Menu</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('orders')}
                className={`transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 ${
                  activeTab === 'orders'
                    ? 'text-orange-600 bg-orange-100 shadow-sm'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
                title="My Orders"
              >
                <PackageSearch className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Orders</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('testimonial')}
                className="transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                title="Leave a Testimonial"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Feedback</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    await refreshUser();
                    await loadOrders();
                    toast({
                      title: "Refreshed",
                      description: "Your dashboard has been updated.",
                    });
                  } catch (error) {
                    console.error('Error refreshing:', error);
                  }
                }}
                className="transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Refresh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(true)}
                className="relative transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-green-600 hover:bg-green-50"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content card matching ChefDashboard style */}
      <div className="container mx-auto px-6 py-8">
        <Card className="border-0 shadow-xl rounded-xl overflow-hidden bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="hidden">
              <TabsList className="bg-transparent border-0 h-auto">
                {/* Hidden menu trigger so the tab exists for state control */}
                <TabsTrigger
                  value="menu"
                  className="sr-only"
                >
                  Menu
                </TabsTrigger>
                {/* Hidden orders trigger so the tab exists for state control */}
                <TabsTrigger
                  value="orders"
                  className="sr-only"
                >
                  My Orders
                </TabsTrigger>
                {/* Hidden testimonial trigger so the tab exists for state control */}
                <TabsTrigger
                  value="testimonial"
                  className="sr-only"
                >
                  Testimonial
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="menu" className="p-6 mt-0">
              <MenuBrowser
                onOrderClick={addToCart}
                showOrderButton={true}
                userRole="student"
              />
            </TabsContent>

            <TabsContent value="orders" className="p-6 mt-0">
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
                    onOrderCancelled={loadOrders}
                    onReorder={handleReorder}
                  />
                </TabsContent>

                <TabsContent value="all" className="mt-0">
                  <OrderList
                    orders={orders}
                    onOrderCancelled={loadOrders}
                    onReorder={handleReorder}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="testimonial" className="p-6 mt-0">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
                <TestimonialForm />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {showCart && (
          <Cart
            cart={cart}
            setCart={setCart}
            onClose={() => setShowCart(false)}
            onPlaceOrder={placeOrder}
          />
        )}
      </div>
    </div>
  );
};
