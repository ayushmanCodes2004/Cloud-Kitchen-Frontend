import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Crown, 
  Check, 
  ChefHat,
  Calendar,
  Zap,
  Clock,
  CreditCard,
  Building2,
  Wallet,
  AlertCircle,
  X as CloseIcon
} from 'lucide-react';
import { subscriptionApi, SubscriptionPlan, SubscriptionResponse } from '@/services/subscriptionApi';

interface SubscribeModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscribeModal = ({ plan, onClose, onSuccess }: SubscribeModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionReference, setTransactionReference] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await subscriptionApi.createSubscriptionRequest({
        planId: plan.id,
        paymentInvoiceUrl: invoiceUrl || 'pending',
        paymentMethod,
        transactionReference,
      });

      alert('Subscription request submitted successfully! Waiting for admin approval.');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit subscription request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-[#332e1c]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-[#332e1c] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Subscribe to {plan.name}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Payment Instructions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-amber-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Payment Instructions</span>
            </div>
            <p className="text-lg mb-4 text-slate-700 dark:text-slate-300">
              Please pay <strong className="text-amber-500">₹{plan.price}</strong> using any method below:
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Wallet size={20} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">UPI</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">UPI ID: <strong>platepal@upi</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Building2 size={20} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Bank Transfer</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acc: <strong>1234567890</strong> • IFSC: <strong>SBIN0001234</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <CreditCard size={20} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Cash</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Contact: <strong>admin@platepal.com</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Check size={18} className="text-amber-500" />
                <span className="font-semibold text-slate-900 dark:text-white">Payment Details</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Transaction Reference / UTR</label>
                  <input
                    type="text"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder="Enter transaction ID"
                    required
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Payment Screenshot URL (Optional)</label>
                  <input
                    type="url"
                    value={invoiceUrl}
                    onChange={(e) => setInvoiceUrl(e.target.value)}
                    placeholder="https://example.com/screenshot.jpg"
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <small className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Upload to image hosting and paste URL</small>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 h-12 rounded-lg border border-slate-300 dark:border-slate-600 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-12 rounded-lg bg-amber-500 text-slate-900 font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const GoldSubscriptionPage = () => {
  const [goldPlan, setGoldPlan] = useState<SubscriptionPlan | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionResponse | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plan, active, history] = await Promise.all([
        subscriptionApi.getGoldPlan(),
        subscriptionApi.getActiveSubscription(),
        subscriptionApi.getMySubscriptions(),
      ]);

      setGoldPlan(plan);
      setActiveSubscription(active);
      setSubscriptions(history);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; text: string }> = {
      PENDING: { className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', text: 'Pending' },
      ACTIVE: { className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', text: 'Active' },
      EXPIRED: { className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400', text: 'Expired' },
      CANCELLED: { className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', text: 'Cancelled' },
      REJECTED: { className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', text: 'Rejected' },
    };

    const badge = badges[status] || { className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400', text: status };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>{badge.text}</span>;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (!goldPlan) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-slate-900 dark:text-white font-semibold">Failed to load subscription plan</p>
        </div>
      </div>
    );
  }

  const features = goldPlan.features?.split('|') || [];
  const isSubscribed = activeSubscription?.status === 'ACTIVE';
  const daysRemaining = activeSubscription?.endDate ? getDaysRemaining(activeSubscription.endDate) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#332e1c]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/best.png" alt="PlatePal" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Plate<span className="text-[#ff6b35]">Pal</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gold Membership</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-50 dark:to-[#121212] z-10"></div>
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"
            alt="Gourmet dinner spread"
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-amber-500/30"
          >
            Elevate Your Taste
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white"
          >
            Savor the{' '}
            <span className="bg-gradient-to-r from-amber-400 via-white to-amber-400 bg-clip-text text-transparent">
              Gold Standard
            </span>{' '}
            of Dining
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Get {goldPlan.discountPercentage}% discount on every order, waive platform fees, and access exclusive benefits. Save more with every meal!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {!isSubscribed ? (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  className="min-w-[200px] h-14 bg-amber-500 text-slate-900 font-black text-lg rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                >
                  Join Gold Now
                </button>
                <button
                  onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                  className="min-w-[200px] h-14 bg-white/5 backdrop-blur-md border border-slate-700 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-colors"
                >
                  View Benefits
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 px-6 py-3 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                  <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-bold">You're a Gold Member!</span>
                </div>
                {daysRemaining > 0 && (
                  <p className="text-sm text-slate-400">{daysRemaining} days remaining</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Gold Plan Card */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-2 border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)]"
        >
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-slate-900 text-xs font-black rounded-full uppercase">
            Most Popular
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{goldPlan.name} Plan</h2>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-amber-500">₹{goldPlan.price}</span>
                <span className="text-slate-500">/ {goldPlan.durationDays} days</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">What You Get</h3>
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {!isSubscribed && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full h-14 rounded-xl bg-amber-500 text-slate-900 font-black text-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Subscribe Now
            </button>
          )}

          {isSubscribed && (
            <div className="flex items-center justify-center gap-2 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-700 dark:text-green-400 font-semibold">
              <Check className="w-5 h-5" />
              You're subscribed to Gold Plan
            </div>
          )}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="benefits" className="bg-slate-100 dark:bg-[#1e1e1e] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Go Gold?</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Premium perks for the true food enthusiast.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Truck className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {goldPlan.platformFeeWaived ? 'Zero Platform Fees' : 'Reduced Fees'}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {goldPlan.platformFeeWaived 
                  ? 'Stop paying platform fees. Every order comes with zero additional charges.'
                  : 'Enjoy reduced platform fees on every order you place.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                <ChefHat className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{goldPlan.discountPercentage}% Discount</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get {goldPlan.discountPercentage}% off on every order. Save more with every meal you enjoy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Priority Handling</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your orders jump to the front of the queue. Faster cooking, faster delivery, every time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subscription History */}
      {subscriptions.length > 0 && (
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription History</h2>
            <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400">
              {subscriptions.length}
            </span>
          </div>

          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div 
                key={sub.id} 
                className="p-6 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#332e1c]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-lg text-slate-900 dark:text-white">{sub.planName}</span>
                  {getStatusBadge(sub.status)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Requested: {formatDate(sub.createdAt)}</span>
                  </div>
                  
                  {sub.startDate && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {formatDate(sub.startDate)}</span>
                    </div>
                  )}
                  
                  {sub.endDate && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Ends: {formatDate(sub.endDate)}</span>
                    </div>
                  )}
                  
                  {sub.rejectionReason && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-400 mt-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{sub.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isSubscribed && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-gradient-to-r from-slate-800 to-slate-900 dark:from-[#332e1c] dark:to-[#1e1e1e] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden border border-amber-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white relative z-10">
              Ready to Taste the Gold Life?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of members who save on every order with exclusive Gold benefits.
            </p>
            
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-500 text-slate-900 h-16 px-12 rounded-xl text-xl font-black hover:scale-105 transition-all shadow-[0_10px_40px_rgba(251,191,36,0.3)] relative z-10"
            >
              Activate Gold Membership
            </button>
          </div>
        </section>
      )}

      {/* Subscribe Modal */}
      {showModal && goldPlan && (
        <SubscribeModal
          plan={goldPlan}
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-[#0a0a0a] border-t border-slate-800 dark:border-[#332e1c] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/best.png" alt="PlatePal" className="w-10 h-10" />
              <h2 className="text-2xl font-bold text-white">
                Plate<span className="text-[#ff6b35]">Pal</span>
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Contact Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} PlatePal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
