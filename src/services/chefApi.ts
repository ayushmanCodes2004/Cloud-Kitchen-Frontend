const API_BASE_URL = 'http://localhost:8080/api';

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
}

export const chefApi = {
  // Get chef's menu items
  getMyMenuItems: async (): Promise<MenuItemResponse[]> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/chef/my-menu-items`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Create menu item
  createMenuItem: async (request: MenuItemRequest): Promise<MenuItemResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update menu item
  updateMenuItem: async (id: number, request: MenuItemRequest): Promise<MenuItemResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Delete menu item
  deleteMenuItem: async (id: number): Promise<void> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  },

  // Toggle menu item availability
  toggleAvailability: async (id: number): Promise<MenuItemResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: string): Promise<any> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${status}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
};