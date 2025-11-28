import { getAuthToken } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiCall<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string; success: boolean }> {
  try {
    const token = await getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Error en la solicitud', success: false };
    }

    return { data: result.data, success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

// Métodos específicos
export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: any) =>
    apiCall<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any) =>
    apiCall<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' }),
};
