// api.ts or services/api.ts - ADD THESE FUNCTIONS

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

    const result = await response.json();

    // ✅ SAVE TOKEN AFTER REGISTRATION
    if (result.success && result.data?.token) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
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

    const result = await response.json();

    // ✅ SAVE TOKEN AFTER LOGIN
    if (result.success && result.data?.token) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
  },

  // ✅ ADD LOGOUT FUNCTION
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // ✅ ADD GET TOKEN FUNCTION
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // ✅ ADD GET USER FUNCTION
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ✅ ADD VERIFY TOKEN FUNCTION
  async verifyToken(token: string) {
    const response = await fetch(
      `${API_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Token is invalid/expired
      this.logout();
      return null;
    }

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

    // ✅ HANDLE 401 UNAUTHORIZED
    if (response.status === 401) {
      this.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },

  async getMyMenuItems(token: string) {
    const response = await fetch(
      `${API_BASE_URL}/chef/my-menu-items`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ HANDLE 401 UNAUTHORIZED
    if (response.status === 401) {
      this.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },

  async createMenuItem(token: string, data: any) {
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

    // ✅ HANDLE 401 UNAUTHORIZED
    if (response.status === 401) {
      this.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },

  async toggleAvailability(token: string, id: string) {
    const response = await fetch(
      `${API_BASE_URL}/menu/${id}/toggle-availability`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ HANDLE 401 UNAUTHORIZED
    if (response.status === 401) {
      this.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },

  /* =======================
     ORDERS
  ======================= */

  async placeOrder(token: string, data: any) {
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

    // ✅ HANDLE 401 UNAUTHORIZED
    if (response.status === 401) {
      this.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

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

    // ✅ HANDLE 401 UNAUTHORIZED
    if (response.status === 401) {
      this.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },
};

