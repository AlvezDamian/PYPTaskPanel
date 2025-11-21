import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../../src/auth/auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import {
  createMockPrismaService,
  getPrismaServiceMock,
  MockPrismaService,
} from '../../utils/test-helpers';
import {
  mockUser,
  mockUserWithPassword,
  mockRegisterDto,
  mockRegisterDtoDuplicate,
  mockLoginDto,
  mockLoginDtoInvalid,
  mockJwtToken,
  mockJwtPayload,
  mockUserId,
} from '../../fixtures/test-data';

/**
 * Unit tests for AuthService
 * Tests authentication logic including registration, login, and user validation
 */

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: MockPrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockJwtToken),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = getPrismaServiceMock(module);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    /**
     * Test: register() - Usuario nuevo exitoso
     * Resultado esperado: Devuelve objeto con accessToken y user sin password
     * Justificación: Verifica el flujo completo de registro: validación de email único,
     * hash de password, creación de usuario y generación de JWT
     */
    it('should register a new user successfully', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(mockUser);

      // Act
      const result = await service.register(mockRegisterDto);

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe(mockRegisterDto.email);
      expect(result.user.id).toBe(mockUser.id);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterDto.email },
      });
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });

      // Verify password was hashed
      const createCall = prismaService.user.create.mock.calls[0][0];
      expect(createCall.data.password).not.toBe(mockRegisterDto.password);
      const isHashed = await bcrypt.compare(
        mockRegisterDto.password,
        createCall.data.password,
      );
      expect(isHashed).toBe(true);
    });

    /**
     * Test: register() - Email duplicado (ConflictException)
     * Resultado esperado: Lanza ConflictException con mensaje apropiado
     * Justificación: Previene registros duplicados y asegura unicidad de emails
     */
    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);

      // Act & Assert
      await expect(service.register(mockRegisterDtoDuplicate)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(mockRegisterDtoDuplicate)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterDtoDuplicate.email },
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    /**
     * Test: login() - Credenciales válidas
     * Resultado esperado: Devuelve accessToken y user data sin password
     * Justificación: Verifica autenticación exitosa con credenciales correctas
     */
    it('should login user with valid credentials', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash(mockLoginDto.password, 10);
      const userWithHashedPassword = {
        ...mockUserWithPassword,
        password: hashedPassword,
      };
      prismaService.user.findUnique.mockResolvedValue(userWithHashedPassword);

      // Act
      const result = await service.login(mockLoginDto);

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe(mockLoginDto.email);
      expect(result.user.id).toBe(mockUser.id);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginDto.email },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    /**
     * Test: login() - Email inexistente (UnauthorizedException)
     * Resultado esperado: Lanza UnauthorizedException con mensaje "Invalid credentials"
     * Justificación: Previene enumeración de usuarios y asegura mensaje de error consistente
     */
    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(mockLoginDtoInvalid)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDtoInvalid)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginDtoInvalid.email },
      });
    });

    /**
     * Test: login() - Password incorrecto (UnauthorizedException)
     * Resultado esperado: Lanza UnauthorizedException con mensaje "Invalid credentials"
     * Justificación: Asegura que solo usuarios con credenciales correctas puedan autenticarse
     */
    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const userWithHashedPassword = {
        ...mockUserWithPassword,
        password: hashedPassword,
      };
      prismaService.user.findUnique.mockResolvedValue(userWithHashedPassword);

      // Act & Assert
      await expect(service.login(mockLoginDtoInvalid)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDtoInvalid)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginDtoInvalid.email },
      });
    });
  });

  describe('validateUser', () => {
    /**
     * Test: validateUser() - Usuario válido
     * Resultado esperado: Devuelve user data sin password
     * Justificación: Verifica validación de usuario por ID para JWT strategy
     */
    it('should return user when user exists', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.validateUser(mockUserId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(result).not.toHaveProperty('password');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    /**
     * Test: validateUser() - Usuario inexistente
     * Resultado esperado: Devuelve null
     * Justificación: Maneja casos donde el usuario fue eliminado después de emitir el token
     */
    it('should return null when user does not exist', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await service.validateUser('non-existent-id');

      // Assert
      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });
});

