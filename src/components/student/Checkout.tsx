import { useState } from 'react';
import { X, CreditCard, Banknote, ChefHat, Receipt } from 'lucide-react';
import { CartItem } from './StudentDashboard';

interface CheckoutProps {
  cart: CartItem[];
  onClose: () => void;
  onConfirmOrder: (paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT') => void;
}

export const Checkout = ({ cart, onClose, onConfirmOrder }: CheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT'>('CASH_ON_DELIVERY');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Check if user has active subscription (Gold Plan)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasGoldPlan = user.subscriptionStatus === 'ACTIVE';
  
  // Gold Plan benefits
  const discountPercentage = hasGoldPlan ? 5 : 0;
  const discountAmount = hasGoldPlan ? subtotal * 0.05 : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  const taxRate = 0.02; // 2% student discount rate
  const taxAmount = subtotalAfterDiscount * taxRate;
  const platformFee = hasGoldPlan ? 0 : 8; // ₹8 flat rate (waived for Gold subscribers)
  const total = subtotalAfterDiscount + taxAmount + platformFee;

  // Group items by chef
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

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirmOrder(paymentMethod);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-3">
              {Object.entries(itemsByChef).map(([chefName, items]) => (
                <div key={chefName} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <ChefHat className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-900">{chefName}</span>
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bill Details */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-3">Bill Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {hasGoldPlan && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <span className="text-xs">👑</span>
                    Gold Plan Discount (5%)
                  </span>
                  <span className="text-green-600 font-medium">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (2% - Student Rate)</span>
                <span className="text-gray-900 font-medium">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee</span>
                {hasGoldPlan ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <span className="line-through text-gray-400">₹8.00</span>
                    <span className="text-xs">👑 FREE</span>
                  </span>
                ) : (
                  <span className="text-gray-900 font-medium">₹{platformFee.toFixed(2)}</span>
                )}
              </div>
              
              {hasGoldPlan && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                  <p className="text-xs text-green-700 font-medium text-center">
                    🎉 You saved ₹{(discountAmount + 8).toFixed(2)} with Gold Plan!
                  </p>
                </div>
              )}
              
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-orange-500 text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Payment Method</h4>
            <div className="space-y-3">
              {/* Cash on Delivery */}
              <button
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-4 ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'CASH_ON_DELIVERY' ? 'border-orange-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'CASH_ON_DELIVERY' && (
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  )}
                </div>
                <Banknote className={`w-6 h-6 ${
                  paymentMethod === 'CASH_ON_DELIVERY' ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </button>

              {/* Online Payment */}
              <button
                onClick={() => setPaymentMethod('ONLINE_PAYMENT')}
                className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-4 ${
                  paymentMethod === 'ONLINE_PAYMENT'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'ONLINE_PAYMENT' ? 'border-orange-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'ONLINE_PAYMENT' && (
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  )}
                </div>
                <CreditCard className={`w-6 h-6 ${
                  paymentMethod === 'ONLINE_PAYMENT' ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Online Payment</p>
                  <p className="text-sm text-gray-500">Pay now using UPI, Card, or Net Banking</p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-medium">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
            <p className="text-sm text-gray-600">Student Hostel</p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={isProcessing || paymentMethod === 'ONLINE_PAYMENT'}
            className={`w-full py-4 rounded-lg font-semibold transition shadow-md ${
              isProcessing || paymentMethod === 'ONLINE_PAYMENT'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : paymentMethod === 'ONLINE_PAYMENT' ? (
              'Online Payment Coming Soon'
            ) : (
              `Place Order - ₹${total.toFixed(2)}`
            )}
          </button>

          {isMultiChef && (
            <p className="text-xs text-center text-gray-500">
              Note: Your order will be split into {chefCount} separate orders (one per chef)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
