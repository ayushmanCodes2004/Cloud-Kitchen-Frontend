import { api } from './api';

export const chatApi = {
  async getChatMessages(orderId: number, token: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/chat/order/${orderId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      api.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },

  async isChatEnabled(orderId: number, token: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/chat/order/${orderId}/enabled`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      api.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },

  async getActiveChatSessions(token: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/chat/my-active-sessions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      api.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response.json();
  },
};