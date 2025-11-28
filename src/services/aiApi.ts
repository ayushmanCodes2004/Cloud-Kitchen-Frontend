const API_BASE_URL = 'http://localhost:8080/api/ai';

export interface MenuCombination {
  itemName: string;
  price: number;
  reason: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  vegetarian: boolean;
  category: string;
  chefName: string;
  chefAverageRating: number;
  [key: string]: any;
}

// Response format for AI responses with menu items
export interface AiResponse {
  success: boolean;
  explanation?: string;
  items?: MenuItem[];
  totalPrice?: number;
  error?: string;
  message?: string;
}

export interface AiCombinationResponse extends AiResponse {}
export interface AiPairingResponse extends AiResponse {}
export interface AiRecommendationResponse extends AiResponse {}

export const aiApi = {
  // Get menu combinations with items
  async getSuggestedCombinations(itemCount: number = 3): Promise<AiResponse> {
    try {
      console.log('Fetching combinations with itemCount:', itemCount);
      const response = await fetch(`${API_BASE_URL}/suggest-combinations-with-items?itemCount=${itemCount}`);
      const json = await response.json();
      console.log('Combinations response:', json);
      return {
        success: response.ok,
        ...json
      };
    } catch (error) {
      console.error('Error fetching combinations:', error);
      return {
        success: false,
        error: 'Failed to fetch combinations',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get pairing suggestions for a menu item
  async getSuggestedPairings(menuItemId: number): Promise<AiResponse> {
    try {
      console.log('Fetching pairings for menuItemId:', menuItemId);
      const response = await fetch(`${API_BASE_URL}/suggest-pairings/${menuItemId}`);
      const json = await response.json();
      console.log('Pairings response:', json);
      return {
        success: response.ok,
        ...json
      };
    } catch (error) {
      console.error('Error fetching pairings:', error);
      return {
        success: false,
        error: 'Failed to fetch pairings',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get meal recommendations based on preferences
  async getMealRecommendations(preferences?: {
    vegetarian?: boolean;
    maxBudget?: number;
    cuisineType?: string;
    dietary?: string;
  }): Promise<AiResponse> {
    try {
      console.log('Sending recommendations request with preferences:', preferences);
      const response = await fetch(`${API_BASE_URL}/get-recommendations-with-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences || {})
      });
      console.log('Response status:', response.status, response.statusText);
      const json = await response.json();
      console.log('Recommendations response:', json);
      return {
        success: response.ok,
        ...json
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return {
        success: false,
        error: 'Failed to fetch recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const text = await response.text();
      return {
        success: response.ok,
        data: text
      };
    } catch (error) {
      console.error('Error checking AI service health:', error);
      return { success: false, error: 'Service down' };
    }
  }
};
