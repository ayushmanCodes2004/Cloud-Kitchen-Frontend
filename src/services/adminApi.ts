const API_BASE_URL = 'http://localhost:8080/api';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  verified?: boolean;
}

export const adminApi = {
  // Get all users
  getAllUsers: async (): Promise<UserResponse[]> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch users');
    return data.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<UserResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch user');
    return data.data;
  },

  // Deactivate user
  deactivateUser: async (id: number): Promise<UserResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/deactivate`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to deactivate user');
    return data.data;
  },

  // Activate user
  activateUser: async (id: number): Promise<UserResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/activate`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to activate user');
    return data.data;
  },

  // Get all chefs
  getAllChefs: async (): Promise<UserResponse[]> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/chefs`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch chefs');
    return data.data;
  },

  // Verify chef
  verifyChef: async (id: number): Promise<UserResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/chefs/${id}/verify`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to verify chef');
    return data.data;
  }
};