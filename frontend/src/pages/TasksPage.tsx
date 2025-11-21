import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../contexts/AuthContext';
import { Task, UpdateTaskDto, CreateTaskDto } from '../types/Task';
import MobileLayout from '../components/MobileLayout';
import DesktopLayout from '../components/DesktopLayout';
import TaskForm from '../components/TaskForm';
import { getErrorMessage } from '../lib/errors';

/**
 * Tasks page component
 * Main page for managing tasks
 * Uses responsive layouts for mobile and desktop
 */
const TasksPage: React.FC = () => {
  const { tasks, toggleTaskStatus, createTask, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('tasks');
  const [activeNavItem, setActiveNavItem] = useState<string>('tasks');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const isAdmin = user?.role === 'ADMIN';

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTaskClick = (taskId: string): void => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsTaskFormOpen(true);
    }
  };

  const handleNewTask = (): void => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = async (
    taskData: UpdateTaskDto | CreateTaskDto,
    isUpdate: boolean
  ): Promise<void> => {
    try {
      if (isUpdate && editingTask) {
        // Update existing task
        await updateTask(editingTask.id, taskData as UpdateTaskDto);
      } else {
        // Create new task
        await createTask(taskData as CreateTaskDto);
      }
      setIsTaskFormOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Error saving task:', errorMessage);
      // TODO: Show error notification to user
      throw error;
    }
  };

  const handleCloseTaskForm = (): void => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
  };

  const handleNavItemClick = (item: string): void => {
    setActiveNavItem(item);
    if (item === 'tasks') {
      setActiveTab('tasks');
    } else if (item === 'calendar') {
      setActiveTab('calendar');
    }
  };

  // Wrapper for toggleTaskComplete to match expected signature
  const handleToggleComplete = async (taskId: string): Promise<void> => {
    await toggleTaskStatus(taskId);
  };

  // Handler for task deletion
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Error deleting task:', errorMessage);
      alert('Error al eliminar la tarea: ' + errorMessage);
      throw error;
    }
  };

  return (
    <>
      {isMobile ? (
        <MobileLayout
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onTaskClick={handleTaskClick}
          onNewTask={handleNewTask}
          onDelete={isAdmin ? handleDeleteTask : undefined}
          isAdmin={isAdmin}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          activeNavItem={activeNavItem}
          onNavItemClick={handleNavItemClick}
        />
      ) : (
        <DesktopLayout
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onTaskClick={handleTaskClick}
          onNewTask={handleNewTask}
          onDelete={isAdmin ? handleDeleteTask : undefined}
          isAdmin={isAdmin}
          activeNavItem={activeNavItem}
          onNavItemClick={handleNavItemClick}
        />
      )}

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        task={editingTask}
        onSubmit={handleTaskFormSubmit}
      />
    </>
  );
};

export default TasksPage;
