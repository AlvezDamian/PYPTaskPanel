import React from 'react';
import { Task } from '../types/Task';
import Header from './Header';
import NewTaskButton from './NewTaskButton';
import TaskSection from './TaskSection';
import BottomNavigation from './BottomNavigation';

interface DesktopLayoutProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => Promise<void>;
  onTaskClick: (taskId: string) => void;
  onNewTask: () => void;
  onDelete?: (taskId: string) => Promise<void>;
  isAdmin?: boolean;
  activeNavItem: string;
  onNavItemClick: (item: string) => void;
}

/**
 * DesktopLayout component
 * Responsive layout for desktop devices with kanban-style columns
 */
const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  tasks,
  onToggleComplete,
  onTaskClick,
  onNewTask,
  onDelete,
  isAdmin,
  activeNavItem,
  onNavItemClick,
}) => {
  const todoTasks = tasks.filter((task) => task.status === 'TODO');
  const doingTasks = tasks.filter((task) => task.status === 'DOING');
  const doneTasks = tasks.filter((task) => task.status === 'DONE');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-4">
              <NewTaskButton onClick={onNewTask} />

              {/* Additional navigation items */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div>
                <TaskSection
                  title="To Do"
                  tasks={todoTasks}
                  onToggleComplete={onToggleComplete}
                  onTaskClick={onTaskClick}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                />
              </div>

              {/* In Progress Column */}
              <div>
                <TaskSection
                  title="In Progress"
                  tasks={doingTasks}
                  onToggleComplete={onToggleComplete}
                  onTaskClick={onTaskClick}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                />
              </div>

              {/* Done Column */}
              <div>
                <TaskSection
                  title="Done"
                  tasks={doneTasks}
                  onToggleComplete={onToggleComplete}
                  onTaskClick={onTaskClick}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                />
              </div>
            </div>

            {/* Bottom Navigation for Desktop */}
            <div className="mt-8">
              <BottomNavigation
                activeItem={activeNavItem}
                onItemClick={onNavItemClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
