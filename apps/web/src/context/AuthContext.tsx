import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user || response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    console.log('Login response:', response); // Debug
    
    // Extrair token do path correto da resposta da API
    const accessToken = response.data?.tokens?.accessToken;
    const refreshToken = response.data?.tokens?.refreshToken;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data?.user));
      if (response.data?.workspaces?.length > 0) {
        localStorage.setItem('workspaceId', response.data.workspaces[0].id);
      }
      await refreshUser();
    } else {
      console.error('Token não encontrado na resposta:', response);
      throw new Error('Token de acesso não recebido');
    }
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    console.log('Register response:', response); // Debug
    
    const accessToken = response.data?.tokens?.accessToken;
    const refreshToken = response.data?.tokens?.refreshToken;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data?.user));
      if (response.data?.workspace?.id) {
        localStorage.setItem('workspaceId', response.data.workspace.id);
      }
      await refreshUser();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('workspaceId');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
