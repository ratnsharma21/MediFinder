/**
 * Base HTTP Client with JWT Token Injection and Error Normalization
 */

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
    let message = errorBody.message || errorBody.error || `HTTP error: ${response.status}`;
    if (errorBody.validationErrors && typeof errorBody.validationErrors === 'object') {
      const errList = Object.entries(errorBody.validationErrors).map(([field, msg]) => `${msg}`);
      if (errList.length > 0) {
        message = errList.join(', ');
      }
    }
    throw new ApiError(message, response.status);
  }

  return response.json();
}

export async function uploadMultipart<T>(endpoint: string, formData: FormData, requiresAuth = false): Promise<T> {
  const requestHeaders: Record<string, string> = {};

  if (requiresAuth) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || errorBody.error || `Upload failed: ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return response.json();
}

