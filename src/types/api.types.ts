// API Response type matching Spring Boot's ApiResponse
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Order related types
export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  deliveryAddress: string;
  specialInstructions?: string;
}

// Order status enum matching backend
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Response types matching backend entities
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  vegetarian: boolean;
  preparationTime?: number;
  chefName: string;
  chefId: number;
}

export interface OrderItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderItems: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  specialInstructions?: string;
  estimatedDeliveryTime: string;
  createdAt: string;
}

export interface OrderItemResponse {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  studentId: number;
  studentName: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  specialInstructions?: string;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemResponse[];
}