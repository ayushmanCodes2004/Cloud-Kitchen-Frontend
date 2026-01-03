const API_BASE_URL = import.meta.env.VITE_API_URL;

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

export const chefApi = {
  // Get chef's menu items
  getMyMenuItems: async (): Promise<MenuItemResponse[]> => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No authentication token found. Please login again.');
    
    const response = await fetch(`${API_BASE_URL}/chef/my-menu-items`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized: Invalid or expired token');
      throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Create menu item
  createMenuItem: async (request: MenuItemRequest): Promise<MenuItemResponse> => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No authentication token found. Please login again.');
    
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized: Invalid or expired token');
      throw new Error(`Failed to create menu item: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update menu item
  updateMenuItem: async (id: number, request: MenuItemRequest): Promise<MenuItemResponse> => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No authentication token found. Please login again.');
    
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized: Invalid or expired token');
      throw new Error(`Failed to update menu item: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Delete menu item
  deleteMenuItem: async (id: number): Promise<void> => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No authentication token found. Please login again.');
    
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      let errorMessage = `Failed to delete menu item: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If response is not JSON, use statusText
      }
      
      if (response.status === 401) throw new Error('Unauthorized: Invalid or expired token');
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete menu item');
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
  },

  // Get chef's own ratings
  getMyRatings: async (): Promise<any> => {
    const token = sessionStorage.getItem('token');
    console.log('🔍 getMyRatings - Token present:', !!token);
    console.log('🔍 API URL:', `${API_BASE_URL}/chef/my-ratings`);
    
    const response = await fetch(`${API_BASE_URL}/chef/my-ratings`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('🔍 Raw response:', responseText);
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${responseText || response.statusText}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('✅ Parsed data:', data);
    
    if (!data.success) {
      console.error('❌ API returned success=false:', data.message);
      throw new Error(data.message || 'Failed to fetch ratings');
    }
    
    return data.data;
  }
};