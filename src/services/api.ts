const API_BASE_URL = import.meta.env.VITE_API_URL;
// Example:
// VITE_API_URL = https://ayushman-backend-latest.onrender.com/api

import { ApiResponse, Order, OrderRequest } from '@/types/api';
import { MenuItemRequest, MenuItemResponse } from '@/types/menu';

export const api = {
  /* =======================
     AUTH
  ======================= */

  async register(role: string, data: any) {
    const response = await fetch(
      `${API_BASE_URL}/auth/register/${role}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  async login(data: any) {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  /* =======================
     MENU
  ======================= */

  async getMenuItems(token: string) {
    const response = await fetch(
      `${API_BASE_URL}/menu/available`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  },

  async getMyMenuItems(
    token: string
  ): Promise<ApiResponse<MenuItemResponse[]>> {
    const response = await fetch(
      `${API_BASE_URL}/chef/my-menu-items`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  },

  async createMenuItem(
    token: string,
    data: MenuItemRequest
  ) {
    const response = await fetch(
      `${API_BASE_URL}/menu`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  async toggleAvailability(
    token: string,
    id: string
  ) {
    const response = await fetch(
      `${API_BASE_URL}/menu/${id}/toggle-availability`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  },

  /* =======================
     ORDERS
  ======================= */

  async placeOrder(
    token: string,
    data: OrderRequest
  ): Promise<ApiResponse<Order>> {
    const response = await fetch(
      `${API_BASE_URL}/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  async getMyOrders(token: string) {
    const response = await fetch(
      `${API_BASE_URL}/orders/my-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  },
};

