import { useState, useEffect } from 'react';
import { UtensilsCrossed, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { orderApi } from '@/services/orderApi';
import { MenuItem, OrderResponse, OrderRequest } from '@/types/api.types';
import { Alert } from '@/components/Alert';
import { MenuGrid } from './MenuGrid';
import { Cart } from './Cart';
import { OrderList } from './OrderList';



export interface CartItem extends MenuItem {
  quantity: number;
}

export const StudentDashboard = () => {
  const { user, token, logout } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');

  useEffect(() => {
    loadMenuItems();
    loadOrders();
  }, [token]);

  const loadMenuItems = async () => {
    try {
      const result = await api.getMenuItems(token!);
      if (result.success) {
        setMenuItems(result.data || []);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load menu items' });
    } finally {
      setLoading(false);
    }
  };

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

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setAlert({ type: 'success', message: `${item.name} added to cart!` });
    setTimeout(() => setAlert(null), 2000);
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
        setAlert({ type: 'success', message: 'Order placed successfully!' });
        setCart([]);
        setShowCart(false);
        loadOrders();
      } else {
        setAlert({ type: 'error', message: result.message || 'Failed to place order' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to place order' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-soft border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <UtensilsCrossed className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Cloud Kitchen</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.name}!</p>
            </div>
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
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'menu'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {activeTab === 'menu' ? (
          <MenuGrid menuItems={menuItems} loading={loading} onAddToCart={addToCart} />
        ) : (
          <OrderList orders={orders} />
        )}
      </main>

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
