import { apiClient } from './api';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types/Task';

/**
 * Tasks service
 * Handles CRUD operations for tasks
 */
class TasksService {
  /**
   * Get all tasks for the authenticated user
   * @param status - Optional status filter
   * @returns Array of tasks
   */
  async getAll(status?: TaskStatus): Promise<Task[]> {
    const params = status ? { status } : {};
    return apiClient.get<Task[]>('/tasks', { params });
  }

  /**
   * Get a single task by ID
   * @param id - Task ID
   * @returns Task data
   */
  async getById(id: string): Promise<Task> {
    return apiClient.get<Task>(`/tasks/${id}`);
  }

  /**
   * Create a new task
   * @param task - Task data to create
   * @returns Created task
   */
  async create(task: CreateTaskDto): Promise<Task> {
    return apiClient.post<Task>('/tasks', task);
  }

  /**
   * Update an existing task
   * @param id - Task ID
   * @param task - Updated task data
   * @returns Updated task
   */
  async update(id: string, task: UpdateTaskDto): Promise<Task> {
    return apiClient.patch<Task>(`/tasks/${id}`, task);
  }

  /**
   * Delete a task
   * @param id - Task ID
   * @returns void
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/tasks/${id}`);
  }
}

// Export singleton instance
export const tasksService = new TasksService();

