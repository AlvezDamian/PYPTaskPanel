import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Users service
 * Handles user-related operations
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users (for task assignment)
   * Returns only safe user information (no password)
   * @returns Array of users with id, email, firstName, lastName, role
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        email: 'asc',
      },
    });
  }

  /**
   * Get a single user by ID
   * @param userId - User ID
   * @returns User data without password
   */
  async findOne(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
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
  }
}

