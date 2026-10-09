// ==============================================================================
// MediFinder / MediCare - Base HTTP Client
// ==============================================================================

import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../utils/constants';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = false, headers = {}, ...rest } = options;
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || errorBody.error || `HTTP error: ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return response.json();
}
