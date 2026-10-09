/**
 * Authentication and Session State Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/constants';

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    let user: User | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        user = null;
      }
    }
    return {
      token,
      user,
      isAuthenticated: !!token && !!user,
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(payload);
      setState({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
      });
      return data;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(payload);
      setState({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
      });
      return data;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.token) return;
    try {
      const user = await authService.getCurrentUser();
      setState(prev => ({ ...prev, user, isAuthenticated: true }));
    } catch {
      // If token expired
      logout();
    }
  }, [state.token, logout]);

  const updateUser = useCallback((changes: Partial<Pick<User, 'profile' | 'settings'>>) => {
    setState(prev => prev.user
      ? { ...prev, user: { ...prev.user, ...changes } }
      : prev
    );
  }, []);

  useEffect(() => {
    if (state.token && !state.user) {
      refreshUser();
    }
  }, [state.token, state.user, refreshUser]);

  return {
    ...state,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };
}
