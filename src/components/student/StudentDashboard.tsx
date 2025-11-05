import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/services/orderApi';
import { MenuItemResponse } from '@/services/chefApi';
import { OrderResponse } from '@/types/api.types';
import { useToast } from '@/components/ui/use-toast';
import { MenuBrowser } from '@/components/shared/MenuBrowser';
import { Cart } from './Cart';
import { OrderList } from './OrderList';
import { RatingsDisplay } from '@/components/ui/RatingsDisplay';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';



export interface CartItem extends MenuItemResponse {
  quantity: number;
}

export const StudentDashboard = () => {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    try {
      const result = await orderApi.getMyOrders(token!);
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load orders');
    }
  };

  const addToCart = (item: MenuItemResponse) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast({
      title: "Added to cart",
      description: `${item.name} added to cart!`
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const orderData = {
      items: cart.map(item => ({
        menuItemId: Number(item.id),
        quantity: item.quantity
      })),
      deliveryAddress: "Student Hostel",
      specialInstructions: ""
    };

    try {
      const result = await orderApi.createOrder(token!, orderData);
      if (result.success) {
        // Backend now returns array of orders (one per chef)
        const orders = Array.isArray(result.data) ? result.data : [result.data];
        const orderCount = orders.length;
        
        toast({
          title: "Success",
          description: orderCount > 1 
            ? `${orderCount} orders placed successfully (one per chef)!`
            : 'Order placed successfully!'
        });
        setCart([]);
        setShowCart(false);
        loadOrders();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Failed to place order'
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to place order'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 hover:bg-muted rounded-lg transition"
          >
            <ShoppingCart className="w-6 h-6 text-foreground" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              logout();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>

      <Tabs defaultValue="menu" className="mt-8">
        <TabsList>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu" className="mt-4">
          <MenuBrowser 
            onOrderClick={addToCart} 
            showOrderButton={true}
            userRole="student"
          />
        </TabsContent>
        
        <TabsContent value="orders" className="mt-4">
          <OrderList orders={orders} />
        </TabsContent>
        
        <TabsContent value="ratings" className="mt-4">
          <ErrorBoundary>
            {token ? (
              <RatingsDisplay type="all" token={token} />
            ) : (
              <div className="text-center py-8">
                <p className="text-destructive">Please log in to view ratings</p>
              </div>
            )}
          </ErrorBoundary>
        </TabsContent>
      </Tabs>

      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
          onPlaceOrder={placeOrder}
        />
      )}
    </div>
  );
};
