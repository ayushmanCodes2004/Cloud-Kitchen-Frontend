import React, { useState, useEffect } from 'react';
import { subscriptionApi, SubscriptionPlan, SubscriptionResponse } from '../../services/subscriptionApi';
import { 
  Crown, Check, TrendingDown, Calendar, Clock, 
  CreditCard, Building2, Wallet, X, AlertCircle,
  Sparkles, Shield, Zap, Gift
} from 'lucide-react';
import './SubscriptionPage.css';

interface SubscribeModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ plan, onClose, onSuccess }) => {
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
        paymentInvoiceUrl: invoiceUrl,
        paymentMethod,
        transactionReference,
      });

      alert('Subscription request submitted successfully! Waiting for admin approval.');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit subscription request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="subscribe-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Subscribe to {plan.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Payment Instructions */}
          <div className="section">
            <div className="section-title">
              <CreditCard size={18} />
              <span>Payment Instructions</span>
            </div>
            <p className="payment-amount">
              Please pay <strong>₹{plan.price}</strong> using any method below:
            </p>

            <div className="payment-options">
              <div className="payment-option">
                <div className="option-icon">
                  <Wallet size={20} />
                </div>
                <div className="option-details">
                  <h4>UPI</h4>
                  <p>UPI ID: <strong>platepal@upi</strong></p>
                </div>
              </div>

              <div className="payment-option">
                <div className="option-icon">
                  <Building2 size={20} />
                </div>
                <div className="option-details">
                  <h4>Bank Transfer</h4>
                  <p>Acc: <strong>1234567890</strong> • IFSC: <strong>SBIN0001234</strong></p>
                </div>
              </div>

              <div className="payment-option">
                <div className="option-icon">
                  <CreditCard size={20} />
                </div>
                <div className="option-details">
                  <h4>Cash</h4>
                  <p>Contact: <strong>admin@platepal.com</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="section">
              <div className="section-title">
                <Check size={18} />
                <span>Payment Details</span>
              </div>

              <div className="form-field">
                <label>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="form-field">
                <label>Transaction Reference / UTR</label>
                <input
                  type="text"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="Enter transaction ID"
                  required
                />
              </div>

              <div className="form-field">
                <label>Payment Screenshot URL (Optional)</label>
                <input
                  type="url"
                  value={invoiceUrl}
                  onChange={(e) => setInvoiceUrl(e.target.value)}
                  placeholder="https://example.com/screenshot.jpg"
                />
                <small>Upload to image hosting and paste URL</small>
              </div>
            </div>

            {error && (
              <div className="error-banner">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPage: React.FC = () => {
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
      PENDING: { className: 'status-pending', text: 'Pending' },
      ACTIVE: { className: 'status-active', text: 'Active' },
      EXPIRED: { className: 'status-expired', text: 'Expired' },
      CANCELLED: { className: 'status-cancelled', text: 'Cancelled' },
      REJECTED: { className: 'status-rejected', text: 'Rejected' },
    };

    const badge = badges[status] || { className: 'status-expired', text: status };
    return <span className={`status-badge ${badge.className}`}>{badge.text}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!goldPlan) {
    return <div className="error-state">Failed to load subscription plan</div>;
  }

  const features = goldPlan.features?.split('|') || [];

  return (
    <div className="subscription-page">
      {/* Header */}
      <div className="page-header">
        <img src="/best.png" alt="PlatePal" className="logo" />
        <h1>PlatePal</h1>
      </div>

      {/* Main Container */}
      <div className="main-container">
        
        {/* Active Subscription */}
        {activeSubscription && (
          <div className="section active-sub">
            <div className="active-header">
              <div className="active-title">
                <Shield size={20} />
                <span>Your Active Subscription</span>
              </div>
              {getStatusBadge(activeSubscription.status)}
            </div>

            <div className="active-details">
              <div className="detail-row">
                <span className="detail-label">Plan</span>
                <span className="detail-value">{activeSubscription.planName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Valid Until</span>
                <span className="detail-value">{formatDate(activeSubscription.endDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Days Remaining</span>
                <span className="detail-value highlight">{getDaysRemaining(activeSubscription.endDate)} days</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Benefits</span>
                <span className="detail-value">
                  {activeSubscription.discountPercentage}% off + ₹8 fee waived
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Gold Plan */}
        <div className="section gold-plan">
          <div className="plan-badge">MOST POPULAR</div>
          
          <div className="plan-header">
            <div className="plan-icon">
              <Crown size={32} />
            </div>
            <h2>{goldPlan.name} Plan</h2>
            <div className="plan-price">
              <span className="price">₹{goldPlan.price}</span>
              <span className="duration">/month</span>
            </div>
          </div>

          <div className="plan-features">
            <h3>What You Get</h3>
            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <Check size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {!activeSubscription && (
            <button className="subscribe-btn" onClick={() => setShowModal(true)}>
              <Sparkles size={20} />
              Subscribe Now
            </button>
          )}

          {activeSubscription && activeSubscription.status === 'ACTIVE' && (
            <div className="already-active">
              <Check size={20} />
              You're subscribed to Gold Plan
            </div>
          )}
        </div>

        {/* Savings Example */}
        <div className="section">
          <div className="section-title">
            <TrendingDown size={18} />
            <span>Savings Example</span>
          </div>

          <div className="savings-comparison">
            <div className="comparison-card">
              <h4>Without Gold</h4>
              <div className="calc-row">
                <span>Order</span>
                <span>₹200.00</span>
              </div>
              <div className="calc-row">
                <span>Platform Fee</span>
                <span>₹8.00</span>
              </div>
              <div className="calc-row">
                <span>Tax (2%)</span>
                <span>₹4.16</span>
              </div>
              <div className="calc-total">
                <span>Total</span>
                <span>₹212.16</span>
              </div>
            </div>

            <div className="comparison-arrow">→</div>

            <div className="comparison-card highlight">
              <h4>With Gold</h4>
              <div className="calc-row">
                <span>Order</span>
                <span>₹200.00</span>
              </div>
              <div className="calc-row discount">
                <span>Discount (5%)</span>
                <span>-₹10.00</span>
              </div>
              <div className="calc-row">
                <span>Platform Fee</span>
                <span>₹0.00</span>
              </div>
              <div className="calc-row">
                <span>Tax (2%)</span>
                <span>₹3.80</span>
              </div>
              <div className="calc-total">
                <span>Total</span>
                <span>₹193.80</span>
              </div>
            </div>
          </div>

          <div className="savings-result">
            <Gift size={18} />
            <span>You save ₹18.36 per order!</span>
          </div>
        </div>

        {/* Subscription History */}
        {subscriptions.length > 0 && (
          <div className="section">
            <div className="section-title">
              <Calendar size={18} />
              <span>Subscription History</span>
              <span className="count-badge">({subscriptions.length})</span>
            </div>

            <div className="history-list">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="history-item">
                  <div className="history-header">
                    <span className="history-plan">{sub.planName}</span>
                    {getStatusBadge(sub.status)}
                  </div>
                  <div className="history-details">
                    <div className="history-row">
                      <Clock size={14} />
                      <span>Requested: {formatDate(sub.createdAt)}</span>
                    </div>
                    {sub.startDate && (
                      <div className="history-row">
                        <Calendar size={14} />
                        <span>Started: {formatDate(sub.startDate)}</span>
                      </div>
                    )}
                    {sub.endDate && (
                      <div className="history-row">
                        <Calendar size={14} />
                        <span>Ends: {formatDate(sub.endDate)}</span>
                      </div>
                    )}
                    {sub.rejectionReason && (
                      <div className="rejection-reason">
                        <AlertCircle size={14} />
                        <span>{sub.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && goldPlan && (
        <SubscribeModal
          plan={goldPlan}
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;
