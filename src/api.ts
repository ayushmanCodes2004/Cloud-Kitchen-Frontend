// src/api.ts
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') as string;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}
