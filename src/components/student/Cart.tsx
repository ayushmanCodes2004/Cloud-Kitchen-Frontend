import { X, Plus, Minus, Trash2, ChefHat, Info } from 'lucide-react';
import { CartItem } from './StudentDashboard';

interface CartProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  onClose: () => void;
  onPlaceOrder: () => void;
}

export const Cart = ({ cart, setCart, onClose, onPlaceOrder }: CartProps) => {
  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Group cart items by chef
  const itemsByChef = cart.reduce((acc, item) => {
    const chefName = item.chefName || 'Unknown Chef';
    if (!acc[chefName]) {
      acc[chefName] = [];
    }
    acc[chefName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const chefCount = Object.keys(itemsByChef).length;
  const isMultiChef = chefCount > 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-card rounded-2xl shadow-strong max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border sticky top-0 bg-card">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-foreground">Your Cart</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
          ) : (
            <>
              {isMultiChef && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">Multi-Chef Order</p>
                      <p className="text-muted-foreground">
                        Your order will be split into {chefCount} separate orders (one per chef)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
                {Object.entries(itemsByChef).map(([chefName, items]) => {
                  const chefTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  
                  return (
                    <div key={chefName} className={isMultiChef ? 'border border-border rounded-lg p-3 bg-muted/30' : ''}>
                      {isMultiChef && (
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                          <ChefHat className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{chefName}</span>
                          <span className="ml-auto text-sm font-semibold text-primary">₹{chefTotal.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 pb-3 mb-3 border-b border-border last:border-0 last:mb-0 last:pb-0">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2 text-destructive hover:opacity-80 transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onPlaceOrder}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-soft"
              >
                {isMultiChef ? `Place ${chefCount} Orders` : 'Place Order'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
