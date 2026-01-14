import { MenuItemResponse } from './chefApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface Favourite {
  id: number;
  menuItem: MenuItemResponse;
  createdAt: string;
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

export const favouriteApi = {
  async getMyFavourites(): Promise<ApiResponse<Favourite[]>> {
    const response = await fetch(`${API_BASE_URL}/favourites`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch favourites');
    }

    return response.json();
  },

  async getFavouriteIds(): Promise<ApiResponse<number[]>> {
    const response = await fetch(`${API_BASE_URL}/favourites/ids`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch favourite IDs');
    }

    return response.json();
  },

  async addFavourite(menuItemId: number): Promise<ApiResponse<Favourite>> {
    const response = await fetch(`${API_BASE_URL}/favourites/${menuItemId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to add favourite');
    }

    return response.json();
  },

  async removeFavourite(menuItemId: number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/favourites/${menuItemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to remove favourite');
    }

    return response.json();
  },

  async checkFavourite(menuItemId: number): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/favourites/check/${menuItemId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to check favourite status');
    }

    return response.json();
  },
};
