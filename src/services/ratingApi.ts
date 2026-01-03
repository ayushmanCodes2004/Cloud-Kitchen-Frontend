const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface RatingRequest {
  rating: number;
  comment?: string;
}

export interface ChefRatingRequest extends RatingRequest {
  chefId: number;
  orderId: number;
}

export interface MenuItemRatingRequest extends RatingRequest {
  menuItemId: number;
  orderId: number;
}

export interface RatingResponse {
  id: number;
  rating: number;
  comment?: string;
  studentName: string;
  createdAt: string;
}

export interface ChefRatingStats {
  chefId: number;
  chefName: string;
  averageRating: number;
  totalRatings: number;
  ratings: RatingResponse[];
}

export interface MenuItemRatingStats {
  menuItemId: number;
  menuItemName: string;
  averageRating: number;
  totalRatings: number;
  ratings: RatingResponse[];
}

export const ratingApi = {
  // Chef Ratings
  rateChef: async (token: string, request: ChefRatingRequest): Promise<RatingResponse> => {
    try {
      console.log('=== CHEF RATING DEBUG ===');
      console.log('Request payload:', JSON.stringify(request, null, 2));
      console.log('Token present:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      console.log('API URL:', `${API_BASE_URL}/ratings/chef`);
      
      const response = await fetch(`${API_BASE_URL}/ratings/chef`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response body:', responseText);
      
      if (!response.ok) {
        console.error('=== CHEF RATING ERROR ===');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Response Body:', responseText);
        console.error('Request that failed:', JSON.stringify(request, null, 2));
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      if (!data.success) throw new Error(data.message || 'Failed to rate chef');
      console.log('=== CHEF RATING SUCCESS ===');
      return data.data;
    } catch (error) {
      console.error('=== CHEF RATING FINAL ERROR ===', error);
      throw error;
    }
  },

  getChefRatings: async (chefId: number, token?: string): Promise<ChefRatingStats> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/ratings/chef/${chefId}`, {
      headers
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Menu Item Ratings
  rateMenuItem: async (token: string, request: MenuItemRatingRequest): Promise<RatingResponse> => {
    try {
      console.log('=== MENU ITEM RATING DEBUG ===');
      console.log('Request payload:', JSON.stringify(request, null, 2));
      console.log('Token present:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      console.log('API URL:', `${API_BASE_URL}/ratings/menu-item`);
      
      const response = await fetch(`${API_BASE_URL}/ratings/menu-item`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response body:', responseText);
      
      if (!response.ok) {
        console.error('=== MENU ITEM RATING ERROR ===');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Response Body:', responseText);
        console.error('Request that failed:', JSON.stringify(request, null, 2));
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      if (!data.success) throw new Error(data.message || 'Failed to rate menu item');
      console.log('=== MENU ITEM RATING SUCCESS ===');
      return data.data;
    } catch (error) {
      console.error('=== MENU ITEM RATING FINAL ERROR ===', error);
      throw error;
    }
  },

  getMenuItemRatings: async (menuItemId: number, token?: string): Promise<MenuItemRatingStats> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/ratings/menu-item/${menuItemId}`, {
      headers
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Get all ratings for admin
  getAllRatings: async (token: string): Promise<{
    chefRatings: ChefRatingStats[];
    menuItemRatings: MenuItemRatingStats[];
  }> => {
    const response = await fetch(`${API_BASE_URL}/ratings/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Get rated order IDs for current student (chef ratings)
  getMyRatedOrders: async (token: string): Promise<number[]> => {
    const response = await fetch(`${API_BASE_URL}/ratings/my-rated-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Get rated menu items for current student (format: "orderId-menuItemId")
  getMyRatedMenuItems: async (token: string): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/ratings/my-rated-menu-items`, {
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
