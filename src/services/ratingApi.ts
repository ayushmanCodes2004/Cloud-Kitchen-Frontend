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
  const token = sessionStorage.getItem('token');
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
      const text = await response.text();

