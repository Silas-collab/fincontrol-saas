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
    const token = localStorage.getItem('accessToken'); // CORRIGIDO: accessToken
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
      localStorage.removeItem('accessToken'); // CORRIGIDO
      localStorage.removeItem('refreshToken');
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
      localStorage.setItem('accessToken', accessToken); // CORRIGIDO: accessToken
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('user', JSON.stringify(response.data?.user));
      if (response.data?.workspaces?.length > 0) {
        localStorage.setItem('workspaceId', response.data.workspaces[0].id);
      }
      setUser(response.data?.user);
      setIsAuthenticated(true);
      setIsLoading(false);
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
      localStorage.setItem('accessToken', accessToken); // CORRIGIDO
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('user', JSON.stringify(response.data?.user));
      if (response.data?.workspace?.id) {
        localStorage.setItem('workspaceId', response.data.workspace.id);
      }
      setUser(response.data?.user);
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken'); // CORRIGIDO
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
