// Use manual mocks from __mocks__ directory
jest.mock('react-router-dom');
jest.mock('../../services/auth.service');
jest.mock('../../lib/errors');

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { getErrorMessage } from '../../lib/errors';

/**
 * Unit tests for useAuth hook
 * Tests authentication state management and operations
 */

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (getErrorMessage as jest.Mock).mockImplementation((error: unknown) => {
      if (error instanceof Error) return error.message;
      return 'An unexpected error occurred';
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    /**
     * Test: Hook de autenticación con estados iniciales
     * Resultado esperado: Devuelve estados iniciales correctos
     * Justificación: Verifica inicialización correcta del hook
     */
    it('should return initial authentication state', async () => {
      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
      });
    });

    /**
     * Test: Inicialización desde localStorage
     * Resultado esperado: Carga estado desde localStorage al montar
     * Justificación: Mantiene sesión entre recargas de página
     */
    it('should initialize from localStorage', async () => {
      // Arrange
      const mockUser = { id: 'test-id', email: 'test@example.com' };
      const mockToken = 'test-token';
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      (authService.getToken as jest.Mock).mockReturnValue(mockToken);
      (authService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await waitFor(() => {
        expect(result.current.token).toBe(mockToken);
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  describe('Login', () => {
    /**
     * Test: Login exitoso actualiza estado
     * Resultado esperado: Actualiza user, token e isAuthenticated
     * Justificación: Verifica flujo completo de login exitoso
     */
    it('should update state on successful login', async () => {
      // Arrange
      const mockUser = { id: 'test-id', email: 'test@example.com' };
      const mockToken = 'test-token';
      const mockAuthResponse = {
        access_token: mockToken,
        user: mockUser,
      };
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Assert
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe(mockToken);
        expect(result.current.isAuthenticated).toBe(true);
        expect(authService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    /**
     * Test: Manejo de errores durante login
     * Resultado esperado: Propaga error sin actualizar estado
     * Justificación: Maneja errores de autenticación correctamente
     */
    it('should handle errors during login', async () => {
      // Arrange
      const authError = new Error('Invalid credentials');
      (authService.login as jest.Mock).mockRejectedValue(authError);
      (getErrorMessage as jest.Mock).mockReturnValue('Invalid credentials');

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await act(async () => {
        await expect(
          result.current.login('test@example.com', 'wrongpassword'),
        ).rejects.toThrow('Invalid credentials');
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('Register', () => {
    /**
     * Test: Register exitoso actualiza estado
     * Resultado esperado: Actualiza user, token e isAuthenticated
     * Justificación: Verifica flujo completo de registro exitoso
     */
    it('should update state on successful register', async () => {
      // Arrange
      const mockUser = { id: 'test-id', email: 'test@example.com' };
      const mockToken = 'test-token';
      const mockAuthResponse = {
        access_token: mockToken,
        user: mockUser,
      };
      (authService.register as jest.Mock).mockResolvedValue(mockAuthResponse);

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register('test@example.com', 'password123');
      });

      // Assert
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe(mockToken);
        expect(result.current.isAuthenticated).toBe(true);
        expect(authService.register).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    /**
     * Test: Manejo de errores durante register
     * Resultado esperado: Propaga error sin actualizar estado
     * Justificación: Maneja errores de registro correctamente
     */
    it('should handle errors during register', async () => {
      // Arrange
      const registerError = new Error('User with this email already exists');
      (authService.register as jest.Mock).mockRejectedValue(registerError);
      (getErrorMessage as jest.Mock).mockReturnValue('User with this email already exists');

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await act(async () => {
        await expect(
          result.current.register('existing@example.com', 'password123'),
        ).rejects.toThrow('User with this email already exists');
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('Logout', () => {
    /**
     * Test: Logout limpia estado
     * Resultado esperado: Limpia user, token e isAuthenticated
     * Justificación: Verifica limpieza completa al cerrar sesión
     */
    it('should clear state on logout', async () => {
      // Arrange
      const mockUser = { id: 'test-id', email: 'test@example.com' };
      const mockToken = 'test-token';
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      (authService.getToken as jest.Mock).mockReturnValue(mockToken);
      (authService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      act(() => {
        result.current.logout();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(authService.logout).toHaveBeenCalled();
      });
    });
  });
});

