import React, { useState, useEffect } from 'react';
import { subscriptionApi, SubscriptionResponse } from '../../services/subscriptionApi';
import { 
  Crown, Check, X, Clock, Calendar, User, Mail, 
  CreditCard, FileText, AlertCircle, TrendingUp,
  Users, DollarSign, Activity, Eye, CheckCircle, XCircle,
  Ban, Trash2
} from 'lucide-react';
import './AdminSubscriptions.css';

const AdminSubscriptions: React.FC = () => {
  const [pendingSubscriptions, setPendingSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadSubscriptions();
    // Auto-refresh removed per user request
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

  const handleDisable = async (subscriptionId: number) => {
    const reason = prompt('Enter reason for disabling this subscription:');
    if (!reason) {
      return;
    }

    if (!confirm('Are you sure you want to disable this active subscription? The student will lose all Gold Plan benefits immediately.')) {
      return;
    }

    setProcessingId(subscriptionId);
    try {
      const adminId = Number(localStorage.getItem('userId'));
      await subscriptionApi.disableSubscription(subscriptionId, reason, adminId);
      alert('Subscription disabled successfully! Student has lost Gold Plan benefits.');
      loadSubscriptions();
    } catch (error: any) {
      alert(error.message || 'Failed to disable subscription');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (subscriptionId: number) => {
    if (!confirm('Are you sure you want to permanently delete this subscription? This action cannot be undone.')) {
      return;
    }

    setProcessingId(subscriptionId);
    try {
      await subscriptionApi.deleteSubscription(subscriptionId);
      alert('Subscription deleted successfully!');
      loadSubscriptions();
    } catch (error: any) {
      alert(error.message || 'Failed to delete subscription');
    } finally {
      setProcessingId(null);
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
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const formatDateOnly = (dateString: string) => {
    if (!dateString) return 'N/A';
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
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const renderSubscriptionCard = (sub: SubscriptionResponse) => (
    <div key={sub.id} className="sub-card">
      <div className="sub-header">
        <div className="student-info">
          <div className="student-name">
            <User size={16} />
            <span>{sub.studentName}</span>
          </div>
          <div className="student-email">
            <Mail size={14} />
            <span>{sub.studentEmail}</span>
          </div>
        </div>
        {getStatusBadge(sub.status)}
      </div>

      <div className="sub-body">
        {/* Plan Details Section */}
        <div className="info-section">
          <div className="section-title">
            <Crown size={16} />
            <span>Plan Details</span>
          </div>
          <div className="info-row">
            <span className="info-label">Plan</span>
            <span className="info-value">{sub.planName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Price</span>
            <span className="info-value">₹{sub.planPrice}</span>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="info-section">
          <div className="section-title">
            <CreditCard size={16} />
            <span>Payment Information</span>
          </div>
          <div className="info-row">
            <span className="info-label">Payment Method</span>
            <span className="info-value">{sub.paymentMethod}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Transaction Reference</span>
            <span className="info-value">{sub.transactionReference}</span>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="info-section">
          <div className="section-title">
            <Calendar size={16} />
            <span>Timeline</span>
          </div>
          <div className="info-row">
            <span className="info-label">Requested</span>
            <span className="info-value">{formatDateOnly(sub.createdAt)}</span>
          </div>
          {sub.startDate && (
            <div className="info-row">
              <span className="info-label">Start Date</span>
              <span className="info-value">{formatDate(sub.startDate)}</span>
            </div>
          )}
          {sub.endDate && (
            <div className="info-row">
              <span className="info-label">End Date</span>
              <span className="info-value">{formatDate(sub.endDate)}</span>
            </div>
          )}
          {sub.status === 'ACTIVE' && sub.endDate && (
            <div className="info-row highlight-row">
              <span className="info-label">Days Remaining</span>
              <span className="info-value highlight">{getDaysRemaining(sub.endDate)} days</span>
            </div>
          )}
        </div>

        {sub.paymentInvoiceUrl && (
          <div className="invoice-row">
            <FileText size={16} />
            <span>Payment Screenshot</span>
            <a
              href={sub.paymentInvoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="view-link"
            >
              <Eye size={14} />
              View
            </a>
          </div>
        )}

        {sub.rejectionReason && (
          <div className="rejection-box">
            <AlertCircle size={16} />
            <div>
              <strong>Rejection Reason</strong>
              <p>{sub.rejectionReason}</p>
            </div>
          </div>
        )}

        {sub.status === 'PENDING' && (
          <div className="action-row">
            <button
              className="btn-approve"
              onClick={() => handleApprove(sub.id)}
              disabled={processingId === sub.id}
            >
              <CheckCircle size={16} />
              {processingId === sub.id ? 'Processing...' : 'Approve'}
            </button>
            <button
              className="btn-reject"
              onClick={() => handleReject(sub.id)}
              disabled={processingId === sub.id}
            >
              <XCircle size={16} />
              {processingId === sub.id ? 'Processing...' : 'Reject'}
            </button>
          </div>
        )}

        {sub.status === 'ACTIVE' && (
          <div className="action-row">
            <button
              className="btn-disable"
              onClick={() => handleDisable(sub.id)}
              disabled={processingId === sub.id}
            >
              <Ban size={16} />
              {processingId === sub.id ? 'Processing...' : 'Disable'}
            </button>
            <button
              className="btn-delete"
              onClick={() => handleDelete(sub.id)}
              disabled={processingId === sub.id}
            >
              <Trash2 size={16} />
              {processingId === sub.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}

        {(sub.status === 'REJECTED' || sub.status === 'CANCELLED' || sub.status === 'EXPIRED') && (
          <div className="action-row">
            <button
              className="btn-delete"
              onClick={() => handleDelete(sub.id)}
              disabled={processingId === sub.id}
            >
              <Trash2 size={16} />
              {processingId === sub.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  const activeCount = allSubscriptions.filter(s => s.status === 'ACTIVE').length;
  const monthlyRevenue = allSubscriptions
    .filter(s => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + s.planPrice, 0);

  return (
    <div className="admin-subscriptions">
      {/* Main Container */}
      <div className="main-container">
        
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card pending">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{pendingSubscriptions.length}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
          </div>

          <div className="stat-card active">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{activeCount}</div>
              <div className="stat-label">Active Subscriptions</div>
            </div>
          </div>

          <div className="stat-card total">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{allSubscriptions.length}</div>
              <div className="stat-label">Total Subscriptions</div>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹{monthlyRevenue}</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={16} />
            Pending
            {pendingSubscriptions.length > 0 && (
              <span className="tab-badge">{pendingSubscriptions.length}</span>
            )}
          </button>
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FileText size={16} />
            All Subscriptions
            <span className="tab-badge">{allSubscriptions.length}</span>
          </button>
        </div>

        {/* Subscriptions List */}
        <div className="section">
          {activeTab === 'pending' && (
            <>
              {pendingSubscriptions.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle size={48} />
                  <p>No Pending Requests</p>
                  <p className="empty-subtitle">All subscription requests have been processed</p>
                </div>
              ) : (
                <div className="subs-list">
                  {pendingSubscriptions.map(renderSubscriptionCard)}
                </div>
              )}
            </>
          )}

          {activeTab === 'all' && (
            <>
              {allSubscriptions.length === 0 ? (
                <div className="empty-state">
                  <Users size={48} />
                  <p>No Subscriptions Yet</p>
                  <p className="empty-subtitle">No students have subscribed to any plan</p>
                </div>
              ) : (
                <div className="subs-list">
                  {allSubscriptions.map(renderSubscriptionCard)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
