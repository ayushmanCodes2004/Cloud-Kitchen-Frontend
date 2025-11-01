const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  async register(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async login(data: any) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getMenuItems(token: string) {
    const response = await fetch(`${API_BASE_URL}/menu/available`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async getMyMenuItems(token: string) {
    const response = await fetch(`${API_BASE_URL}/chef/my-menu-items`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async createMenuItem(token: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async toggleAvailability(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/menu/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async placeOrder(token: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getMyOrders(token: string) {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};
