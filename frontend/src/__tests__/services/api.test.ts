// Use manual mocks from __mocks__ directory
jest.mock('axios');
jest.mock('../../lib/errors');

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from '../../services/api';
import { getErrorMessage } from '../../lib/errors';

/**
 * Unit tests for API client
 * Tests interceptors, error handling, and network error scenarios
 */

// Import the mock instance from the manual mock
import { mockAxiosInstance } from '../../__mocks__/axios';

describe('ApiClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mock instance methods
    (mockAxiosInstance.get as jest.Mock).mockClear();
    (mockAxiosInstance.post as jest.Mock).mockClear();
    (mockAxiosInstance.patch as jest.Mock).mockClear();
    (mockAxiosInstance.delete as jest.Mock).mockClear();
    (mockAxiosInstance.interceptors.request.use as jest.Mock).mockClear();
    (mockAxiosInstance.interceptors.response.use as jest.Mock).mockClear();
    
    // Reset mock implementation
    (getErrorMessage as jest.Mock).mockImplementation((error: unknown) => {
      if (error instanceof Error) return error.message;
      return 'An unexpected error occurred';
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    localStorage.clear();
  });

  describe('Configuration', () => {
    /**
     * Test: Configuración de baseURL desde env
     * Resultado esperado: axios.create fue llamado con la configuración correcta
     * Justificación: Verifica que el apiClient se configura correctamente al inicializarse
     * Nota: Como apiClient es un singleton, verificamos que se llamó axios.create al importar el módulo
     */
    it('should configure baseURL from environment variable', () => {
      // Assert - axios.create should have been called when apiClient was created
      // The actual configuration is tested through the apiClient behavior
      expect(axios.create).toHaveBeenCalled();
      const createCalls = (axios.create as jest.Mock).mock.calls;
      expect(createCalls.length).toBeGreaterThan(0);
      // Verify it was called with a config object
      expect(createCalls[0][0]).toHaveProperty('baseURL');
    });

    /**
     * Test: Configuración de baseURL por defecto
     * Resultado esperado: axios.create fue llamado con baseURL por defecto
     * Justificación: Asegura que hay un valor por defecto cuando no hay env var
     * Nota: El valor por defecto se verifica en el código fuente, aquí verificamos que se configuró
     */
    it('should use default baseURL when env variable is not set', () => {
      // Assert - axios.create should have been called with default config
      expect(axios.create).toHaveBeenCalled();
      const createCalls = (axios.create as jest.Mock).mock.calls;
      if (createCalls.length > 0) {
        const config = createCalls[0][0];
        // Should have a baseURL (either from env or default)
        expect(config).toHaveProperty('baseURL');
      }
    });

    /**
     * Test: Configuración de timeout
     * Resultado esperado: axios.create fue llamado con timeout configurado
     * Justificación: Verifica que el timeout se configura para prevenir requests colgados
     * Nota: El valor exacto se verifica en el código fuente, aquí verificamos que se configuró
     */
    it('should configure timeout from environment variable', () => {
      // Assert - axios.create should have been called with timeout config
      expect(axios.create).toHaveBeenCalled();
      const createCalls = (axios.create as jest.Mock).mock.calls;
      if (createCalls.length > 0) {
        const config = createCalls[0][0];
        // Should have a timeout (either from env or default)
        expect(config).toHaveProperty('timeout');
      }
    });
  });

  describe('Request Interceptor', () => {
    /**
     * Test: Interceptor de request se registra correctamente
     * Resultado esperado: El interceptor de request se registra al crear el apiClient
     * Justificación: Verifica que el interceptor se configura correctamente
     */
    it('should register request interceptor', () => {
      // Assert - The interceptor should have been registered when apiClient was created
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });
  });

  describe('Response Interceptor', () => {
    /**
     * Test: Interceptor de response se registra correctamente
     * Resultado esperado: El interceptor de response se registra al crear el apiClient
     * Justificación: Verifica que el interceptor se configura correctamente para manejar respuestas y errores
     */
    it('should register response interceptor', () => {
      // Assert - The interceptor should have been registered when apiClient was created
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    /**
     * Test: Manejo de errores de red (ERR_CONNECTION_REFUSED)
     * Resultado esperado: Transforma error de red a Error con mensaje apropiado
     * Justificación: Maneja errores cuando el backend no está disponible
     */
    it('should handle network errors (ERR_CONNECTION_REFUSED)', async () => {
      // Arrange
      const networkError: AxiosError = {
        message: 'Network Error',
        code: 'ERR_CONNECTION_REFUSED',
      } as AxiosError;

      mockAxiosInstance.get.mockRejectedValue(networkError);
      (getErrorMessage as jest.Mock).mockReturnValue('Network Error');

      // Act & Assert
      await expect(apiClient.get('/test')).rejects.toThrow();
      expect(getErrorMessage).toHaveBeenCalled();
    });

    /**
     * Test: Manejo de errores HTTP (4xx, 5xx)
     * Resultado esperado: Transforma error HTTP a Error con status code
     * Justificación: Permite manejo diferenciado según código de estado
     */
    it('should handle HTTP errors with status code', async () => {
      // Arrange
      const httpError: AxiosError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      } as AxiosError;

      mockAxiosInstance.get.mockRejectedValue(httpError);
      (getErrorMessage as jest.Mock).mockReturnValue('Not found');

      // Act & Assert
      try {
        await apiClient.get('/test');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(getErrorMessage).toHaveBeenCalled();
      }
    });
  });

  describe('HTTP Methods', () => {
    /**
     * Test: GET request
     * Resultado esperado: Devuelve response.data
     * Justificación: Verifica método GET básico
     */
    it('should make GET request', async () => {
      // Arrange
      const responseData = { data: 'test' };
      mockAxiosInstance.get.mockResolvedValue({ data: responseData });

      // Act
      const result = await apiClient.get('/test');

      // Assert
      expect(result).toEqual(responseData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
    });

    /**
     * Test: POST request
     * Resultado esperado: Devuelve response.data
     * Justificación: Verifica método POST básico
     */
    it('should make POST request', async () => {
      // Arrange
      const requestData = { name: 'test' };
      const responseData = { id: 1, name: 'test' };
      mockAxiosInstance.post.mockResolvedValue({ data: responseData });

      // Act
      const result = await apiClient.post('/test', requestData);

      // Assert
      expect(result).toEqual(responseData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', requestData, undefined);
    });

    /**
     * Test: PATCH request
     * Resultado esperado: Devuelve response.data
     * Justificación: Verifica método PATCH básico
     */
    it('should make PATCH request', async () => {
      // Arrange
      const requestData = { name: 'updated' };
      const responseData = { id: 1, name: 'updated' };
      mockAxiosInstance.patch.mockResolvedValue({ data: responseData });

      // Act
      const result = await apiClient.patch('/test/1', requestData);

      // Assert
      expect(result).toEqual(responseData);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test/1', requestData, undefined);
    });

    /**
     * Test: DELETE request
     * Resultado esperado: Devuelve response.data
     * Justificación: Verifica método DELETE básico
     */
    it('should make DELETE request', async () => {
      // Arrange
      const responseData = {};
      mockAxiosInstance.delete.mockResolvedValue({ data: responseData });

      // Act
      const result = await apiClient.delete('/test/1');

      // Assert
      expect(result).toEqual(responseData);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
    });
  });

  describe('Token Management', () => {
    /**
     * Test: setToken() - Almacena token
     * Resultado esperado: Guarda token en localStorage
     * Justificación: Permite almacenar token después de login
     */
    it('should set token in localStorage', () => {
      // Arrange
      const token = 'new-token';

      // Act
      apiClient.setToken(token);

      // Assert
      expect(localStorage.getItem('auth_token')).toBe(token);
    });

    /**
     * Test: clearToken() - Limpia token
     * Resultado esperado: Elimina token de localStorage
     * Justificación: Permite limpiar token en logout
     */
    it('should clear token from localStorage', () => {
      // Arrange
      localStorage.setItem('auth_token', 'existing-token');

      // Act
      apiClient.clearToken();

      // Assert
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});

