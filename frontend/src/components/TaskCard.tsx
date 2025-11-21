import React from 'react';
import { TaskCardProps } from '../types/Task';
import { useAuth } from '../contexts/AuthContext';

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format user name for display
 */
const formatUserName = (user: { firstName?: string | null; lastName?: string | null; email: string }): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email;
};

/**
 * Get status badge color classes
 */
const getStatusBadgeClasses = (status: string): string => {
  switch (status) {
    case 'TODO':
      return 'bg-yellow-100 text-yellow-800';
    case 'DOING':
      return 'bg-blue-100 text-blue-800';
    case 'DONE':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * TaskCard component
 * Displays a single task with checkbox, title, description, due date, creator, and assignee
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onTaskClick,
  onDelete,
  isAdmin,
}) => {
  const { user } = useAuth();
  const userIsAdmin = isAdmin ?? user?.role === 'ADMIN';

  const handleToggle = async (e: React.MouseEvent<HTMLInputElement>): Promise<void> => {
    e.stopPropagation();
    await onToggleComplete(task.id);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.stopPropagation();
    if (onDelete && window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error al eliminar la tarea');
      }
    }
  };

  const isDone = task.status === 'DONE';

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={() => onTaskClick(task.id)}
    >
      {userIsAdmin && onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          aria-label="Delete task"
          title="Eliminar tarea"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => {}} // Controlled by onClick
          onClick={handleToggle}
          className={`mt-1 h-4 w-4 ${
            isDone
              ? 'text-paypros-primary border-paypros-primary'
              : 'text-gray-400 border-gray-300'
          } focus:ring-paypros-primary rounded`}
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium line-clamp-2 ${
              isDone ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {task.description}
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center space-x-2 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(task.status)}`}
              >
                {task.status === 'TODO' ? 'To Do' : task.status === 'DOING' ? 'Doing' : 'Done'}
              </span>
              <span className="text-xs text-gray-500">
                Due: {formatDate(task.dueDate)}
              </span>
            </div>
            <div className="flex flex-col space-y-0.5 text-xs text-gray-500">
              <span>
                Creada por: {formatUserName(task.createdBy)}
              </span>
              <span>
                Asignada a: {task.assignedTo ? formatUserName(task.assignedTo) : 'Sin asignar'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
