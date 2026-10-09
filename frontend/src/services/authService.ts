// ==============================================================================
// MediFinder / MediCare - Authentication Service
// ==============================================================================

import { request } from './api';
import { ApiResponse, User, UserProfile, UserSettings } from '../types';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/constants';

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const res = await request<ApiResponse<AuthResponseData>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data?.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const res = await request<ApiResponse<AuthResponseData>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data?.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await request<ApiResponse<string>>('/auth/logout', { method: 'POST', requiresAuth: true });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  async getCurrentUser(): Promise<User> {
    const res = await request<ApiResponse<User>>('/users/me', { requiresAuth: true });
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
    return res.data;
  },

  async getUserProfile(): Promise<UserProfile> {
    const res = await request<ApiResponse<UserProfile>>('/users/me/profile', { requiresAuth: true });
    return res.data;
  },

  async getUserSettings(): Promise<UserSettings> {
    const res = await request<ApiResponse<UserSettings>>('/users/me/settings', { requiresAuth: true });
    return res.data;
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await request<ApiResponse<UserProfile>>('/users/me', {
      method: 'PATCH',
      requiresAuth: true,
      body: JSON.stringify(profile),
    });
    return res.data;
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const res = await request<ApiResponse<UserSettings>>('/users/me/settings', {
      method: 'PATCH',
      requiresAuth: true,
      body: JSON.stringify(settings),
    });
    return res.data;
  }
};
