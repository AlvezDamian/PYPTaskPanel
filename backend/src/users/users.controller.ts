import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Users controller
 * Handles user-related endpoints
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users (for task assignment)
   * @returns Array of users (without password)
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Get a single user by ID
   * @param id - User ID
   * @returns User data (without password)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}

