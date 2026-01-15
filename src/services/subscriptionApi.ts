const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  discountPercentage: number;
  platformFeeWaived: boolean;
  features: string;
  isActive: boolean;
  createdAt: string;
}

export interface SubscriptionRequest {
  planId: number;
  paymentInvoiceUrl: string;
  paymentMethod: string;
  transactionReference: string;
}

export interface SubscriptionResponse {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  planId: number;
  planName: string;
  planPrice: number;
  discountPercentage: number;
  platformFeeWaived: boolean;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'REJECTED';
  paymentInvoiceUrl: string;
  paymentMethod: string;
  transactionReference: string;
  startDate: string;
  endDate: string;
  approvedBy: number;
  approvedAt: string;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
};

const handle401 = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const subscriptionApi = {
  // Get all active plans
  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await fetch(`${API_URL}/subscriptions/plans`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch plans');
    }
    return response.json();
  },

  // Get Gold plan
  getGoldPlan: async (): Promise<SubscriptionPlan> => {
    const response = await fetch(`${API_URL}/subscriptions/plans/gold`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch Gold plan');
    }
    return response.json();
  },

  // Create subscription request
  createSubscriptionRequest: async (request: SubscriptionRequest): Promise<SubscriptionResponse> => {
    const response = await fetch(`${API_URL}/subscriptions/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      const error = await response.json();
      throw new Error(error.message || 'Failed to create subscription request');
    }
    return response.json();
  },

  // Get my subscriptions
  getMySubscriptions: async (): Promise<SubscriptionResponse[]> => {
    const response = await fetch(`${API_URL}/subscriptions/my-subscriptions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch subscriptions');
    }
    return response.json();
  },

  // Get active subscription
  getActiveSubscription: async (): Promise<SubscriptionResponse | null> => {
    const response = await fetch(`${API_URL}/subscriptions/active`, {
      headers: getAuthHeaders(),
    });
    if (response.status === 204) {
      return null;
    }
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch active subscription');
    }
    return response.json();
  },

  // Get pending subscriptions (Admin)
  getPendingSubscriptions: async (): Promise<SubscriptionResponse[]> => {
    const response = await fetch(`${API_URL}/subscriptions/pending`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch pending subscriptions');
    }
    return response.json();
  },

  // Get all subscriptions (Admin)
  getAllSubscriptions: async (): Promise<SubscriptionResponse[]> => {
    const response = await fetch(`${API_URL}/subscriptions/all`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch all subscriptions');
    }
    return response.json();
  },

  // Approve subscription (Admin)
  approveSubscription: async (subscriptionId: number, adminId: number): Promise<SubscriptionResponse> => {
    const response = await fetch(
      `${API_URL}/subscriptions/${subscriptionId}/approve?adminId=${adminId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      if (response.status === 401) handle401();
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve subscription');
    }
    return response.json();
  },

  // Reject subscription (Admin)
  rejectSubscription: async (subscriptionId: number, reason: string, adminId: number): Promise<SubscriptionResponse> => {
    const response = await fetch(
      `${API_URL}/subscriptions/${subscriptionId}/reject?reason=${encodeURIComponent(reason)}&adminId=${adminId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      if (response.status === 401) handle401();
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject subscription');
    }
    return response.json();
  },
};
