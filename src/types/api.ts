export interface OrderItem {
  menuItemId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItem[];
  deliveryAddress: string;
  specialInstructions?: string;
}

export interface MenuItem {
  id: number;  // Changed from string to number to match backend
  name: string;
  description: string;
  price: number;
  category: string;
  vegetarian: boolean;
  available: boolean;
  chefName: string;
  chefId: number;
  preparationTime?: number;
}

export interface Order {
  id: number;
  items: Array<{
    id: number;
    menuItem: MenuItem;
    quantity: number;
    price: number;
  }>;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  orderDate: string;
  deliveryAddress: string;
  specialInstructions?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}