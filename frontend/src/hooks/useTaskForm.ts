import { useState, useCallback } from 'react';
import { Task, CreateTaskDto, TaskStatus } from '../types/Task';

/**
 * Form state interface
 */
interface TaskFormState {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  assignedTo: string;
}

/**
 * Validation errors interface
 */
interface ValidationErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

/**
 * Return type for useTaskForm hook
 */
interface UseTaskFormReturn {
  formData: TaskFormState;
  errors: ValidationErrors;
  updateField: (field: keyof TaskFormState, value: string | TaskStatus) => void;
  validate: () => boolean;
  reset: () => void;
  getCreateDto: () => CreateTaskDto | null;
  getUpdateDto: () => Partial<CreateTaskDto> | null;
}

/**
 * Initial form state
 */
const initialFormState: TaskFormState = {
  title: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  status: 'TODO',
  assignedTo: '',
};

/**
 * Custom hook for managing task form state and validation
 * @param initialTask - Optional task to edit (if provided, form is initialized with task data)
 */
export const useTaskForm = (initialTask?: Task): UseTaskFormReturn => {
  const [formData, setFormData] = useState<TaskFormState>(() => {
    if (initialTask) {
      // Format dueDate from ISO string to YYYY-MM-DD for input[type="date"]
      const dueDate = initialTask.dueDate.split('T')[0];
      return {
        title: initialTask.title,
        description: initialTask.description,
        dueDate,
        status: initialTask.status,
        assignedTo: initialTask.assignedTo?.id || '',
      };
    }
    return initialFormState;
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Update form field value
   */
  const updateField = useCallback(
    (field: keyof TaskFormState, value: string | TaskStatus): void => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field when user starts typing
      if (errors[field as keyof ValidationErrors]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as keyof ValidationErrors];
          return newErrors;
        });
      }
    },
    [errors]
  );

  /**
   * Validate form data
   * @returns true if valid, false otherwise
   */
  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }

    // Validate due date
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(selectedDate.getTime())) {
        newErrors.dueDate = 'Invalid date format';
      } else if (selectedDate < today) {
        // Allow past dates but warn (we'll allow it for now)
        // Uncomment if you want to enforce future dates:
        // newErrors.dueDate = 'Due date must be today or in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Reset form to initial state
   */
  const reset = useCallback((): void => {
    setFormData(initialTask ? {
      title: initialTask.title,
      description: initialTask.description,
      dueDate: initialTask.dueDate.split('T')[0],
      status: initialTask.status,
      assignedTo: initialTask.assignedTo?.id || '',
    } : initialFormState);
    setErrors({});
  }, [initialTask]);

  /**
   * Get CreateTaskDto from form data
   */
  const getCreateDto = useCallback((): CreateTaskDto | null => {
    if (!validate()) {
      return null;
    }

    // Convert YYYY-MM-DD to ISO string
    const dueDateISO = new Date(formData.dueDate).toISOString();

    return {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: dueDateISO,
      status: formData.status,
      assignedTo: formData.assignedTo || undefined,
    };
  }, [formData, validate]);

  /**
   * Get UpdateTaskDto from form data (only changed fields)
   */
  const getUpdateDto = useCallback((): Partial<CreateTaskDto> | null => {
    if (!initialTask) {
      return null;
    }

    if (!validate()) {
      return null;
    }

    const dto: Partial<CreateTaskDto> = {};

    // Only include changed fields
    if (formData.title.trim() !== initialTask.title) {
      dto.title = formData.title.trim();
    }

    if (formData.description.trim() !== initialTask.description) {
      dto.description = formData.description.trim();
    }

    // Compare dates (handle timezone differences)
    const formDate = new Date(formData.dueDate).toISOString().split('T')[0];
    const taskDate = initialTask.dueDate.split('T')[0];
    if (formDate !== taskDate) {
      dto.dueDate = new Date(formData.dueDate).toISOString();
    }

    if (formData.status !== initialTask.status) {
      dto.status = formData.status;
    }

    // Return null if nothing changed
    if (Object.keys(dto).length === 0) {
      return null;
    }

    return dto;
  }, [formData, initialTask, validate]);

  return {
    formData,
    errors,
    updateField,
    validate,
    reset,
    getCreateDto,
    getUpdateDto,
  };
};

