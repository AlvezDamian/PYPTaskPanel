import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Test utilities and helpers for backend tests
 */

/**
 * Create a mock PrismaService for testing
 * Returns a mock object with all Prisma methods mocked
 */
export function createMockPrismaService() {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    task: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

/**
 * Type helper for mock PrismaService
 */
export type MockPrismaService = ReturnType<typeof createMockPrismaService>;

/**
 * Get the PrismaService mock from a TestingModule
 */
export function getPrismaServiceMock(module: TestingModule): MockPrismaService {
  return module.get<PrismaService>(PrismaService) as any;
}

/**
 * Reset all mocks in a PrismaService mock
 */
export function resetPrismaServiceMock(mock: MockPrismaService): void {
  Object.values(mock.user).forEach((method) => {
    if (typeof method === 'function' && 'mockReset' in method) {
      (method as jest.Mock).mockReset();
    }
  });
  Object.values(mock.task).forEach((method) => {
    if (typeof method === 'function' && 'mockReset' in method) {
      (method as jest.Mock).mockReset();
    }
  });
  if ('mockReset' in mock.$transaction) {
    (mock.$transaction as jest.Mock).mockReset();
  }
}

/**
 * Wait for async operations to complete
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

