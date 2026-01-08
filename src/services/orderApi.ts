import { ApiResponse, OrderResponse } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_URL;
// Example:
// VITE_API_URL=https://ayushman-backend-latest.onrender.com/api

/* =======================
   ENUM
======================= */

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/* =======================
   HELPER
======================= */

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ✅ ADD HELPER TO HANDLE 401 ERRORS
const handle401 = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/* =======================
   API
======================= */

export const orderApi = {
  /* -------- STUDENT -------- */

  async createOrder(
    request: any
  ): Promise<ApiResponse<OrderResponse>> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error(text || 'Failed to create order');
    }

    return response.json();
  },

  async getMyOrders(): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(
      `${API_BASE_URL}/orders/my-orders`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },

  async cancelOrder(orderId: number): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      let message = 'Failed to cancel order';
      try {
        const data = await response.json();
        message = data?.message || message;
      } catch {
        const text = await response.text();
        if (text) message = text;
      }
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error(message);
    }

    return response.json();
  },

  /* -------- CHEF -------- */

  async getChefOrders(): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(
      `${API_BASE_URL}/orders/chef/my-orders`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch chef orders');
    }

    return response.json();
  },

  async cancelChefOrder(orderId: number): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/orders/chef/${orderId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      let message = 'Failed to cancel chef order';
      try {
        const data = await response.json();
        message = data?.message || message;
      } catch {
        const text = await response.text();
        if (text) message = text;
      }
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error(message);
    }

    return response.json();
  },

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus
  ): Promise<ApiResponse<OrderResponse>> {
    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/status?status=${status}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to update order status');
    }

    return response.json();
  },

  /* -------- ADMIN -------- */

  async getAllOrders(): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch all orders');
    }

    return response.json();
  },

  async getOrdersByStatus(
    status: OrderStatus
  ): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(
      `${API_BASE_URL}/orders/status/${status}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch orders by status');
    }

    return response.json();
  },
};
