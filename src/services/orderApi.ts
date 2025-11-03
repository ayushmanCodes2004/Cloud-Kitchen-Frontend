import { ApiResponse, OrderResponse } from '@/types/api.types';

const API_BASE_URL = 'http://localhost:8080/api';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export const orderApi = {
  // Place a new order
  async createOrder(token: string, request: any): Promise<ApiResponse<OrderResponse>> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    return response.json();
  },

  // Get orders for the current student
  async getMyOrders(token: string): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Cancel an order
  async cancelOrder(token: string, orderId: number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Admin: Get all orders
  async getAllOrders(token: string): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Admin: Get orders by status
  async getOrdersByStatus(token: string, status: OrderStatus): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/orders/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Admin/Chef: Update order status
  async updateOrderStatus(token: string, orderId: number, status: OrderStatus): Promise<ApiResponse<OrderResponse>> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${status}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Chef: Get chef's orders (orders containing their menu items)
  async getChefOrders(token: string): Promise<ApiResponse<OrderResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/orders/chef/my-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};