
 const API_ROOT = import.meta.env.VITE_API_URL;
 // VITE_API_URL = https://ayushman-backend-latest.onrender.com/api
 const API_BASE_URL = `${API_ROOT}/ai`;

 /* =======================
    Types
 ======================= */

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

 /* =======================
    API
 ======================= */

 export const aiApi = {
   // Get menu combinations
   async getSuggestedCombinations(
     itemCount: number = 3
   ): Promise<AiResponse> {
     try {
       const response = await fetch(
         `${API_BASE_URL}/suggest-combinations-with-items?itemCount=${itemCount}`,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       const data = await response.json();

       return {
         success: response.ok,
         ...data,
       };
     } catch (error) {
       return {
         success: false,
         error: "Failed to fetch combinations",
         message: error instanceof Error ? error.message : "Unknown error",
       };
     }
   },

   // Get pairing suggestions
   async getSuggestedPairings(
     menuItemId: number
   ): Promise<AiResponse> {
     try {
       const response = await fetch(
         `${API_BASE_URL}/suggest-pairings/${menuItemId}`,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       const data = await response.json();

       return {
         success: response.ok,
         ...data,
       };
     } catch (error) {
       return {
         success: false,
         error: "Failed to fetch pairings",
         message: error instanceof Error ? error.message : "Unknown error",
       };
     }
   },

   // Get meal recommendations
   async getMealRecommendations(preferences?: {
     vegetarian?: boolean;
     maxBudget?: number;
     cuisineType?: string;
     dietary?: string;
   }): Promise<AiResponse> {
     try {
       const response = await fetch(
         `${API_BASE_URL}/get-recommendations-with-items`,
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(preferences ?? {}),
         }
       );

       const data = await response.json();

       return {
         success: response.ok,
         ...data,
       };
     } catch (error) {
       return {
         success: false,
         error: "Failed to fetch recommendations",
         message: error instanceof Error ? error.message : "Unknown error",
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
         data: text,
       };
     } catch (error) {
       return {
         success: false,
         error: "AI service down",
       };
     }
   },
 };

