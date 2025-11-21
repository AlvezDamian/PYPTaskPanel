import { apiClient } from './api';
import { User, AuthResponse, RegisterDto, LoginDto } from '../types/Auth';

/**
 * Authentication service
 * Handles user registration, login, logout, and token management
 */
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  /**
   * Register a new user
   * @param registerDto - User registration data
   * @returns Auth response with token and user data
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<{
      accessToken: string;
      user: {
        id: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
        role: 'ADMIN' | 'USER';
        createdAt: string;
        updatedAt: string;
      };
    }>('/auth/register', registerDto);

    // Transform response to match AuthResponse interface
    const authResponse: AuthResponse = {
      access_token: response.accessToken,
      user: {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
      },
    };

    // Store token and user
    this.setToken(authResponse.access_token);
    this.setUser(authResponse.user);

    return authResponse;
  }

  /**
   * Login user
   * @param loginDto - User login credentials
   * @returns Auth response with token and user data
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<{
      accessToken: string;
      user: {
        id: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
        role: 'ADMIN' | 'USER';
        createdAt: string;
        updatedAt: string;
      };
    }>('/auth/login', loginDto);

    // Transform response to match AuthResponse interface
    const authResponse: AuthResponse = {
      access_token: response.accessToken,
      user: {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
      },
    };

    // Store token and user
    this.setToken(authResponse.access_token);
    this.setUser(authResponse.user);

    return authResponse;
  }

  /**
   * Logout user - clear token and user data
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    apiClient.setToken(''); // Clear token in API client
  }

  /**
   * Get stored JWT token
   * @returns JWT token or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user data
   * @returns User data or null if not found
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns true if token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Set JWT token in storage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    apiClient.setToken(token);
  }

  /**
   * Set user data in storage
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

// Export singleton instance
export const authService = new AuthService();

