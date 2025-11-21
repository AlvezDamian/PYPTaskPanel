import { apiClient } from './api';
import { User } from '../types/User';

/**
 * Users service
 * Handles user-related operations
 */
class UsersService {
  /**
   * Get all users (for task assignment)
   * @returns Array of users
   */
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  }

  /**
   * Get a single user by ID
   * @param id - User ID
   * @returns User data
   */
  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }
}

// Export singleton instance
export const usersService = new UsersService();

