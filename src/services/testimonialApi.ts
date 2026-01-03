const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface TestimonialRequest {
  content: string;
  rating: number;
}

export interface TestimonialResponse {
  id: number;
  userName: string;
  userRole: 'STUDENT' | 'CHEF';
  institution?: string;
  content: string;
  rating: number;
  createdAt: string;
  approved: boolean;
}

export const testimonialApi = {
  // Submit a testimonial
  submitTestimonial: async (data: TestimonialRequest): Promise<TestimonialResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit testimonial');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Get all approved testimonials (public)
  getApprovedTestimonials: async (): Promise<TestimonialResponse[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/approved`);
      
      if (!response.ok) {
        console.warn('Failed to fetch testimonials, returning empty array');
        return [];
      }
      
      const result = await response.json();
      // Handle both direct array and wrapped response
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  // Get user's own testimonial
  getMyTestimonial: async (): Promise<TestimonialResponse | null> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/testimonials/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch testimonial');
    }
    
    const result = await response.json();
    return result.data || null;
  },

  // Update existing testimonial
  updateTestimonial: async (id: number, data: TestimonialRequest): Promise<TestimonialResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update testimonial');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Delete testimonial
  deleteTestimonial: async (id: number): Promise<void> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete testimonial');
    }
  },

  // Admin: Get pending testimonials
  getPendingTestimonials: async (): Promise<TestimonialResponse[]> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/testimonials/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending testimonials');
    }
    
    const result = await response.json();
    return result.data || [];
  },

  // Admin: Approve testimonial
  approveTestimonial: async (id: number): Promise<TestimonialResponse> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve testimonial');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Admin: Reject testimonial
  rejectTestimonial: async (id: number): Promise<void> => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}/reject`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to reject testimonial');
    }
  }
};
