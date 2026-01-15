const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface CustomMealItemRequest {
  menuItemId: number;
  quantity: number;
  aiReason?: string;
}

export interface CustomMealItemResponse {
  id: number;
  menuItemId: number;
  menuItemName: string;
  menuItemPrice: number;
  menuItemImage: string;
  quantity: number;
  chefId: number;
  chefName: string;
  aiReason: string;
}

export interface CustomMealRequest {
  name: string;
  description: string;
  aiGenerated: boolean;
  aiPrompt?: string;
  items: CustomMealItemRequest[];
}

export interface CustomMealResponse {
  id: number;
  studentId: number;
  name: string;
  description: string;
  totalPrice: number;
  aiGenerated: boolean;
  aiPrompt: string;
  nutritionalScore: number;
  timesOrdered: number;
  items: CustomMealItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface AIMealGenerationRequest {
  userInput: string;
  budget?: number;
  dietaryPreferences?: string[];
  allergies?: string[];
  occasion?: string;
}

export interface AIMealItem {
  menuItemId: number;
  name: string;
  price: number;
  reason: string;
  quantity: number;
  chefId: number;
  chefName: string;
}

export interface AIMealGenerationResponse {
  mealName: string;
  description: string;
  items: AIMealItem[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  totalPrice: number;
  tags: string[];
  nutritionalScore: number;
}

export interface MealAnalysis {
  score: number;
  strengths: string[];
  suggestions: string[];
  bestFor: string[];
  healthBenefits: string[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
};

const handle401 = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const customMealApi = {
  // Generate AI meal (Premium feature)
  generateAIMeal: async (request: AIMealGenerationRequest): Promise<AIMealGenerationResponse> => {
    const response = await fetch(`${API_URL}/api/custom-meals/ai/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      if (response.status === 403) {
        const error = await response.json();
        throw new Error(error.message || 'Premium feature - subscription required');
      }
      throw new Error('Failed to generate AI meal');
    }
    return response.json();
  },

  // Get smart recommendations (Premium feature)
  getSmartRecommendations: async (currentItemIds: number[]): Promise<AIMealItem[]> => {
    const response = await fetch(`${API_URL}/api/custom-meals/ai/recommendations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(currentItemIds),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      if (response.status === 403) {
        throw new Error('Premium feature - subscription required');
      }
      throw new Error('Failed to get recommendations');
    }
    return response.json();
  },

  // Analyze meal (Premium feature)
  analyzeMeal: async (mealName: string, itemIds: number[]): Promise<MealAnalysis> => {
    const response = await fetch(`${API_URL}/api/custom-meals/ai/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mealName, itemIds }),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      if (response.status === 403) {
        throw new Error('Premium feature - subscription required');
      }
      throw new Error('Failed to analyze meal');
    }
    return response.json();
  },

  // Create custom meal
  createCustomMeal: async (request: CustomMealRequest): Promise<CustomMealResponse> => {
    const response = await fetch(`${API_URL}/api/custom-meals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to create custom meal');
    }
    return response.json();
  },

  // Get my custom meals
  getMyCustomMeals: async (): Promise<CustomMealResponse[]> => {
    const response = await fetch(`${API_URL}/api/custom-meals`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch custom meals');
    }
    return response.json();
  },

  // Get custom meal by ID
  getCustomMealById: async (id: number): Promise<CustomMealResponse> => {
    const response = await fetch(`${API_URL}/api/custom-meals/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to fetch custom meal');
    }
    return response.json();
  },

  // Delete custom meal
  deleteCustomMeal: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/custom-meals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to delete custom meal');
    }
  },

  // Increment times ordered
  incrementTimesOrdered: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/custom-meals/${id}/order`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) handle401();
      throw new Error('Failed to increment times ordered');
    }
  },
};
