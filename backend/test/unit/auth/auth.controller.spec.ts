import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthController } from '../../../src/auth/auth.controller';
import { AuthService } from '../../../src/auth/auth.service';
import {
  mockRegisterDto,
  mockLoginDto,
  mockUser,
  mockJwtToken,
} from '../../fixtures/test-data';

/**
 * Unit tests for AuthController
 * Tests HTTP endpoints for authentication including request validation
 */

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    /**
     * Test: POST /auth/register - Request válido (201)
     * Resultado esperado: Devuelve 201 con accessToken y user data
     * Justificación: Verifica endpoint de registro exitoso
     */
    it('should register a new user successfully (201)', async () => {
      // Arrange
      const expectedResponse = {
        accessToken: mockJwtToken,
        user: mockUser,
      };
      mockAuthService.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.register(mockRegisterDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: POST /auth/register - Email duplicado (409)
     * Resultado esperado: Lanza ConflictException con código 409
     * Justificación: Verifica manejo de errores de email duplicado
     */
    it('should return 409 when email already exists', async () => {
      // Arrange
      mockAuthService.register.mockRejectedValue(
        new ConflictException('User with this email already exists'),
      );

      // Act & Assert
      await expect(controller.register(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(controller.register(mockRegisterDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
    });

    /**
     * Test: POST /auth/register - Validación DTO fallida (400)
     * Resultado esperado: Lanza BadRequestException con código 400
     * Justificación: Verifica validación de DTOs (debe ser manejado por ValidationPipe global)
     * Nota: La validación real se prueba en e2e tests, aquí solo verificamos el flujo
     */
    it('should handle invalid DTO validation (400)', async () => {
      // Arrange
      const invalidDto = { email: 'invalid-email', password: '123' };
      mockAuthService.register.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      // Act & Assert
      await expect(controller.register(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('POST /auth/login', () => {
    /**
     * Test: POST /auth/login - Credenciales válidas (200)
     * Resultado esperado: Devuelve 200 con accessToken y user data
     * Justificación: Verifica endpoint de login exitoso
     */
    it('should login user with valid credentials (200)', async () => {
      // Arrange
      const expectedResponse = {
        accessToken: mockJwtToken,
        user: mockUser,
      };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: POST /auth/login - Credenciales inválidas (401)
     * Resultado esperado: Lanza UnauthorizedException con código 401
     * Justificación: Verifica manejo de errores de autenticación
     */
    it('should return 401 when credentials are invalid', async () => {
      // Arrange
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    /**
     * Test: POST /auth/login - Validación DTO fallida (400)
     * Resultado esperado: Lanza BadRequestException con código 400
     * Justificación: Verifica validación de DTOs (debe ser manejado por ValidationPipe global)
     * Nota: La validación real se prueba en e2e tests, aquí solo verificamos el flujo
     */
    it('should handle invalid DTO validation (400)', async () => {
      // Arrange
      const invalidDto = { email: 'invalid-email', password: '' };
      mockAuthService.login.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      // Act & Assert
      await expect(controller.login(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

