import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authService.getProfile();
          setUser(response.data || response);
          authService.setUser(response.data || response);
        } catch (error) {
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    // Backend retorna: { success, message, data: { user, tokens, workspaces } }
    const { user, tokens, workspaces } = response.data || response;
    
    authService.setTokens(tokens.accessToken, tokens.refreshToken);
    // Usa primeira workspace ou a primeira da lista
    const defaultWorkspaceId = workspaces?.[0]?.id || user?.defaultWorkspaceId;
    if (defaultWorkspaceId) {
      authService.setWorkspace(defaultWorkspaceId);
    }
    setUser(user);
    authService.setUser(user);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    // Backend retorna: { success, message, data: { user, tokens, workspace } }
    const { user, tokens, workspace } = response.data || response;
    
    authService.setTokens(tokens.accessToken, tokens.refreshToken);
    if (workspace?.id) {
      authService.setWorkspace(workspace.id);
    }
    setUser(user);
    authService.setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await authService.getProfile();
    const profile = response.data || response;
    setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
