/**
 * User role enum
 */
export type UserRole = 'ADMIN' | 'USER';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * DTO for user registration
 */
export interface RegisterDto {
  email: string;
  password: string;
}

/**
 * DTO for user login
 */
export interface LoginDto {
  email: string;
  password: string;
}

