export interface MenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  vegetarian?: boolean;
  preparationTime?: number;
}

export interface MenuItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  vegetarian: boolean;
  preparationTime: number;
  chefName: string;
  chefId: number;
  chefVerified?: boolean;
  chefAverageRating?: number;
  chefTotalRatings?: number;
  menuItemAverageRating?: number;
  menuItemTotalRatings?: number;
}