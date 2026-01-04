import { MenuItemResponse } from './chefApi';

const API_BASE_URL = import.meta.env.VITE_API_URL;
// Example:
// VITE_API_URL=https://ayushman-backend-latest.onrender.com/api

/* =======================
   TYPES
======================= */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

/* =======================
   HELPER
======================= */

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');

  // token OPTIONAL for public endpoints
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
};

/* =======================
   API
======================= */

export const menuApi = {
  // Get all menu items (Admin / Authenticated)
  async getAllMenuItems(): Promise<ApiResponse<MenuItemResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch menu items');
    }

    return response.json();
  },

  // Get available menu items (PUBLIC)
  async getAvailableMenuItems(): Promise<ApiResponse<MenuItemResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/menu/available`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch available menu items');
    }

    return response.json();
  },

  // Get menu item by ID (PUBLIC)
  async getMenuItemById(
    id: number
  ): Promise<ApiResponse<MenuItemResponse>> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu item');
    }

    return response.json();
  },

  // Get menu items by category (PUBLIC)
  async getMenuItemsByCategory(
    category: string
  ): Promise<ApiResponse<MenuItemResponse[]>> {
    const response = await fetch(
      `${API_BASE_URL}/menu/category/${category}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch menu items by category');
    }

    return response.json();
  },

  // Get menu items by chef (PUBLIC)
  async getMenuItemsByChef(
    chefId: number
  ): Promise<ApiResponse<MenuItemResponse[]>> {
    const response = await fetch(
      `${API_BASE_URL}/menu/chef/${chefId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch menu items by chef');
    }

    return response.json();
  },
};

