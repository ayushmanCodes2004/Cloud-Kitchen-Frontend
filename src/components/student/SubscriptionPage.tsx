import React, { useState, useEffect } from 'react';
import { subscriptionApi, SubscriptionPlan, SubscriptionResponse } from '../../services/subscriptionApi';
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Subscribe to {plan.name} Plan</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="payment-instructions">
            <h3>💳 Payment Instructions</h3>
            <p>Please make payment of <strong>₹{plan.price}</strong> using any of the following methods:</p>

            <div className="payment-methods">
              <div className="payment-method">
                <h4>📱 UPI</h4>
                <p>UPI ID: <strong>platepal@upi</strong></p>
                <p>Scan QR code or use UPI ID</p>
              </div>

              <div className="payment-method">
                <h4>🏦 Bank Transfer</h4>
                <p>Account: <strong>1234567890</strong></p>
                <p>IFSC: <strong>SBIN0001234</strong></p>
                <p>Name: <strong>PlatePal Services</strong></p>
              </div>

              <div className="payment-method">
                <h4>💵 Cash</h4>
                <p>Contact admin for cash payment</p>
                <p>Email: admin@platepal.com</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="subscription-form">
            <div className="form-group">
              <label>Payment Method *</label>
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

            <div className="form-group">
              <label>Transaction Reference / UTR Number *</label>
              <input
                type="text"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                placeholder="Enter transaction ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Screenshot URL (Optional)</label>
              <input
                type="url"
                value={invoiceUrl}
                onChange={(e) => setInvoiceUrl(e.target.value)}
                placeholder="https://example.com/screenshot.jpg"
              />
              <small>Upload screenshot to any image hosting service and paste URL here</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
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
    const badges: Record<string, { color: string; text: string }> = {
      PENDING: { color: '#FFA500', text: '⏳ Pending Approval' },
      ACTIVE: { color: '#4CAF50', text: '✅ Active' },
      EXPIRED: { color: '#9E9E9E', text: '⏰ Expired' },
      CANCELLED: { color: '#F44336', text: '❌ Cancelled' },
      REJECTED: { color: '#F44336', text: '❌ Rejected' },
    };

    const badge = badges[status] || { color: '#9E9E9E', text: status };
    return (
      <span className="status-badge" style={{ backgroundColor: badge.color }}>
        {badge.text}
      </span>
    );
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
    return <div className="loading">Loading subscription details...</div>;
  }

  if (!goldPlan) {
    return <div className="error">Failed to load subscription plan</div>;
  }

  const features = goldPlan.features?.split('|') || [];

  return (
    <div className="subscription-page">
      <div className="page-header">
        <h1>💎 Gold Subscription</h1>
        <p>Unlock premium features and save on every order!</p>
      </div>

      {/* Active Subscription Card */}
      {activeSubscription && (
        <div className="active-subscription-card">
          <div className="card-header">
            <h2>Your Active Subscription</h2>
            {getStatusBadge(activeSubscription.status)}
          </div>
          <div className="subscription-details">
            <div className="detail-item">
              <span className="label">Plan:</span>
              <span className="value">{activeSubscription.planName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Valid Until:</span>
              <span className="value">{formatDate(activeSubscription.endDate)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Days Remaining:</span>
              <span className="value highlight">{getDaysRemaining(activeSubscription.endDate)} days</span>
            </div>
            <div className="detail-item">
              <span className="label">Benefits:</span>
              <span className="value">
                {activeSubscription.discountPercentage}% discount + 
                {activeSubscription.platformFeeWaived ? ' ₹8 fee waived' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Gold Plan Card */}
      <div className="gold-plan-card">
        <div className="plan-badge">⭐ MOST POPULAR</div>
        <div className="plan-header">
          <h2>💎 {goldPlan.name} Plan</h2>
          <div className="plan-price">
            <span className="price">₹{goldPlan.price}</span>
            <span className="duration">/month</span>
          </div>
        </div>

        <div className="plan-features">
          <h3>✨ What You Get:</h3>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>
                <span className="check-icon">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="savings-example">
          <h3>💰 Savings Example:</h3>
          <div className="comparison">
            <div className="comparison-item">
              <h4>Without Gold</h4>
              <p>Order: ₹200</p>
              <p>Platform Fee: ₹8</p>
              <p>Tax: ₹4.16</p>
              <p className="total">Total: ₹212.16</p>
            </div>
            <div className="comparison-arrow">→</div>
            <div className="comparison-item highlight">
              <h4>With Gold</h4>
              <p>Order: ₹200</p>
              <p>Discount (5%): -₹10</p>
              <p>Platform Fee: ₹0</p>
              <p>Tax: ₹3.80</p>
              <p className="total">Total: ₹193.80</p>
            </div>
          </div>
          <p className="savings-text">💸 You save ₹18.36 per order!</p>
        </div>

        {!activeSubscription && (
          <button
            className="subscribe-btn"
            onClick={() => setShowModal(true)}
          >
            🚀 Subscribe Now
          </button>
        )}

        {activeSubscription && activeSubscription.status === 'ACTIVE' && (
          <div className="already-subscribed">
            ✅ You're already subscribed to Gold Plan!
          </div>
        )}
      </div>

      {/* Subscription History */}
      {subscriptions.length > 0 && (
        <div className="subscription-history">
          <h2>📜 Subscription History</h2>
          <div className="history-list">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="history-item">
                <div className="history-header">
                  <span className="plan-name">{sub.planName}</span>
                  {getStatusBadge(sub.status)}
                </div>
                <div className="history-details">
                  <p>Requested: {formatDate(sub.createdAt)}</p>
                  {sub.startDate && <p>Started: {formatDate(sub.startDate)}</p>}
                  {sub.endDate && <p>Ends: {formatDate(sub.endDate)}</p>}
                  {sub.rejectionReason && (
                    <p className="rejection-reason">Reason: {sub.rejectionReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
