const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  chefName: string;
}

export interface Invoice {
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  platformFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  specialInstructions?: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
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

export const invoiceApi = {
  async getInvoice(orderId: number): Promise<ApiResponse<Invoice>> {
    const response = await fetch(`${API_BASE_URL}/invoices/${orderId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401();
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch invoice');
    }

    return response.json();
  },
};
