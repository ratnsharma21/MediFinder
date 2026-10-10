/**
 * Shared Authentication Context for MediFinder Healthcare OS
 * Ensures single source of truth for auth state across all components
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { authService, LoginPayload, RegisterPayload, AuthResponseData } from '../services/authService';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/constants';

export interface AuthContextType extends AuthState {
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<AuthResponseData>;
  register: (payload: RegisterPayload) => Promise<AuthResponseData>;
  googleLogin: (payload: { idToken: string; email: string; name?: string; avatarUrl?: string }) => Promise<AuthResponseData>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (changes: Partial<Pick<User, 'profile' | 'settings'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!currentToken) {
      setState({ token: null, user: null, isAuthenticated: false });
      return;
    }
    try {
      const user = await authService.getCurrentUser();
      setState({ token: currentToken, user, isAuthenticated: true });
    } catch {
      await logout();
    }
  }, [logout]);

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

  const googleLogin = useCallback(async (payload: { idToken: string; email: string; name?: string; avatarUrl?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.googleLogin(payload);
      setState({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
      });
      return data;
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((changes: Partial<Pick<User, 'profile' | 'settings'>>) => {
    setState(prev => prev.user
      ? { ...prev, user: { ...prev.user, ...changes } }
      : prev
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && !state.user) {
      void refreshUser();
    }
  }, [refreshUser, state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loading,
        error,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
