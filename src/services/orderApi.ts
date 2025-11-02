import { ApiResponse, OrderResponse } from '@/types/api.types';

const API_BASE_URL = 'http://localhost:8080/api';

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
  }
};