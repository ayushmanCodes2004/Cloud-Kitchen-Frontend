import React, { useState, useEffect } from 'react';
import { subscriptionApi, SubscriptionResponse } from '../../services/subscriptionApi';
import './AdminSubscriptions.css';

const AdminSubscriptions: React.FC = () => {
  const [pendingSubscriptions, setPendingSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadSubscriptions();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSubscriptions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const [pending, all] = await Promise.all([
        subscriptionApi.getPendingSubscriptions(),
        subscriptionApi.getAllSubscriptions(),
      ]);

      setPendingSubscriptions(pending);
      setAllSubscriptions(all);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (subscriptionId: number) => {
    if (!confirm('Are you sure you want to approve this subscription?')) {
      return;
    }

    setProcessingId(subscriptionId);
    try {
      const adminId = Number(localStorage.getItem('userId'));
      await subscriptionApi.approveSubscription(subscriptionId, adminId);
      alert('Subscription approved successfully!');
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve subscription');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (subscriptionId: number) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) {
      return;
    }

    setProcessingId(subscriptionId);
    try {
      const adminId = Number(localStorage.getItem('userId'));
      await subscriptionApi.rejectSubscription(subscriptionId, reason, adminId);
      alert('Subscription rejected successfully!');
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject subscription');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      PENDING: { color: '#FFA500', text: '⏳ Pending' },
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysRemaining = (endDate: string) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const renderSubscriptionCard = (sub: SubscriptionResponse) => (
    <div key={sub.id} className="subscription-card">
      <div className="card-header">
        <div className="student-info">
          <h3>{sub.studentName}</h3>
          <p>{sub.studentEmail}</p>
        </div>
        {getStatusBadge(sub.status)}
      </div>

      <div className="card-body">
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Plan:</span>
            <span className="value">{sub.planName}</span>
          </div>
          <div className="info-item">
            <span className="label">Price:</span>
            <span className="value">₹{sub.planPrice}</span>
          </div>
          <div className="info-item">
            <span className="label">Payment Method:</span>
            <span className="value">{sub.paymentMethod}</span>
          </div>
          <div className="info-item">
            <span className="label">Transaction Ref:</span>
            <span className="value">{sub.transactionReference}</span>
          </div>
          <div className="info-item">
            <span className="label">Requested:</span>
            <span className="value">{formatDate(sub.createdAt)}</span>
          </div>
          {sub.startDate && (
            <div className="info-item">
              <span className="label">Start Date:</span>
              <span className="value">{formatDate(sub.startDate)}</span>
            </div>
          )}
          {sub.endDate && (
            <div className="info-item">
              <span className="label">End Date:</span>
              <span className="value">{formatDate(sub.endDate)}</span>
            </div>
          )}
          {sub.status === 'ACTIVE' && sub.endDate && (
            <div className="info-item">
              <span className="label">Days Remaining:</span>
              <span className="value highlight">{getDaysRemaining(sub.endDate)} days</span>
            </div>
          )}
        </div>

        {sub.paymentInvoiceUrl && (
          <div className="invoice-section">
            <span className="label">Payment Screenshot:</span>
            <a
              href={sub.paymentInvoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="view-invoice-btn"
            >
              🔍 View Screenshot
            </a>
          </div>
        )}

        {sub.rejectionReason && (
          <div className="rejection-reason">
            <strong>Rejection Reason:</strong> {sub.rejectionReason}
          </div>
        )}

        {sub.status === 'PENDING' && (
          <div className="action-buttons">
            <button
              className="approve-btn"
              onClick={() => handleApprove(sub.id)}
              disabled={processingId === sub.id}
            >
              {processingId === sub.id ? 'Processing...' : '✅ Approve'}
            </button>
            <button
              className="reject-btn"
              onClick={() => handleReject(sub.id)}
              disabled={processingId === sub.id}
            >
              {processingId === sub.id ? 'Processing...' : '❌ Reject'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading subscriptions...</div>;
  }

  return (
    <div className="admin-subscriptions">
      <div className="page-header">
        <h1>💎 Subscription Management</h1>
        <p>Manage student subscription requests and active subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{pendingSubscriptions.length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{allSubscriptions.filter(s => s.status === 'ACTIVE').length}</h3>
            <p>Active Subscriptions</p>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{allSubscriptions.length}</h3>
            <p>Total Subscriptions</p>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>
              ₹{allSubscriptions
                .filter(s => s.status === 'ACTIVE')
                .reduce((sum, s) => sum + s.planPrice, 0)}
            </h3>
            <p>Monthly Revenue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending ({pendingSubscriptions.length})
        </button>
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📋 All Subscriptions ({allSubscriptions.length})
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="subscriptions-list">
        {activeTab === 'pending' && (
          <>
            {pendingSubscriptions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Pending Requests</h3>
                <p>All subscription requests have been processed</p>
              </div>
            ) : (
              pendingSubscriptions.map(renderSubscriptionCard)
            )}
          </>
        )}

        {activeTab === 'all' && (
          <>
            {allSubscriptions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Subscriptions Yet</h3>
                <p>No students have subscribed to any plan</p>
              </div>
            ) : (
              allSubscriptions.map(renderSubscriptionCard)
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;
