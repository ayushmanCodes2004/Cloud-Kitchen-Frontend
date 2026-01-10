const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// Example:
// VITE_API_URL=https://ayushman-backend-latest.onrender.com/api

/* =======================
   TYPES
======================= */

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

/* =======================
   HELPER
======================= */

const getAuthHeaders = () => {
  // ✅ CHANGED FROM sessionStorage TO localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ✅ ADD HELPER TO HANDLE 401 ERRORS
const handle401 = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/* =======================
   API
======================= */

export const testimonialApi = {
  /* -------- STUDENT / CHEF -------- */

  async submitTestimonial(
    data: TestimonialRequest
  ): Promise<TestimonialResponse> {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to submit testimonial');
    }

    const result = await response.json();
    return result.data;
  },

  async getMyTestimonial(): Promise<TestimonialResponse | null> {
    const response = await fetch(`${API_BASE_URL}/testimonials/my`, {
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Expected JSON but received:', contentType);
      return null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch testimonial');
    }

    const result = await response.json();
    return result.data || null;
  },

  async updateTestimonial(
    id: number,
    data: TestimonialRequest
  ): Promise<TestimonialResponse> {
    const response = await fetch(
      `${API_BASE_URL}/testimonials/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to update testimonial');
    }

    const result = await response.json();
    return result.data;
  },

  async deleteTestimonial(id: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/testimonials/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to delete testimonial');
    }
  },

  /* -------- PUBLIC -------- */

  async getApprovedTestimonials(): Promise<TestimonialResponse[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testimonials/approved`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Expected JSON but received:', contentType);
        return [];
      }

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  /* -------- ADMIN -------- */

  async getPendingTestimonials(): Promise<TestimonialResponse[]> {
    const response = await fetch(
      `${API_BASE_URL}/testimonials/pending`,
      {
        headers: getAuthHeaders(),
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response');
    }

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch pending testimonials');
    }

    const result = await response.json();
    return result.data || [];
  },

  async approveTestimonial(
    id: number
  ): Promise<TestimonialResponse> {
    const response = await fetch(
      `${API_BASE_URL}/testimonials/${id}/approve`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to approve testimonial');
    }

    const result = await response.json();
    return result.data;
  },

  async rejectTestimonial(id: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/testimonials/${id}/reject`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handle401(); // ✅ Clear storage and redirect
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to reject testimonial');
    }
  },
};
