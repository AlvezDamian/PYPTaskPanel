import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse, RegisterDto, LoginDto } from '../types/Auth';
import { authService } from '../services/auth.service';
import { getErrorMessage } from '../lib/errors';

/**
 * Authentication context value interface
 */
interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication provider component
 * Manages authentication state and provides auth operations to children
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const loginDto: LoginDto = { email, password };
      const response: AuthResponse = await authService.login(loginDto);
      
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   * @param email - User email
   * @param password - User password
   */
  const register = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const registerDto: RegisterDto = { email, password };
      const response: AuthResponse = await authService.register(registerDto);
      
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback((): void => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 * @returns Authentication context value
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

