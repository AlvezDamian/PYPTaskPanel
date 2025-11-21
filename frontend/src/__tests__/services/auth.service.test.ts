import { authService } from '../../services/auth.service';
import { apiClient } from '../../services/api';
import { AuthResponse, RegisterDto, LoginDto, User } from '../../types/Auth';

// Mock apiClient
jest.mock('../../services/api', () => ({
  apiClient: {
    post: jest.fn(),
    setToken: jest.fn(),
  },
}));

/**
 * Unit tests for AuthService
 * Tests authentication service including registration, login, logout, and token management
 */

describe('AuthService', () => {
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('register', () => {
    /**
     * Test: register() - Registro exitoso y almacenamiento de token
     * Resultado esperado: Almacena token y usuario en localStorage
     * Justificación: Verifica flujo completo de registro exitoso
     */
    it('should register user successfully and store token', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const apiResponse = {
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(apiResponse);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerDto);
      expect(apiClient.setToken).toHaveBeenCalledWith(mockToken);
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser));
    });

    /**
     * Test: register() - Manejo de error de red
     * Resultado esperado: Propaga error sin almacenar datos
     * Justificación: Maneja errores de red como ERR_CONNECTION_REFUSED
     */
    it('should handle network errors during registration', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const networkError = new Error('Network Error');
      (apiClient.post as jest.Mock).mockRejectedValue(networkError);

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow('Network Error');
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(apiClient.setToken).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    /**
     * Test: login() - Login exitoso
     * Resultado esperado: Almacena token y usuario en localStorage
     * Justificación: Verifica flujo completo de login exitoso
     */
    it('should login user successfully', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const apiResponse = {
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(apiResponse);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', loginDto);
      expect(apiClient.setToken).toHaveBeenCalledWith(mockToken);
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser));
    });

    /**
     * Test: login() - Manejo de credenciales inválidas
     * Resultado esperado: Propaga error sin almacenar datos
     * Justificación: Maneja errores de autenticación
     */
    it('should handle invalid credentials during login', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const authError = new Error('Invalid credentials');
      (apiClient.post as jest.Mock).mockRejectedValue(authError);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(apiClient.setToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    /**
     * Test: logout() - Limpieza de token y datos
     * Resultado esperado: Elimina token y usuario de localStorage
     * Justificación: Verifica limpieza completa al cerrar sesión
     */
    it('should clear token and user data on logout', () => {
      // Arrange
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Act
      authService.logout();

      // Assert
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(apiClient.setToken).toHaveBeenCalledWith('');
    });
  });

  describe('getToken', () => {
    /**
     * Test: getToken() - Obtener token existente
     * Resultado esperado: Devuelve token de localStorage
     * Justificación: Permite acceso al token almacenado
     */
    it('should return token from localStorage', () => {
      // Arrange
      localStorage.setItem('auth_token', mockToken);

      // Act
      const result = authService.getToken();

      // Assert
      expect(result).toBe(mockToken);
    });

    /**
     * Test: getToken() - Token no existe
     * Resultado esperado: Devuelve null
     * Justificación: Maneja casos donde no hay token almacenado
     */
    it('should return null when token does not exist', () => {
      // Act
      const result = authService.getToken();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getUser', () => {
    /**
     * Test: getUser() - Obtener usuario existente
     * Resultado esperado: Devuelve usuario parseado de localStorage
     * Justificación: Permite acceso a datos del usuario
     */
    it('should return user from localStorage', () => {
      // Arrange
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Act
      const result = authService.getUser();

      // Assert
      expect(result).toEqual(mockUser);
    });

    /**
     * Test: getUser() - Usuario no existe
     * Resultado esperado: Devuelve null
     * Justificación: Maneja casos donde no hay usuario almacenado
     */
    it('should return null when user does not exist', () => {
      // Act
      const result = authService.getUser();

      // Assert
      expect(result).toBeNull();
    });

    /**
     * Test: getUser() - JSON inválido
     * Resultado esperado: Devuelve null
     * Justificación: Maneja casos de datos corruptos en localStorage
     */
    it('should return null for invalid JSON', () => {
      // Arrange
      localStorage.setItem('auth_user', 'invalid-json');

      // Act
      const result = authService.getUser();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    /**
     * Test: isAuthenticated() - Verificación de autenticación
     * Resultado esperado: Devuelve true si hay token, false si no
     * Justificación: Permite verificar estado de autenticación
     */
    it('should return true when token exists', () => {
      // Arrange
      localStorage.setItem('auth_token', mockToken);

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });

    /**
     * Test: isAuthenticated() - No autenticado
     * Resultado esperado: Devuelve false
     * Justificación: Identifica usuarios no autenticados
     */
    it('should return false when token does not exist', () => {
      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });
});

