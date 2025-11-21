import { useState, useCallback, useEffect } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types/Task';
import { tasksService } from '../services/tasks.service';
import { getErrorMessage } from '../lib/errors';

/**
 * Return type for useTasks hook
 */
interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  createTask: (task: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, task: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
}

/**
 * Custom hook for managing tasks
 * Handles CRUD operations, loading states, and error handling
 */
export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all tasks from API
   */
  const fetchTasks = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await tasksService.getAll();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(new Error(errorMessage));
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch tasks on mount
   */
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /**
   * Create a new task
   */
  const createTask = useCallback(async (task: CreateTaskDto): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await tasksService.create(task);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (id: string, task: UpdateTaskDto): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedTask = await tasksService.update(id, task);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a task
   */
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await tasksService.delete(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Toggle task status: TODO → DOING → DONE → TODO
   */
  const toggleTaskStatus = useCallback(
    async (id: string): Promise<void> => {
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }

      let newStatus: TaskStatus;
      switch (task.status) {
        case 'TODO':
          newStatus = 'DOING';
          break;
        case 'DOING':
          newStatus = 'DONE';
          break;
        case 'DONE':
          newStatus = 'TODO';
          break;
        default:
          newStatus = 'TODO';
      }

      await updateTask(id, { status: newStatus });
    },
    [tasks, updateTask]
  );

  /**
   * Refresh tasks list
   */
  const refreshTasks = useCallback(async (): Promise<void> => {
    await fetchTasks();
  }, [fetchTasks]);

  /**
   * Get tasks filtered by status
   */
  const getTasksByStatus = useCallback(
    (status: TaskStatus): Task[] => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refreshTasks,
    getTasksByStatus,
  };
};
