const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/* =======================
   TYPES
======================= */

export interface ChefLocationDTO {
  id: number;
  name: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  verified: boolean;
  address: string;
  latitude: number;
  longitude: number;
  distance: number; // Distance from student in km
}

export interface NearbyChefRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* =======================
   API
======================= */

export const chefLocationApi = {
  /**
   * Get nearby chefs based on location and radius
   */
  async getNearbyChefs(request: NearbyChefRequest): Promise<ApiResponse<ChefLocationDTO[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/chef-location/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch nearby chefs: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching nearby chefs:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch nearby chefs',
        data: [],
      };
    }
  },

  /**
   * Get all chefs with location data
   */
  async getAllChefsWithLocation(): Promise<ApiResponse<ChefLocationDTO[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/chef-location/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chefs: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching chefs:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch chefs',
        data: [],
      };
    }
  },
};
