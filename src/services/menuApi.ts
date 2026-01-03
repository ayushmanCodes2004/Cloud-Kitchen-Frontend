import { MenuItemResponse } from './chefApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const menuApi = {
  // Get all menu items
  getAllMenuItems: async (): Promise<ApiResponse<MenuItemResponse[]>> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Get available menu items
  getAvailableMenuItems: async (): Promise<ApiResponse<MenuItemResponse[]>> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/available`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Get menu item by ID
  getMenuItemById: async (id: number): Promise<ApiResponse<MenuItemResponse>> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Get menu items by category
  getMenuItemsByCategory: async (category: string): Promise<ApiResponse<MenuItemResponse[]>> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/category/${category}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Get menu items by chef
  getMenuItemsByChef: async (chefId: number): Promise<ApiResponse<MenuItemResponse[]>> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/chef/${chefId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};
