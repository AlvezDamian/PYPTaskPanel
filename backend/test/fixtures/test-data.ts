import { User, Task, TaskStatus, UserRole } from '@prisma/client';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';

/**
 * Test fixtures for backend tests
 * Provides mock data for users, tasks, and DTOs
 */

export const mockUserId = 'test-user-id-123';
export const mockUserId2 = 'test-user-id-456';
export const mockTaskId = 'test-task-id-123';
export const mockTaskId2 = 'test-task-id-456';

/**
 * Mock user data (without password)
 */
export const mockUser: Omit<User, 'password'> = {
  id: mockUserId,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.ADMIN,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

/**
 * Mock user with password (for Prisma operations)
 */
export const mockUserWithPassword: User = {
  ...mockUser,
  password: '$2b$10$hashedpasswordexample',
};

/**
 * Mock user 2 data
 */
export const mockUser2: Omit<User, 'password'> = {
  id: mockUserId2,
  email: 'test2@example.com',
  firstName: 'Test',
  lastName: 'User2',
  role: UserRole.USER,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

/**
 * Register DTO fixture
 */
export const mockRegisterDto: RegisterDto = {
  email: 'test@example.com',
  password: 'password123',
};

/**
 * Register DTO for duplicate email test
 */
export const mockRegisterDtoDuplicate: RegisterDto = {
  email: 'existing@example.com',
  password: 'password123',
};

/**
 * Login DTO fixture
 */
export const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
};

/**
 * Login DTO with invalid credentials
 */
export const mockLoginDtoInvalid: LoginDto = {
  email: 'nonexistent@example.com',
  password: 'wrongpassword',
};

/**
 * Mock task data
 */
export const mockTask: Task = {
  id: mockTaskId,
  title: 'Test Task',
  description: 'Test Description',
  dueDate: new Date('2024-12-31T00:00:00.000Z'),
  status: TaskStatus.TODO,
  userId: mockUserId,
  createdById: mockUserId,
  assignedToId: mockUserId2,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

/**
 * Mock task 2 data
 */
export const mockTask2: Task = {
  id: mockTaskId2,
  title: 'Test Task 2',
  description: 'Test Description 2',
  dueDate: new Date('2024-12-31T00:00:00.000Z'),
  status: TaskStatus.DONE,
  userId: mockUserId,
  createdById: mockUserId,
  assignedToId: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

/**
 * Task belonging to another user (for authorization tests)
 */
export const mockTaskOtherUser: Task = {
  ...mockTask,
  id: 'other-user-task-id',
  userId: mockUserId2,
  createdById: mockUserId2,
};

/**
 * Create Task DTO fixture
 */
export const mockCreateTaskDto: CreateTaskDto = {
  title: 'New Task',
  description: 'New Task Description',
  dueDate: '2024-12-31T00:00:00.000Z',
  status: TaskStatus.TODO,
};

/**
 * Mock JWT token
 */
export const mockJwtToken = 'mock.jwt.token.here';

/**
 * Mock JWT payload
 */
export const mockJwtPayload = {
  sub: mockUserId,
  email: mockUser.email,
};

