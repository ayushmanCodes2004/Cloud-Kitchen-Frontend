const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface RegisterChefRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const authApi = {
  // Register Chef (PUBLIC API – no JWT required)
  registerChef: async (
    payload: RegisterChefRequest
  ): Promise<AuthResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/auth/register/chef`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Chef registration failed");
    }

    return data;
  },

  // Login (example)
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },
};
