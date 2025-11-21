import { AxiosError } from 'axios';
import { getErrorMessage, getErrorStatus } from '../../lib/errors';

/**
 * Unit tests for error handling utilities
 * Tests error message extraction and status code extraction
 */

describe('Error Utilities', () => {
  describe('getErrorMessage', () => {
    /**
     * Test: getErrorMessage() - Error de Axios con response
     * Resultado esperado: Devuelve mensaje de error del response
     * Justificación: Verifica extracción de mensajes de error de respuestas API
     */
    it('should extract error message from Axios error with response', () => {
      // Arrange
      const error: AxiosError = {
        response: {
          data: {
            message: 'User not found',
          },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('User not found');
    });

    /**
     * Test: getErrorMessage() - Error de Axios con array de mensajes
     * Resultado esperado: Devuelve mensajes unidos por comas
     * Justificación: Maneja validaciones de DTO que retornan arrays de errores
     */
    it('should join array of error messages', () => {
      // Arrange
      const error: AxiosError = {
        response: {
          data: {
            message: ['Email is required', 'Password is required'],
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('Email is required, Password is required');
    });

    /**
     * Test: getErrorMessage() - Error de Axios con error field
     * Resultado esperado: Devuelve mensaje del campo error
     * Justificación: Maneja formatos alternativos de respuesta de error
     */
    it('should extract error from error field', () => {
      // Arrange
      const error: AxiosError = {
        response: {
          data: {
            error: 'Unauthorized',
          },
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('Unauthorized');
    });

    /**
     * Test: getErrorMessage() - Error de Axios sin response (red)
     * Resultado esperado: Devuelve mensaje genérico o error.message
     * Justificación: Maneja errores de red como ERR_CONNECTION_REFUSED
     */
    it('should handle Axios error without response (network error)', () => {
      // Arrange
      const error: AxiosError = {
        message: 'Network Error',
        code: 'ERR_CONNECTION_REFUSED',
      } as AxiosError;

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('Network Error');
    });

    /**
     * Test: getErrorMessage() - Error genérico con message
     * Resultado esperado: Devuelve error.message
     * Justificación: Maneja errores estándar de JavaScript
     */
    it('should return error message for generic Error', () => {
      // Arrange
      const error = new Error('Something went wrong');

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('Something went wrong');
    });

    /**
     * Test: getErrorMessage() - String error
     * Resultado esperado: Devuelve el string directamente
     * Justificación: Maneja errores que son simplemente strings
     */
    it('should return string error directly', () => {
      // Arrange
      const error = 'Simple string error';

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('Simple string error');
    });

    /**
     * Test: getErrorMessage() - Error desconocido
     * Resultado esperado: Devuelve mensaje por defecto
     * Justificación: Maneja casos de error desconocidos o null/undefined
     */
    it('should return default message for unknown error', () => {
      // Arrange
      const error = null;

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('An unexpected error occurred');
    });

    /**
     * Test: getErrorMessage() - Error sin message field
     * Resultado esperado: Devuelve mensaje por defecto
     * Justificación: Maneja objetos Error malformados
     */
    it('should return default message when error has no message', () => {
      // Arrange
      const error = {};

      // Act
      const result = getErrorMessage(error);

      // Assert
      expect(result).toBe('An unexpected error occurred');
    });
  });

  describe('getErrorStatus', () => {
    /**
     * Test: getErrorStatus() - Extracción de status code
     * Resultado esperado: Devuelve código de estado HTTP
     * Justificación: Permite manejar errores según su código de estado
     */
    it('should extract status code from Axios error', () => {
      // Arrange
      const error: AxiosError = {
        response: {
          data: {},
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      // Act
      const result = getErrorStatus(error);

      // Assert
      expect(result).toBe(404);
    });

    /**
     * Test: getErrorStatus() - Error sin response
     * Resultado esperado: Devuelve undefined
     * Justificación: Errores de red no tienen código de estado HTTP
     */
    it('should return undefined for error without response', () => {
      // Arrange
      const error: AxiosError = {
        message: 'Network Error',
      } as AxiosError;

      // Act
      const result = getErrorStatus(error);

      // Assert
      expect(result).toBeUndefined();
    });

    /**
     * Test: getErrorStatus() - Error genérico
     * Resultado esperado: Devuelve undefined
     * Justificación: Errores genéricos no tienen código de estado
     */
    it('should return undefined for generic error', () => {
      // Arrange
      const error = new Error('Something went wrong');

      // Act
      const result = getErrorStatus(error);

      // Assert
      expect(result).toBeUndefined();
    });

    /**
     * Test: getErrorStatus() - Error null/undefined
     * Resultado esperado: Devuelve undefined
     * Justificación: Maneja casos de error nulo
     */
    it('should return undefined for null error', () => {
      // Arrange
      const error = null;

      // Act
      const result = getErrorStatus(error);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});

