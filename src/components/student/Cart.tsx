import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ChefHat, Info, ShoppingBag, ArrowRight } from 'lucide-react';
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
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Sliding Cart Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-screen w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center border border-orange-500/30"
              >
                <ShoppingBag className="w-6 h-6 text-orange-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                <p className="text-sm text-slate-400">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
              <p className="text-slate-400 mb-6">Add some delicious items to get started!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium shadow-lg shadow-orange-500/30"
              >
                Browse Menu
              </motion.button>
            </motion.div>
          ) : (
            <>
              {isMultiChef && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-white mb-1">Multi-Chef Order</p>
                      <p className="text-slate-300">
                        Your order will be split into {chefCount} separate orders
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="popLayout">
                {Object.entries(itemsByChef).map(([chefName, items], chefIndex) => {
                  const chefTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  
                  return (
                    <motion.div
                      key={chefName}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: chefIndex * 0.1 }}
                      className={isMultiChef ? 'p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl' : ''}
                    >
                      {isMultiChef && (
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
                          <ChefHat className="w-5 h-5 text-orange-400" />
                          <span className="text-sm font-semibold text-white">{chefName}</span>
                          <span className="ml-auto text-sm font-bold text-orange-400">₹{chefTotal.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {items.map((item, itemIndex) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-orange-500/30 transition group"
                          >
                            <div className="flex gap-3">
                              {/* Item Image Placeholder */}
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex-shrink-0 overflow-hidden">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ChefHat className="w-6 h-6 text-orange-400/50" />
                                  </div>
                                )}
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate">{item.name}</h4>
                                <p className="text-sm text-slate-400">₹{item.price.toFixed(2)} each</p>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="w-7 h-7 rounded-md bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-white transition"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </motion.button>
                                    <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="w-7 h-7 rounded-md bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-white transition"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-auto w-8 h-8 rounded-md bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>

                              {/* Item Subtotal */}
                              <div className="text-right">
                                <p className="font-bold text-orange-400">₹{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="p-6 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl space-y-4"
          >
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>Delivery Fee</span>
                <span>₹{(isMultiChef ? chefCount * 30 : 30).toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-700/50" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-orange-400">
                  ₹{(cartTotal + (isMultiChef ? chefCount * 30 : 30)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlaceOrder}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
