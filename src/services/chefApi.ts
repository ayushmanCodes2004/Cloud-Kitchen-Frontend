const API_BASE_URL = import.meta.env.VITE_API_URL;

/* =======================
   TYPES
======================= */

export interface MenuItemRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  vegetarian?: boolean;
  preparationTime?: number;
}

export interface MenuItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  vegetarian: boolean;
  preparationTime: number;
  chefName: string;
  chefId: number;
  chefVerified?: boolean;
  chefAverageRating?: number;
  chefTotalRatings?: number;
  menuItemAverageRating?: number;
  menuItemTotalRatings?: number;
}

/* =======================
   HELPER
======================= */

const getAuthHeaders = () => {
  // ✅ CHANGED FROM sessionStorage TO localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/* =======================
   API
======================= */

export const chefApi = {
  /* -------- MENU ITEMS -------- */

  async getMyMenuItems(): Promise<MenuItemResponse[]> {
    const response = await fetch(
      `${API_BASE_URL}/chef/my-menu-items`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // ✅ Clear storage and redirect on 401
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error(`Failed to fetch menu items`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async createMenuItem(
    request: MenuItemRequest
  ): Promise<MenuItemResponse> {
    const response = await fetch(
      `${API_BASE_URL}/menu`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error(`Failed to create menu item`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async updateMenuItem(
    id: number,
    request: MenuItemRequest
  ): Promise<MenuItemResponse> {
    const response = await fetch(
      `${API_BASE_URL}/menu/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error(`Failed to update menu item`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async deleteMenuItem(id: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/menu/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const text = await response.text();
      throw new Error(text || 'Failed to delete menu item');
    }
  },

  async toggleAvailability(id: number): Promise<MenuItemResponse> {
    const response = await fetch(
      `${API_BASE_URL}/menu/${id}/toggle-availability`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error('Failed to toggle availability');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /* -------- ORDERS -------- */

  async updateOrderStatus(
    orderId: number,
    status: string
  ): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/status?status=${status}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized: Token expired or invalid');
      }
      throw new Error('Failed to update order status');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /* -------- RATINGS -------- */

  async getMyRatings(): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/chef/my-ratings`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const text = await response.text();
      throw new Error(text || 'Failed to fetch ratings');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};
