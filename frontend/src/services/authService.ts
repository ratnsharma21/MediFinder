/**
 * Authentication and User Profile API Service
 */

import { request, uploadMultipart } from './api';
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
  avatarUrl?: string;
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

function persistUserChanges(changes: Partial<Pick<User, 'profile' | 'settings'>>): void {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return;

  try {
    const user = JSON.parse(storedUser) as User;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...user, ...changes }));
  } catch {
    return;
  }
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

  async registerOnly(payload: RegisterPayload): Promise<User> {
    const res = await request<ApiResponse<AuthResponseData>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data?.user;
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

  async googleLogin(payload: { idToken: string; email: string; name?: string; avatarUrl?: string }): Promise<AuthResponseData> {
    const res = await request<ApiResponse<AuthResponseData>>('/auth/google', {
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
    persistUserChanges({ profile: res.data });
    return res.data;
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const res = await request<ApiResponse<UserSettings>>('/users/me/settings', {
      method: 'PATCH',
      requiresAuth: true,
      body: JSON.stringify(settings),
    });
    persistUserChanges({ settings: res.data });
    return res.data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadMultipart<ApiResponse<{ url: string }>>('/upload/image', formData, false);
    return res.data?.url || '';
  },

  async uploadUserAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadMultipart<ApiResponse<UserProfile>>('/users/me/avatar', formData, true);
    persistUserChanges({ profile: res.data });
    return res.data;
  }
};

