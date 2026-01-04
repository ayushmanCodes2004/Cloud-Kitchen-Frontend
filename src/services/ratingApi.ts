const API_BASE_URL = import.meta.env.VITE_API_URL;
// Example:
// VITE_API_URL=https://ayushman-backend-latest.onrender.com/api

/* =======================
   TYPES
======================= */

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

// ✅ ADD HELPER TO HANDLE 401 ERRORS
const handle401 = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/* =======================
   API
======================= */

export const ratingApi = {
  /* -------- CHEF RATINGS -------- */

  async rateChef(
    request: ChefRatingRequest
  ): Promise<RatingResponse> {
    const response = await fetch(
      `${API_BASE_URL}/ratings/chef`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const text = await response.text();
      throw new Error(text || 'Failed to rate chef');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async getChefRatings(
    chefId: number
  ): Promise<ChefRatingStats> {
    const response = await fetch(
      `${API_BASE_URL}/ratings/chef/${chefId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch chef ratings');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /* -------- MENU ITEM RATINGS -------- */

  async rateMenuItem(
    request: MenuItemRatingRequest
  ): Promise<RatingResponse> {
    const response = await fetch(
      `${API_BASE_URL}/ratings/menu-item`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const text = await response.text();
      throw new Error(text || 'Failed to rate menu item');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async getMenuItemRatings(
    menuItemId: number
  ): Promise<MenuItemRatingStats> {
    const response = await fetch(
      `${API_BASE_URL}/ratings/menu-item/${menuItemId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch menu item ratings');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  /* -------- MY RATINGS (Student) -------- */

  async getMyRatings(): Promise<{
    chefRatings: RatingResponse[];
    menuItemRatings: RatingResponse[];
  }> {
    const response = await fetch(
      `${API_BASE_URL}/ratings/my-ratings`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch my ratings');
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};
