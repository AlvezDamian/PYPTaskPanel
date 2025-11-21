import { User } from './User';

/**
 * Task status enum matching backend
 */
export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

/**
 * Task interface matching backend schema
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string from backend
  status: TaskStatus;
  userId: string;
  createdBy: User;
  assignedTo?: User | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * DTO for creating a new task
 */
export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status?: TaskStatus;
  assignedTo?: string; // User ID
}

/**
 * DTO for updating an existing task
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string; // ISO date string
  status?: TaskStatus;
  assignedTo?: string; // User ID
}

/**
 * Props for TaskCard component
 */
export interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => Promise<void>;
  onTaskClick: (taskId: string) => void;
  onDelete?: (taskId: string) => Promise<void>;
  isAdmin?: boolean;
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}
