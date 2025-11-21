import React, { useEffect, useState } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';
import { User } from '../types/User';
import { useTaskForm } from '../hooks/useTaskForm';
import { usersService } from '../services/users.service';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task; // undefined for create, Task for edit
  onSubmit: (task: CreateTaskDto | UpdateTaskDto, isUpdate: boolean) => Promise<void>;
}

/**
 * TaskForm component
 * Modal/drawer form for creating or editing tasks
 */
const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, task, onSubmit }) => {
  const {
    formData,
    errors,
    updateField,
    validate,
    reset,
    getCreateDto,
    getUpdateDto,
  } = useTaskForm(task);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // Load users when form opens in create mode
  useEffect(() => {
    if (isOpen && !task) {
      const loadUsers = async (): Promise<void> => {
        try {
          setIsLoadingUsers(true);
          const fetchedUsers = await usersService.getAll();
          setUsers(fetchedUsers);
        } catch (error) {
          console.error('Error loading users:', error);
        } finally {
          setIsLoadingUsers(false);
        }
      };
      loadUsers();
    }
  }, [isOpen, task]);

  // Reset form when task changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, task, reset]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (task) {
        // Edit mode
        const updateDto = getUpdateDto();
        if (updateDto) {
          await onSubmit(updateDto, true);
        }
      } else {
        // Create mode
        const createDto = getCreateDto();
        if (createDto) {
          await onSubmit(createDto, false);
        }
      }
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
      // Error will be handled by parent component
    }
  };

  const handleCancel = (): void => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-paypros-primary ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter task title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-paypros-primary ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter task description"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-paypros-primary ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            {/* Assigned To - Only show when creating */}
            {!task && (
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => updateField('assignedTo', e.target.value)}
                  disabled={isLoadingUsers}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paypros-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email}
                    </option>
                  ))}
                </select>
                {isLoadingUsers && (
                  <p className="mt-1 text-xs text-gray-500">Loading users...</p>
                )}
              </div>
            )}

            {/* Status */}
            {task && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value as 'TODO' | 'DOING' | 'DONE')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paypros-primary"
                >
                  <option value="TODO">To Do</option>
                  <option value="DOING">Doing</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paypros-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-paypros-primary hover:bg-paypros-accent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paypros-primary"
              >
                {task ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;

