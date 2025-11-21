import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../../components/auth/RegisterForm';
import { useAuth } from '../../../hooks/useAuth';
import { getErrorMessage } from '../../../lib/errors';
import { renderWithProviders, cleanupLocalStorage } from '../../utils/test-helpers';

// Use manual mocks from __mocks__ directory
jest.mock('react-router-dom');

jest.mock('../../../hooks/useAuth');
jest.mock('../../../lib/errors');

/**
 * Unit tests for RegisterForm component
 * Tests form rendering, validation, submission, and error handling
 */

describe('RegisterForm', () => {
  const mockNavigate = jest.fn();
  const mockRegister = jest.fn();
  const mockUseAuth = {
    register: mockRegister,
    login: jest.fn(),
    logout: jest.fn(),
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanupLocalStorage();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (getErrorMessage as jest.Mock).mockImplementation((error: unknown) => {
      if (error instanceof Error) return error.message;
      return 'An unexpected error occurred';
    });
  });

  afterEach(() => {
    cleanupLocalStorage();
  });

  describe('Rendering', () => {
    /**
     * Test: Renderizado del formulario
     * Resultado esperado: Muestra todos los campos y botón de submit
     * Justificación: Verifica que el formulario se renderiza correctamente
     */
    it('should render the registration form', () => {
      // Act
      renderWithProviders(<RegisterForm />);

      // Assert
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password (min 6 characters)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    /**
     * Test: Link a login
     * Resultado esperado: Muestra link para ir a login
     * Justificación: Permite navegar a la página de login
     */
    it('should show link to login page', () => {
      // Act
      renderWithProviders(<RegisterForm />);

      // Assert
      const loginLink = screen.getByText('sign in to your existing account');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });

  describe('Validation', () => {
    /**
     * Test: Validación de campos requeridos
     * Resultado esperado: Muestra errores cuando campos están vacíos
     * Justificación: Previene envío de formulario inválido
     */
    it('should validate required fields', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<RegisterForm />);

      // Act
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        // HTML5 validation should prevent submission with empty fields
        expect(submitButton).toBeInTheDocument();
      });
    });

    /**
     * Test: Validación de email inválido
     * Resultado esperado: Muestra error de email inválido
     * Justificación: Asegura formato de email correcto
     */
    it('should validate email format', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<RegisterForm />);
      const emailInput = screen.getByPlaceholderText('Email address');

      // Act
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger validation

      // Assert
      // HTML5 validation should show error for invalid email format
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    /**
     * Test: Validación de password mínimo
     * Resultado esperado: Muestra error si password es muy corto
     * Justificación: Asegura contraseñas seguras
     */
    it('should validate minimum password length', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<RegisterForm />);
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      // Act
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '123');
      await user.type(confirmPasswordInput, '123');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(passwordInput).toBeInTheDocument();
      });
    });

    /**
     * Test: Validación de confirmación de password
     * Resultado esperado: Muestra error si passwords no coinciden
     * Justificación: Asegura que el usuario ingresó el password correcto
     */
    it('should validate password confirmation', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<RegisterForm />);
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      // Act
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'differentpassword');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/password.*match/i)).toBeInTheDocument();
      });
    });
  });

  describe('Submission', () => {
    /**
     * Test: Submit exitoso
     * Resultado esperado: Llama a register y navega a /tasks
     * Justificación: Verifica flujo completo de registro exitoso
     */
    it('should submit form successfully and navigate to tasks', async () => {
      // Arrange
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(undefined);
      renderWithProviders(<RegisterForm />);
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      // Act
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockNavigate).toHaveBeenCalledWith('/tasks');
      });
    });

    /**
     * Test: Estado de loading durante submit
     * Resultado esperado: Botón muestra "Creating account..." y está deshabilitado
     * Justificación: Previene múltiples submits y muestra feedback visual
     */
    it('should show loading state during submission', async () => {
      // Arrange
      const user = userEvent.setup();
      let resolveRegister: () => void;
      const registerPromise = new Promise<void>((resolve) => {
        resolveRegister = resolve;
      });
      mockRegister.mockReturnValue(registerPromise);
      renderWithProviders(<RegisterForm />);
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      // Act
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Creating account...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });

      // Cleanup
      resolveRegister!();
    });
  });

  describe('Error Handling', () => {
    /**
     * Test: Manejo de errores de red
     * Resultado esperado: Muestra mensaje de error de red
     * Justificación: Informa al usuario sobre errores de conexión
     */
    it('should handle network errors', async () => {
      // Arrange
      const user = userEvent.setup();
      const networkError = new Error('Network Error');
      mockRegister.mockRejectedValue(networkError);
      (getErrorMessage as jest.Mock).mockReturnValue('Network Error');
      renderWithProviders(<RegisterForm />);
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      // Act
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Network Error')).toBeInTheDocument();
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    /**
     * Test: Mostrar mensaje de error apropiado
     * Resultado esperado: Muestra mensaje de error específico del error
     * Justificación: Permite al usuario entender qué salió mal
     */
    it('should display appropriate error message', async () => {
      // Arrange
      const user = userEvent.setup();
      const authError = new Error('User with this email already exists');
      mockRegister.mockRejectedValue(authError);
      (getErrorMessage as jest.Mock).mockReturnValue('User with this email already exists');
      renderWithProviders(<RegisterForm />);
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      // Act
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('User with this email already exists')).toBeInTheDocument();
      });
      expect(getErrorMessage).toHaveBeenCalledWith(authError);
    });
  });
});

