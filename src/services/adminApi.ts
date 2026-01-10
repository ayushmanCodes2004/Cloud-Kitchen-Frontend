// authApi.ts - COMPLETE FIXED VERSION
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface RegisterChefRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  institution?: string;
}

export interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      phoneNumber?: string;
      institution?: string;
      verified?: boolean;
      active?: boolean;
    };
  };
}

export const authApi = {
  // ✅ Register Chef
  registerChef: async (
    payload: RegisterChefRequest
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/chef`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Chef registration failed");
    }

    // ✅ SAVE TOKEN TO LOCALSTORAGE
    if (data.success && data.data?.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // ✅ Register Student
  registerStudent: async (
    payload: RegisterStudentRequest
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Student registration failed");
    }

    // ✅ SAVE TOKEN TO LOCALSTORAGE
    if (data.success && data.data?.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // ✅ Register Admin
  registerAdmin: async (
    payload: RegisterAdminRequest
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Admin registration failed");
    }

    // ✅ SAVE TOKEN TO LOCALSTORAGE
    if (data.success && data.data?.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // ✅ Login
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ SAVE TOKEN TO LOCALSTORAGE
    if (data.success && data.data?.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // ✅ Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // ✅ Get Token
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  // ✅ Get User
  getUser: (): any | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // ✅ Check if Authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  // ✅ Get Current User from API
  getCurrentUser: async (): Promise<AuthResponse> => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error(data.message || "Authentication failed");
    }

    // Update stored user
    if (data.success && data.data) {
      localStorage.setItem("user", JSON.stringify(data.data));
    }

    return data;
  },
};

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  verified?: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handle401 = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const adminApi = {
  async getAllUsers(): Promise<UserResponse[]> {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      handle401();
      throw new Error("Unauthorized");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    return data.data || [];
  },

  async getAllChefs(): Promise<UserResponse[]> {
    const res = await fetch(`${API_BASE_URL}/admin/chefs`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      handle401();
      throw new Error("Unauthorized");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch chefs");
    return data.data || [];
  },

  async activateUser(id: number): Promise<UserResponse> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/activate`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      handle401();
      throw new Error("Unauthorized");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to activate user");
    return data.data;
  },

  async deactivateUser(id: number): Promise<UserResponse> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/deactivate`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      handle401();
      throw new Error("Unauthorized");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to deactivate user");
    return data.data;
  },

  async toggleChefVerification(id: number): Promise<UserResponse> {
    const res = await fetch(`${API_BASE_URL}/admin/chefs/${id}/toggle-verify`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      handle401();
      throw new Error("Unauthorized");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to toggle chef verification");
    return data.data;
  },
};


